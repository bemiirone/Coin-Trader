import axios, { AxiosResponse } from 'axios';
import { env } from '../config/env';

export interface CMCStatus {
  timestamp: string;
  error_code: number;
  error_message: string | null;
  elapsed: number;
  credit_count: number;
  notice: string | null;
  total_count: number;
}

export interface CMCCoinData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  infinite_supply: boolean;
  platform: string | null;
  cmc_rank: number;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
  tvl_ratio: number | null;
  last_updated: string;
  quote: {
    USD: {
      price: number;
      volume_24h?: number;
      volume_change_24h?: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d?: number;
      percent_change_60d?: number;
      percent_change_90d?: number;
      market_cap: number;
      last_updated?: string;
    };
  };
}

export interface CMCResponse {
  status: CMCStatus;
  data: CMCCoinData[];
}

export class CMCService {
  private cachedData: CMCResponse | null = null;
  private lastFetchTime: Date | null = null;
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = env.CMC_API_KEY;
    this.apiUrl = env.CMC_API_URL;
  }

  async fetchPrices(limit: number = 500): Promise<CMCResponse> {
    try {
      const response: AxiosResponse<CMCResponse> = await axios.get(this.apiUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
        },
        params: {
          start: '1',
          limit: String(limit),
          convert: 'USD',
        },
      });

      this.cachedData = response.data;
      this.lastFetchTime = new Date();
      console.log(`CMC API: Fetched ${response.data.data.length} coins successfully`);
      
      return response.data;
    } catch (error) {
      console.error('CMC API: Failed to fetch prices:', error instanceof Error ? error.message : error);
      
      if (this.cachedData) {
        console.log('CMC API: Serving stale cache data');
        return this.cachedData;
      }
      
      throw new Error('Failed to fetch coin prices from CMC API');
    }
  }

  getCachedPrices(): CMCResponse | null {
    return this.cachedData;
  }

  isCacheStale(maxAgeMs: number = 60000): boolean {
    if (!this.lastFetchTime || !this.cachedData) {
      return true;
    }
    
    const now = new Date();
    const ageMs = now.getTime() - this.lastFetchTime.getTime();
    return ageMs > maxAgeMs;
  }
}

export const cmcService = new CMCService();
