import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";
import { ItemsController } from "./items.controller";
import { ItemsService } from "./items.service";
import { PosItemsController } from "./pos-items.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [ItemsController, PosItemsController],
  providers: [ItemsService],
  exports: [ItemsService]
})
export class ItemsModule {}
