import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";

import type { DeleteCustomerResponse, SaveCustomerBody, CustomerListResponse, CafeCustomer } from "./customers.dto";
import { CustomersService } from "./customers.service";

@Controller("pos/customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  listCustomers(
    @Headers("x-business-slug") businessSlug = "tj-cafe-vientiane",
    @Query() query: { q?: string; status?: string }
  ): Promise<CustomerListResponse> {
    return this.customersService.listBusinessCustomers(businessSlug, query);
  }

  @Get(":customerId")
  getCustomer(
    @Headers("x-business-slug") businessSlug = "tj-cafe-vientiane",
    @Param("customerId") customerId: string
  ): Promise<CafeCustomer> {
    return this.customersService.getBusinessCustomer(businessSlug, customerId);
  }

  @Post()
  createCustomer(
    @Headers("x-business-slug") businessSlug = "tj-cafe-vientiane",
    @Body() body: SaveCustomerBody
  ): Promise<CafeCustomer> {
    return this.customersService.createBusinessCustomer(businessSlug, body);
  }

  @Patch(":customerId")
  updateCustomer(
    @Headers("x-business-slug") businessSlug = "tj-cafe-vientiane",
    @Param("customerId") customerId: string,
    @Body() body: SaveCustomerBody
  ): Promise<CafeCustomer> {
    return this.customersService.updateBusinessCustomer(businessSlug, customerId, body);
  }

  @Delete(":customerId")
  deleteCustomer(
    @Headers("x-business-slug") businessSlug = "tj-cafe-vientiane",
    @Param("customerId") customerId: string
  ): Promise<DeleteCustomerResponse> {
    return this.customersService.deleteBusinessCustomer(businessSlug, customerId);
  }
}
