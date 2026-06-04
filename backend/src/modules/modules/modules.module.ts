import { Module } from "@nestjs/common";

import { FeatureModulesController } from "./modules.controller";
import { FeatureModulesService } from "./modules.service";

@Module({
  controllers: [FeatureModulesController],
  providers: [FeatureModulesService],
  exports: [FeatureModulesService]
})
export class FeatureModulesModule {}
