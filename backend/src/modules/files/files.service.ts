import { BadRequestException, Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};

@Injectable()
export class FilesService {
  async saveImage(file?: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }

    const extension = allowedImageTypes[file.mimetype];

    if (!extension) {
      throw new BadRequestException("Only JPG, PNG, and WebP images are allowed");
    }

    if (file.size > maxImageSize) {
      throw new BadRequestException("Image must be 5MB or smaller");
    }

    const uploadDir = join(process.cwd(), "uploads", "images");
    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const relativePath = `/uploads/images/${fileName}`;

    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), file.buffer);

    return {
      url: `${this.getPublicBaseUrl()}${relativePath}`,
      path: relativePath,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  }

  private getPublicBaseUrl() {
    return (process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3001}`).replace(/\/$/, "");
  }
}
