import { Component, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';
import { ConstantsService } from '../constants.service';
import { ContractService } from '../contract.service';
import { HelpersService } from '../helpers.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  mphBalance: BigNumber;
  einBalance: BigNumber;

  constructor(
    public wallet: WalletService,
    public contract: ContractService,
    public constants: ConstantsService,
    public helpers: HelpersService
  ) {
    this.resetData(true, true);
  }

  ngOnInit(): void {
    this.loadData(this.wallet.connected, true);
    this.wallet.connectedEvent.subscribe(() => {
      this.resetData(true, true);
      this.loadData(true, true);
    });
    this.wallet.disconnectedEvent.subscribe(() => {
      this.resetData(true, false);
    });
  }

  async loadData(loadUser: boolean, loadGlobal: boolean) {
    const readonlyWeb3 = this.wallet.readonlyWeb3();

    if (loadUser && this.wallet.connected) {
      const mphToken = this.contract.getNamedContract('MPHToken', readonlyWeb3);
      mphToken.methods
        .balanceOf(this.wallet.userAddress)
        .call()
        .then((mphBalance) => {
          this.mphBalance = new BigNumber(mphBalance).div(
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

    if (loadGlobal) {
    }
  }

  resetData(resetUser: boolean, resetGlobal: boolean): void {
    if (resetUser) {
      this.mphBalance = new BigNumber(0);
      this.einBalance = new BigNumber(0);
    }

    if (resetGlobal) {
    }
  }

  connectWallet() {
    this.wallet.connect(
      () => {},
      () => {},
      false
    );
  }
}
