import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import type { CreateBusinessCategoryBody, UpdateBusinessCategoryBody } from "./categories.dto";
import { CategoriesService } from "./categories.service";

@Controller("businesses/:businessSlug/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  listBusinessCategories(@Param("businessSlug") businessSlug: string) {
    return this.categoriesService.listBusinessCategories(businessSlug);
  }

  @Post()
  createBusinessCategory(
    @Param("businessSlug") businessSlug: string,
    @Body() body: CreateBusinessCategoryBody
  ) {
    return this.categoriesService.createBusinessCategory(businessSlug, body);
  }

  @Patch(":categoryId")
  updateBusinessCategory(
    @Param("businessSlug") businessSlug: string,
    @Param("categoryId") categoryId: string,
    @Body() body: UpdateBusinessCategoryBody
  ) {
    return this.categoriesService.updateBusinessCategory(businessSlug, categoryId, body);
  }

  @Delete(":categoryId")
  deleteBusinessCategory(
    @Param("businessSlug") businessSlug: string,
    @Param("categoryId") categoryId: string
  ) {
    return this.categoriesService.deleteBusinessCategory(businessSlug, categoryId);
  }
}
