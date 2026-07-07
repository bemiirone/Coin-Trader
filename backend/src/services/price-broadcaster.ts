import { Namespace } from 'socket.io';
import { cmcService } from './cmc.service';
import { PriceUpdate } from '../sockets/types';

export class PriceBroadcaster {
  private intervalId: NodeJS.Timeout | null = null;
  private pricesNamespace: Namespace;
  private isRunning: boolean = false;

  constructor(pricesNamespace: Namespace) {
    this.pricesNamespace = pricesNamespace;
  }

  start(intervalMs: number = 30000): void {
    if (this.isRunning) {
      console.log('PriceBroadcaster: Already running, ignoring start call');
      return;
    }

    this.isRunning = true;
    console.log(`PriceBroadcaster: Starting with ${intervalMs / 1000}s interval`);

    // Initial fetch and broadcast
    this.broadcast();

    // Set up interval for subsequent broadcasts
    this.intervalId = setInterval(() => {
      this.broadcast();
    }, intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('PriceBroadcaster: Stopped');
  }

  private async broadcast(): Promise<void> {
    try {
      const cmcResponse = await cmcService.fetchPrices();
      
      const priceUpdates: PriceUpdate[] = cmcResponse.data.map(coin => ({
        coin_id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.quote.USD.price,
        change24h: coin.quote.USD.percent_change_24h,
        marketCap: coin.quote.USD.market_cap,
        volume24h: coin.quote.USD.volume_24h || 0,
      }));

      this.pricesNamespace.emit('price_update', priceUpdates);
      
      const connectedClients = this.pricesNamespace.sockets.size;
      console.log(`PriceBroadcaster: Broadcasted ${priceUpdates.length} price updates to ${connectedClients} clients`);
    } catch (error) {
      console.error('PriceBroadcaster: Failed to broadcast prices:', error instanceof Error ? error.message : error);
    }
  }
}

export const createPriceBroadcaster = (pricesNamespace: Namespace): PriceBroadcaster => {
  return new PriceBroadcaster(pricesNamespace);
};
