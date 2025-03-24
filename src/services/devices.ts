
// Re-export everything from the new files
export * from "./device-types";
export * from "./device-cache";
export * from "./device-zones";
export * from "./device-sites";

// Export devices API with alias to maintain backward compatibility
export { fetchDevicesCountForSite as fetchDevicesCount } from "./device-sites";
