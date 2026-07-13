import { Injectable, OnModuleDestroy } from "@nestjs/common";
import postgres, { type Sql } from "postgres";

const sslModes = new Set(["allow", "prefer", "require", "verify-full"] as const);
type SslMode = typeof sslModes extends Set<infer Mode> ? Mode : never;

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly sql: Sql;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }

    const configuredSslMode = process.env.DATABASE_SSL;
    const ssl = sslModes.has(configuredSslMode as SslMode)
      ? (configuredSslMode as SslMode)
      : false;
    const maxConnections = Number(process.env.DATABASE_MAX_CONNECTIONS ?? 10);

    this.sql = postgres(databaseUrl, {
      max: Number.isFinite(maxConnections) ? Math.max(1, Math.floor(maxConnections)) : 10,
      connect_timeout: 5,
      idle_timeout: 20,
      ssl,
      connection: {
        client_encoding: "UTF8"
      }
    });
  }

  async onModuleDestroy() {
    await this.sql.end({ timeout: 5 });
  }
}
