import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import { AuthService } from "../auth/auth.service";
import type { SavePromotionBody } from "./promotions.dto";
import { PromotionsService } from "./promotions.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";
const systemCreatorLabel = "ລະບົບ";

@Controller("pos/promotions")
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly authService: AuthService
  ) {}

  @Get()
  listPromotions(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("q") q?: string,
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    return this.promotionsService.listBusinessPromotions(resolveBusinessSlug(businessSlug), {
      q,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });
  }

  @Get(":promotionId")
  getPromotion(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("promotionId") promotionId: string
  ) {
    return this.promotionsService.getBusinessPromotion(resolveBusinessSlug(businessSlug), promotionId);
  }

  @Post()
  async createPromotion(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SavePromotionBody
  ) {
    return this.promotionsService.createBusinessPromotion(resolveBusinessSlug(businessSlug), {
      ...body,
      createdBy: await this.resolveCreatorName(authorization)
    });
  }

  @Patch(":promotionId")
  updatePromotion(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("promotionId") promotionId: string,
    @Body() body: SavePromotionBody
  ) {
    return this.promotionsService.updateBusinessPromotion(resolveBusinessSlug(businessSlug), promotionId, {
      ...body,
      createdBy: undefined
    });
  }

  @Delete(":promotionId")
  deletePromotion(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("promotionId") promotionId: string
  ) {
    return this.promotionsService.deleteBusinessPromotion(resolveBusinessSlug(businessSlug), promotionId);
  }

  private async resolveCreatorName(authorization?: string) {
    const accessToken = extractBearerToken(authorization);
    if (!accessToken) return systemCreatorLabel;

    try {
      const session = await this.authService.getBusinessSession(accessToken);

      return canUseSessionAsPromotionCreator(session.role) ? session.role : systemCreatorLabel;
    } catch {
      return systemCreatorLabel;
    }
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}

function extractBearerToken(authorization?: string) {
  if (!authorization?.startsWith("Bearer ")) return "";

  return authorization.slice("Bearer ".length).trim();
}

function canUseSessionAsPromotionCreator(role: string) {
  const normalized = role.trim().toLowerCase();

  return (
    normalized === "owner" ||
    normalized === "admin" ||
    normalized === "administrator" ||
    normalized === "chủ quán" ||
    normalized === "chu quan" ||
    normalized.includes("ເຈົ້າຂອງ")
  );
}
