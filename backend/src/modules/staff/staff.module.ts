import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";
import { StaffController } from "./staff.controller";
import { StaffHrController } from "./staff-hr.controller";
import { StaffHrService } from "./staff-hr.service";
import { StaffService } from "./staff.service";

@Module({
  imports: [DatabaseModule],
  controllers: [StaffController, StaffHrController],
  providers: [StaffService, StaffHrService],
  exports: [StaffService]
})
export class StaffModule {}
