import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { PosAccountsController } from "./pos-accounts.controller";
import { PosAccountsService } from "./pos-accounts.service";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PosAccountsController],
  providers: [PosAccountsService]
})
export class PosAccountsModule {}
