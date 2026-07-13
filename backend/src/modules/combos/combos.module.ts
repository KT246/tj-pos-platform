import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";
import { CombosController } from "./combos.controller";
import { CombosService } from "./combos.service";

@Module({
  imports: [DatabaseModule],
  controllers: [CombosController],
  providers: [CombosService],
  exports: [CombosService]
})
export class CombosModule {}
