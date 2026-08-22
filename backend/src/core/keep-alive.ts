import { env } from '../config/env';
import axios from 'axios';

let keepAliveIntervalId: NodeJS.Timeout | null = null;

/**
 * Normalizes a URL so that it includes protocol (https://) and removes trailing slashes.
 */
function normalizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, '');
}

/**
 * Pings the target URL over HTTP/HTTPS to keep the server awake on Render.
 */
export async function pingServer(targetBaseUrl: string): Promise<boolean> {
  try {
    const baseUrl = normalizeUrl(targetBaseUrl);
    const pingUrl = `${baseUrl}/ping`;
    const startTime = Date.now();

    const response = await axios.get(pingUrl, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Skillist-KeepAlive/1.0',
        'Cache-Control': 'no-cache',
      },
    });

    const duration = Date.now() - startTime;
    console.log(`💓 [KeepAlive] Ping successful to ${pingUrl} (Status: ${response.status}, Time: ${duration}ms)`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [KeepAlive] Ping warning: ${error?.response?.status ? `HTTP ${error.response.status}` : error?.message || error}`);
    return false;
  }
}

/**
 * Starts the self-pinging keep-alive background worker.
 * 
 * How it works:
 * On Render (free tier), services spin down after 15 minutes of inactivity.
 * Pinging the external public URL (e.g. https://<app>.onrender.com/ping) every 10 minutes
 * registers incoming public HTTP traffic on Render's routing layer, keeping the service 
 * permanently active and eliminating cold starts.
 */
export function startKeepAlive(): () => void {
  const isEnabled = env.ENABLE_KEEP_ALIVE !== 'false' && env.ENABLE_KEEP_ALIVE !== '0';

  if (!isEnabled) {
    console.log('ℹ️ [KeepAlive] Keep-alive service is disabled (ENABLE_KEEP_ALIVE=false)');
    return () => {};
  }

  // Detect public external URL (Render automatically sets RENDER_EXTERNAL_URL or RENDER_EXTERNAL_HOSTNAME)
  const rawTargetUrl =
    env.KEEP_ALIVE_URL ||
    env.RENDER_EXTERNAL_URL ||
    (process.env.RENDER_EXTERNAL_HOSTNAME ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` : undefined) ||
    env.BACKEND_URL;

  const intervalMs = parseInt(env.KEEP_ALIVE_INTERVAL_MS, 10) || 600000; // default: 10 minutes (600,000ms)

  if (!rawTargetUrl) {
    console.log('ℹ️ [KeepAlive] No external URL detected.');
    console.log('ℹ️ [KeepAlive] On Render: RENDER_EXTERNAL_URL is set automatically.');
    console.log('ℹ️ [KeepAlive] Custom domain: set KEEP_ALIVE_URL (e.g. https://api.yourdomain.com)');
    return () => {};
  }

  const targetUrl = normalizeUrl(rawTargetUrl);
  console.log(`⏰ [KeepAlive] Auto-wake service active for ${targetUrl} (Interval: ${Math.round(intervalMs / 60000)} minutes)`);

  // First ping after 20 seconds to give the server time to fully bind and register
  const initialTimeout = setTimeout(() => {
    pingServer(targetUrl);
  }, 20000);

  // Repeating periodic ping (every 10 minutes)
  keepAliveIntervalId = setInterval(() => {
    pingServer(targetUrl);
  }, intervalMs);

  // Return teardown function for graceful shutdown
  return () => {
    clearTimeout(initialTimeout);
    if (keepAliveIntervalId) {
      clearInterval(keepAliveIntervalId);
      keepAliveIntervalId = null;
    }
  };
}
