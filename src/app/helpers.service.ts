import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from './constants.service';
import { ContractService } from './contract.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(
    public wallet: WalletService,
    public contract: ContractService,
    public constants: ConstantsService
  ) {
  }

  async getTokenPriceUSD(address: string): Promise<number> {
    const apiStr = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}/market_chart/?vs_currency=usd&days=0`;
    const rawResult = await this.httpsGet(apiStr, 300);
    return rawResult.prices[0][1];
  }

  processWeb3Number(number): string {
    return new BigNumber(number).integerValue().toFixed();
  }

  async httpsGet(apiStr, cacheMaxAge: number = 60) {
    const request = await fetch(apiStr, { headers: { 'Cache-Control': `max-age=${cacheMaxAge}` } });
    return await request.json();
  }
}
