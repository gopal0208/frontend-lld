export const pubSubCode = `type Callback = (data: any) => void;

/**
 * Pub-Sub Pattern - Core Implementation
 * A messaging pattern where senders (publishers) do not program target receivers (subscribers) directly.
 * Instead, messages are categorized into channels/topics without knowledge of subscribers.
 */
export class PubSubBroker {
  private channels: Record<string, Set<Callback>> = {};

  // 1. Subscribe to a specific channel/topic
  public subscribe(channel: string, callback: Callback): () => void {
    if (!this.channels[channel]) {
      this.channels[channel] = new Set();
    }
    
    this.channels[channel].add(callback);

    // Return unsubscribe function
    return () => {
      this.channels[channel]?.delete(callback);
      if (this.channels[channel]?.size === 0) {
        delete this.channels[channel];
      }
    };
  }

  // 2. Publish data to a channel (triggers all subscribers on that channel)
  public publish(channel: string, data: any): void {
    if (!this.channels[channel]) return;
    
    this.channels[channel].forEach((callback) => {
      callback(data);
    });
  }

  // 3. Clear all channels
  public clearAll(): void {
    this.channels = {};
  }
}
`;
