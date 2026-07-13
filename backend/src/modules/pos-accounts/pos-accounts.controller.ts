import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from "@nestjs/common";

import type { SavePosAccountBody } from "./pos-accounts.dto";
import { PosAccountsService } from "./pos-accounts.service";

const defaultCafeBusinessSlug = "tj-cafe-vientiane";

@Controller("pos/settings/pos-accounts")
export class PosAccountsController {
  constructor(private readonly posAccountsService: PosAccountsService) {}

  @Get()
  list(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Headers("authorization") authorization?: string
  ) {
    return this.posAccountsService.listAccounts(
      resolveBusinessSlug(businessSlug),
      authorization
    );
  }

  @Post()
  create(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Headers("authorization") authorization: string | undefined,
    @Body() body: SavePosAccountBody
  ) {
    return this.posAccountsService.createAccount(
      resolveBusinessSlug(businessSlug),
      body,
      authorization
    );
  }

  @Patch(":accountId")
  update(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Headers("authorization") authorization: string | undefined,
    @Param("accountId") accountId: string,
    @Body() body: SavePosAccountBody
  ) {
    return this.posAccountsService.updateAccount(
      resolveBusinessSlug(businessSlug),
      accountId,
      body,
      authorization
    );
  }

  @Delete(":accountId")
  deactivate(
    @Headers("x-business-slug") businessSlug: string | undefined,
    @Headers("authorization") authorization: string | undefined,
    @Param("accountId") accountId: string
  ) {
    return this.posAccountsService.deactivateAccount(
      resolveBusinessSlug(businessSlug),
      accountId,
      authorization
    );
  }
}

function resolveBusinessSlug(value: string | undefined) {
  return value?.trim() || defaultCafeBusinessSlug;
}
