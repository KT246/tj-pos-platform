import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";

import type { CreateBusinessItemBody } from "./items.dto";
import { ItemsService } from "./items.service";

@Controller("businesses/:businessSlug/items")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  listBusinessItems(
    @Param("businessSlug") businessSlug: string,
    @Query("q") q?: string,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    return this.itemsService.listBusinessItems(businessSlug, {
      q,
      category,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });
  }

  @Get("check-barcode")
  checkBarcode(
    @Param("businessSlug") businessSlug: string,
    @Query("barcode") barcode?: string,
    @Query("excludeItemId") excludeItemId?: string
  ) {
    return this.itemsService.checkBarcode(businessSlug, barcode, excludeItemId);
  }

  @Get(":itemId")
  getBusinessItem(
    @Param("businessSlug") businessSlug: string,
    @Param("itemId") itemId: string
  ) {
    return this.itemsService.getBusinessItem(businessSlug, itemId);
  }

  @Post()
  createBusinessItem(
    @Param("businessSlug") businessSlug: string,
    @Body() body: CreateBusinessItemBody
  ) {
    return this.itemsService.createBusinessItem(businessSlug, body);
  }

  @Patch(":itemId")
  updateBusinessItem(
    @Param("businessSlug") businessSlug: string,
    @Param("itemId") itemId: string,
    @Body() body: CreateBusinessItemBody
  ) {
    return this.itemsService.updateBusinessItem(businessSlug, itemId, body);
  }

  @Delete(":itemId")
  deleteBusinessItem(
    @Param("businessSlug") businessSlug: string,
    @Param("itemId") itemId: string
  ) {
    return this.itemsService.deleteBusinessItem(businessSlug, itemId);
  }
}
