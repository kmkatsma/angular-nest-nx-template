import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  HttpExceptionFilter,
  LogService,
  ResponseInterceptor,
} from '@ocw/api-core';
import * as express from 'express';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logService = new LogService();
  const app = await NestFactory.create(AppModule, {
    logger: logService,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({ origin: process.env.ORIGIN, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));
  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter(logService));
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
