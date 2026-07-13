import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("images")
  @UseInterceptors(FileInterceptor("file", {
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  }))
  uploadImage(@UploadedFile() file?: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }) {
    return this.filesService.saveImage(file);
  }
}
