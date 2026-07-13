import { Body, Controller, Get, Param, Patch } from "@nestjs/common";

import type { UpdateBusinessBrandingBody } from "./branding.dto";
import { BrandingService } from "./branding.service";

@Controller("businesses/:businessSlug/branding")
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  getBusinessBranding(@Param("businessSlug") businessSlug: string) {
    return this.brandingService.getBusinessBranding(businessSlug);
  }

  @Patch()
  updateBusinessBranding(
    @Param("businessSlug") businessSlug: string,
    @Body() body: UpdateBusinessBrandingBody
  ) {
    return this.brandingService.updateBusinessBranding(businessSlug, body);
  }
}
