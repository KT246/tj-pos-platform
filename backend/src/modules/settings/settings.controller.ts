import { Body, Controller, Get, Headers, Patch, Post } from "@nestjs/common";

import type {
  UpdateAppearanceBody,
  UpdateBusinessSettingsBody,
  UpdateCustomerBody,
  UpdateNotificationBody,
  UpdateOpeningHoursBody,
  UpdatePaymentsBody,
  UpdatePrinterBody,
  UpdateReceiptBody,
  UpdateTableBody,
  UpdateTaxBody
} from "./settings.dto";
import { SettingsService } from "./settings.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@Headers("x-business-slug") businessSlug: string | undefined) {
    return this.settingsService.getBusinessSettings(resolveBusinessSlug(businessSlug));
  }

  @Patch("business")
  updateBusiness(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateBusinessSettingsBody
  ) {
    return this.settingsService.updateBusiness(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("hours")
  updateOpeningHours(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateOpeningHoursBody
  ) {
    return this.settingsService.updateOpeningHours(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("payments")
  updatePayments(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdatePaymentsBody
  ) {
    return this.settingsService.updatePayments(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("tables")
  updateTables(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateTableBody
  ) {
    return this.settingsService.updateTables(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("customers")
  updateCustomers(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateCustomerBody
  ) {
    return this.settingsService.updateCustomers(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("printers")
  updatePrinter(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdatePrinterBody
  ) {
    return this.settingsService.updatePrinter(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("tax")
  updateTax(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateTaxBody
  ) {
    return this.settingsService.updateTax(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("receipt")
  updateReceipt(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateReceiptBody
  ) {
    return this.settingsService.updateReceipt(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("appearance")
  updateAppearance(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateAppearanceBody
  ) {
    return this.settingsService.updateAppearance(resolveBusinessSlug(businessSlug), body);
  }

  @Patch("notifications")
  updateNotifications(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Body() body: UpdateNotificationBody
  ) {
    return this.settingsService.updateNotifications(resolveBusinessSlug(businessSlug), body);
  }

  @Post("backup")
  runBackup(@Headers("x-business-slug") businessSlug: string | undefined) {
    return this.settingsService.runBackup(resolveBusinessSlug(businessSlug));
  }
}

function resolveBusinessSlug(value: string | undefined) {
  const slug = value?.trim();

  return slug || defaultCafeBusinessSlug;
}
