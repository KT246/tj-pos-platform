import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";

import type { BusinessLoginBody } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("business/login")
  async loginBusiness(
    @Body() body: BusinessLoginBody,
    @Headers("x-business-slug") businessSlug?: string
  ) {
    return this.authService.loginBusiness(
      body.username ?? body.email ?? "",
      body.password ?? "",
      Boolean(body.rememberMe),
      businessSlug
    );
  }

  @Get("me")
  async me(@Headers("authorization") authorization?: string) {
    const accessToken = this.extractBearerToken(authorization);

    return this.authService.getBusinessSession(accessToken);
  }

  @Post("logout")
  logout() {
    return { ok: true };
  }

  private extractBearerToken(authorization?: string) {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    return authorization.slice("Bearer ".length).trim();
  }
}
