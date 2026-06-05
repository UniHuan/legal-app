import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// 缓存配置: 内容数据1小时过期, 场景3分钟
const CONTENT_TTL = 3600;
const SCENE_TTL = 180;

// 内部缓存包装器
function withCache<T>(fn: (...args: any[]) => Promise<T>, keyParts: string[], ttl: number) {
  return unstable_cache(fn, keyParts, { revalidate: ttl });
}

export { CONTENT_TTL, SCENE_TTL, withCache };
