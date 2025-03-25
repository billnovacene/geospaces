
import { TempHumidityResponse } from "../interfaces/temp-humidity";

// Type for the cache entries
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Type for the cache storage
interface CacheStorage {
  [key: string]: CacheEntry<any>;
}

// In-memory cache storage
const cacheStorage: CacheStorage = {};

// Cache expiration time (in milliseconds) - default 30 minutes
const DEFAULT_CACHE_DURATION = 30 * 60 * 1000;

/**
 * Generates a cache key for temperature and humidity data
 */
export const getTempHumidityKey = (siteId?: string, zoneId?: string): string => {
  return `temp-humidity:${siteId || 'all'}:${zoneId || 'all'}`;
};

/**
 * Store data in the cache
 */
export const cacheTempHumidityData = (
  data: TempHumidityResponse, 
  siteId?: string, 
  zoneId?: string,
  duration: number = DEFAULT_CACHE_DURATION
): void => {
  const key = getTempHumidityKey(siteId, zoneId);
  const now = Date.now();
  
  cacheStorage[key] = {
    data,
    timestamp: now,
    expiresAt: now + duration
  };
  
  console.log(`📦 Cached temperature data for ${key} (expires in ${duration/1000/60} minutes)`);
};

/**
 * Retrieve data from the cache if it exists and is not expired
 */
export const getCachedTempHumidityData = (
  siteId?: string, 
  zoneId?: string
): TempHumidityResponse | null => {
  const key = getTempHumidityKey(siteId, zoneId);
  const cachedEntry = cacheStorage[key];
  
  if (!cachedEntry) {
    console.log(`❌ No cached data found for ${key}`);
    return null;
  }
  
  const now = Date.now();
  if (now > cachedEntry.expiresAt) {
    console.log(`⏰ Cached data for ${key} has expired`);
    delete cacheStorage[key]; // Clean up expired entry
    return null;
  }
  
  const ageInMinutes = Math.round((now - cachedEntry.timestamp) / 1000 / 60);
  console.log(`✅ Using cached temperature data for ${key} (${ageInMinutes} minutes old)`);
  
  return cachedEntry.data;
};

/**
 * Clear all cached temperature and humidity data
 */
export const clearTempHumidityCache = (): void => {
  Object.keys(cacheStorage).forEach(key => {
    if (key.startsWith('temp-humidity:')) {
      delete cacheStorage[key];
    }
  });
  console.log('🧹 Temperature and humidity cache cleared');
};
