import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import type { NextFunction, Request, Response } from "express";
import { join } from "path";

import { AppModule } from "./app.module";

function enforceJsonUtf8(_request: Request, response: Response, next: NextFunction) {
  const json = response.json.bind(response);

  response.json = (body) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    return json(body);
  };

  next();
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT ?? 3001);

  app.enableCors({
    origin: true,
    credentials: true
  });

  app.use(enforceJsonUtf8);

  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/"
  });

  await app.listen(port);
}

void bootstrap();
