import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  PRECISION = 1e18;
  ZERO_ADDR = '0x0000000000000000000000000000000000000000';
  MPH = '0x8888801af4d980682e47f1a9036e589479e835c5';
  EIN = '0x25deb74aAC0A426B77bd897fBf063ba4AC52EE96';
  WETH_ADDR = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  MULTIPLIER = 1e9;
  UNLOCK_TIME = 24 * 60 * 60;
  INF = new BigNumber(2).pow(256).minus(1);
}
