// WebSocket client for live updates
import type { LiveFrame } from '@/types/api';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

export interface ConnectLiveOptions {
  meteorId: string;
  onFrame: (frame: LiveFrame) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
}

/**
 * Connect to live WebSocket stream
 * Returns a disconnect function
 */
export function connectLive(options: ConnectLiveOptions): () => void {
  const { meteorId, onFrame, onError, onClose } = options;
  const url = `${WS_BASE_URL}/ws/live?meteorId=${encodeURIComponent(meteorId)}`;

  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;
  let intentionallyClosed = false;

  function connect() {
    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('[WS] Connected to live stream:', meteorId);
      };

      ws.onmessage = (event) => {
        try {
          const frame: LiveFrame = JSON.parse(event.data);
          onFrame(frame);
        } catch (error) {
          console.error('[WS] Failed to parse frame:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('[WS] Connection closed');
        onClose?.();

        // Attempt reconnect if not intentionally closed
        if (!intentionallyClosed) {
          reconnectTimeout = setTimeout(() => {
            console.log('[WS] Attempting reconnect...');
            connect();
          }, 2000);
        }
      };
    } catch (error) {
      console.error('[WS] Failed to connect:', error);
    }
  }

  connect();

  // Return disconnect function
  return () => {
    intentionallyClosed = true;
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    if (ws) {
      ws.close();
      ws = null;
    }
  };
}

/**
 * WebSocket connection manager with debouncing
 */
export class LiveStreamManager {
  private disconnect: (() => void) | null = null;
  private currentMeteorId: string | null = null;
  private debounceTimeout: NodeJS.Timeout | null = null;

  /**
   * Connect to a meteor's live stream with debouncing
   */
  connect(options: ConnectLiveOptions) {
    // If connecting to the same meteor, ignore
    if (this.currentMeteorId === options.meteorId && this.disconnect) {
      return;
    }

    // Clear any pending reconnect
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Disconnect existing connection
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }

    // Debounce rapid reconnects
    this.debounceTimeout = setTimeout(() => {
      this.currentMeteorId = options.meteorId;
      this.disconnect = connectLive(options);
    }, 100);
  }

  /**
   * Disconnect from current stream
   */
  close() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
    this.currentMeteorId = null;
  }

  /**
   * Check if connected to a specific meteor
   */
  isConnected(meteorId: string): boolean {
    return this.currentMeteorId === meteorId && this.disconnect !== null;
  }
}
