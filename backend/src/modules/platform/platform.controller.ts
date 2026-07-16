import { Body, Controller, Headers, Post } from "@nestjs/common";

import type { ProvisionPosClientBody } from "./platform.dto";
import { PlatformService } from "./platform.service";

@Controller("platform")
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post("pos-clients")
  provisionPosClient(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: ProvisionPosClientBody
  ) {
    return this.platformService.provisionPosClient(body, authorization);
  }
}
