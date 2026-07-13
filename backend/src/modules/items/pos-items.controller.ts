import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import type { CreateBusinessItemBody } from "./items.dto";
import { ItemsService } from "./items.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/items")
export class PosItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  listItems(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("q") q?: string,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    return this.itemsService.listBusinessItems(resolveBusinessSlug(businessSlug), {
      q,
      category,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });
  }

  @Get("check-barcode")
  checkBarcode(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("barcode") barcode?: string,
    @Query("excludeItemId") excludeItemId?: string
  ) {
    return this.itemsService.checkBarcode(resolveBusinessSlug(businessSlug), barcode, excludeItemId);
  }

  @Get(":itemId")
  getItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string
  ) {
    return this.itemsService.getBusinessItem(resolveBusinessSlug(businessSlug), itemId);
  }

  @Post()
  createItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: CreateBusinessItemBody
  ) {
    return this.itemsService.createBusinessItem(resolveBusinessSlug(businessSlug), body);
  }

  @Patch(":itemId")
  updateItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string,
    @Body() body: CreateBusinessItemBody
  ) {
    return this.itemsService.updateBusinessItem(resolveBusinessSlug(businessSlug), itemId, body);
  }

  @Delete(":itemId")
  deleteItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string
  ) {
    return this.itemsService.deleteBusinessItem(resolveBusinessSlug(businessSlug), itemId);
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}
