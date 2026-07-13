import { Injectable, OnModuleDestroy } from "@nestjs/common";
import postgres, { type Sql } from "postgres";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly sql: Sql;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }

    this.sql = postgres(databaseUrl, {
      max: 10,
      connect_timeout: 5,
      idle_timeout: 20,
      connection: {
        client_encoding: "UTF8"
      }
    });
  }

  async onModuleDestroy() {
    await this.sql.end({ timeout: 5 });
  }
}
