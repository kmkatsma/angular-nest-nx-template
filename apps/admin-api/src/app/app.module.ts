import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreAzAdModule, RequestContextMiddleware } from '@ocw/api-core';
import { ManagerModule } from '@ocw/api-services';

@Module({
  imports: [CoreAzAdModule.forRoot(), ManagerModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
