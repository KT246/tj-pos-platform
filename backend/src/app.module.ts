import { Module } from "@nestjs/common";

import { AppConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { RedisModule } from "./redis/redis.module";
import { WorkerModule } from "./worker/worker.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PlatformModule } from "./modules/platform/platform.module";
import { BusinessesModule } from "./modules/businesses/businesses.module";
import { BranchesModule } from "./modules/branches/branches.module";
import { StaffModule } from "./modules/staff/staff.module";
import { RolesModule } from "./modules/roles/roles.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ItemsModule } from "./modules/items/items.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { SuppliersModule } from "./modules/suppliers/suppliers.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { LoyaltyModule } from "./modules/loyalty/loyalty.module";
import { PromotionsModule } from "./modules/promotions/promotions.module";
import { TablesModule } from "./modules/tables/tables.module";
import { KitchenModule } from "./modules/kitchen/kitchen.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { RoomsModule } from "./modules/rooms/rooms.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { ReceiptModule } from "./modules/receipt/receipt.module";
import { BrandingModule } from "./modules/branding/branding.module";
import { FeatureModulesModule } from "./modules/modules/modules.module";
import { SupportModule } from "./modules/support/support.module";
import { FilesModule } from "./modules/files/files.module";
import { ImportExportModule } from "./modules/import-export/import-export.module";

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    WorkerModule,
    AuthModule,
    PlatformModule,
    BusinessesModule,
    BranchesModule,
    StaffModule,
    RolesModule,
    CategoriesModule,
    ItemsModule,
    OrdersModule,
    PaymentsModule,
    InventoryModule,
    SuppliersModule,
    CustomersModule,
    LoyaltyModule,
    PromotionsModule,
    TablesModule,
    KitchenModule,
    AppointmentsModule,
    RoomsModule,
    ReportsModule,
    ReceiptModule,
    BrandingModule,
    FeatureModulesModule,
    SupportModule,
    FilesModule,
    ImportExportModule
  ]
})
export class AppModule {}
