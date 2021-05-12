import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import { HelpersService } from '../helpers.service';
import { ConstantsService } from '../constants.service';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.css'],
})
export class SwapComponent implements OnInit {
  DECIMALS = 4;

  isWoofing: boolean;
  mphBalance: BigNumber;
  einBalance: BigNumber;
  mphAllowance: BigNumber;
  inputAmount: BigNumber;

  constructor(
    public wallet: WalletService,
    public contract: ContractService,
    public helpers: HelpersService,
    public constants: ConstantsService
  ) {
    this.resetData(true, true);
  }

  ngOnInit(): void {
    this.loadData(this.wallet.connected, true);
    this.wallet.connectedEvent.subscribe(() => {
      this.resetData(true, false);
      this.loadData(true, false);
    });
    this.wallet.disconnectedEvent.subscribe(() => {
      this.resetData(true, false);
    });
  }

  async loadData(loadUser: boolean, loadGlobal: boolean) {
    const readonlyWeb3 = this.wallet.readonlyWeb3();

    if (loadUser) {
      const mphToken = this.contract.getNamedContract('MPHToken', readonlyWeb3);
      mphToken.methods
        .balanceOf(this.wallet.userAddress)
        .call()
        .then((mphBalance) => {
          this.mphBalance = new BigNumber(mphBalance).div(
            this.constants.PRECISION
          );
        });
      mphToken.methods
        .allowance(this.wallet.userAddress, this.constants.EIN)
        .call()
        .then((allowance) => {
          this.mphAllowance = new BigNumber(allowance).div(
            this.constants.PRECISION
          );
        });

      const einToken = this.contract.getNamedContract('Einstein', readonlyWeb3);
      einToken.methods
        .balanceOf(this.wallet.userAddress)
        .call()
        .then((balance) => {
          this.einBalance = new BigNumber(balance).div(
            this.constants.PRECISION
          );
        });
    }
  }

  resetData(resetUser: boolean, resetGlobal: boolean): void {
    if (resetUser) {
      this.mphBalance = new BigNumber(0);
      this.einBalance = new BigNumber(0);
      this.mphAllowance = new BigNumber(0);
      this.inputAmount = new BigNumber(0);
    }

    if (resetGlobal) {
      this.isWoofing = true;
    }
  }

  updateInputAmount(newAmount: string) {
    this.inputAmount = new BigNumber(newAmount);
  }

  maxPower() {
    if (this.isWoofing) {
      this.inputAmount = this.mphBalance;
    } else {
      this.inputAmount = this.einBalance;
    }
  }

  async approve() {
    const mphToken = this.contract.getNamedContract('MPHToken');
    const spender = this.constants.EIN;
    const allowance = this.helpers.processWeb3Number(this.constants.INF);
    const func = mphToken.methods.approve(spender, allowance);

    await this.wallet.sendTx(
      func,
      () => {},
      () => {
        this.mphAllowance = this.constants.INF;
      },
      (err) => {
        this.wallet.displayGenericError(err);
      }
    );
  }

  async woof() {
    const einToken = this.contract.getNamedContract('Einstein');
    const mphAmount = this.helpers.processWeb3Number(
      this.inputAmount.times(this.constants.PRECISION)
    );
    const func = einToken.methods.woof(mphAmount);

    await this.wallet.sendTx(
      func,
      () => {},
      () => {
        this.loadData(true, false);
      },
      (err) => {
        this.wallet.displayGenericError(err);
      }
    );
  }

  async unwoof() {
    const einToken = this.contract.getNamedContract('Einstein');
    const einAmount = this.helpers.processWeb3Number(
      this.inputAmount.times(this.constants.PRECISION)
    );
    const func = einToken.methods.unwoof(einAmount);

    await this.wallet.sendTx(
      func,
      () => {},
      () => {
        this.loadData(true, false);
      },
      (err) => {
        this.wallet.displayGenericError(err);
      }
    );
  }

  canWoof(): boolean {
    return this.mphAllowance.gte(this.inputAmount);
  }

  einToMPH(einAmount: BigNumber): BigNumber {
    return einAmount.div(this.constants.MULTIPLIER);
  }

  mphToEIN(mphAmount: BigNumber): BigNumber {
    return mphAmount.times(this.constants.MULTIPLIER);
  }
}
