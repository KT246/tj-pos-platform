import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import type { SaveComboBody } from "./combos.dto";
import { CombosService } from "./combos.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/combos")
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Get()
  listCombos(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Query("q") q?: string,
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string
  ) {
    return this.combosService.listBusinessCombos(resolveBusinessSlug(businessSlug), {
      q,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined
    });
  }

  @Get(":comboId")
  getCombo(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("comboId") comboId: string
  ) {
    return this.combosService.getBusinessCombo(resolveBusinessSlug(businessSlug), comboId);
  }

  @Post()
  createCombo(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: SaveComboBody
  ) {
    return this.combosService.createBusinessCombo(resolveBusinessSlug(businessSlug), body);
  }

  @Patch(":comboId")
  updateCombo(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("comboId") comboId: string,
    @Body() body: SaveComboBody
  ) {
    return this.combosService.updateBusinessCombo(resolveBusinessSlug(businessSlug), comboId, body);
  }

  @Delete(":comboId")
  deleteCombo(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Param("comboId") comboId: string
  ) {
    return this.combosService.deleteBusinessCombo(resolveBusinessSlug(businessSlug), comboId);
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}
