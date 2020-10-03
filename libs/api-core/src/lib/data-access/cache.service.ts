import { Injectable } from '@nestjs/common';
import { LogService } from '../logging/log.service';
import * as NodeCache from 'node-cache';
import { RequestContext } from '../middleware/models';

@Injectable()
export class CacheUtil {
  memoryCache: any;
  constructor(private logService: LogService) {
    this.memoryCache = new NodeCache({ maxKeys: 1000, stdTTL: 600 });
  }

  get<T>(key: string): T {
    return this.memoryCache.get(this.buildKey(key)) as T;
  }

  mget(keys: string[]): any {
    return this.memoryCache.mget(this.buildKeys(keys));
  }

  set<T>(key: string, value: T) {
    this.memoryCache.set(this.buildKey(key), value);
  }

  delete<T>(key: string): T {
    return this.memoryCache.del(this.buildKey(key)) as T;
  }

  private buildKeys(keys: string[]) {
    const formattedKeys = [];
    keys.forEach(p => {
      formattedKeys.push(this.buildKey(p));
    });
    return keys;
  }

  private buildKey(key: string) {
    return `${key}|${RequestContext.currentUser().tenantId}`;
  }
}
