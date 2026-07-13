import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import type { SaveStockItemBody, StockMovementBody } from "./inventory.dto";
import { InventoryService } from "./inventory.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/stock")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  listStockItems(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("q") q?: string,
    @Query("category") category?: string,
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    return this.inventoryService.listBusinessStockItems(resolveBusinessSlug(businessSlug), {
      q,
      category,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });
  }

  @Get(":itemId")
  getStockItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string
  ) {
    return this.inventoryService.getBusinessStockItem(resolveBusinessSlug(businessSlug), itemId);
  }

  @Post()
  createStockItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: SaveStockItemBody
  ) {
    return this.inventoryService.createBusinessStockItem(resolveBusinessSlug(businessSlug), body);
  }

  @Patch(":itemId")
  updateStockItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string,
    @Body() body: SaveStockItemBody
  ) {
    return this.inventoryService.updateBusinessStockItem(resolveBusinessSlug(businessSlug), itemId, body);
  }

  @Post(":itemId/movements")
  createMovement(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string,
    @Body() body: StockMovementBody
  ) {
    return this.inventoryService.createBusinessStockMovement(resolveBusinessSlug(businessSlug), itemId, body);
  }

  @Delete(":itemId")
  deleteStockItem(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("itemId") itemId: string
  ) {
    return this.inventoryService.deleteBusinessStockItem(resolveBusinessSlug(businessSlug), itemId);
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}
