/**
 * Provider-neutral contract for backend-only educational video rendering.
 * This module deliberately contains no provider SDK, fetch call or credential.
 * Implementations belong in a trusted backend environment, never in the browser.
 */
export const VIDEO_PROVIDER_METHODS = Object.freeze(['createJob', 'getJob', 'downloadAsset']);

export function assertVideoProvider(provider) {
  if (!provider || typeof provider !== 'object') throw new TypeError('A video provider adapter object is required.');
  const missing = VIDEO_PROVIDER_METHODS.filter(method => typeof provider[method] !== 'function');
  if (missing.length) throw new TypeError(`Video provider adapter is missing: ${missing.join(', ')}.`);
  return provider;
}

export class UnconfiguredVideoProvider {
  async createJob() { throw new Error('No video provider is configured. Connect and configure an approved provider on the backend.'); }
  async getJob() { throw new Error('No video provider is configured.'); }
  async downloadAsset() { throw new Error('No video provider is configured.'); }
}
