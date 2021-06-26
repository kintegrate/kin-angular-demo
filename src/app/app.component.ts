import { Component } from '@angular/core'
import { createWallet, KinClient, KinTest, Wallet } from '@kin-sdk/client'

@Component({
  selector: 'app-root',
  template: `
    <button (click)="go()">Go</button>
    <pre>wallet {{ wallet | json }}</pre>
    <pre>balances: {{ balances | json }}</pre>
    <pre>destination: {{ destination | json }}</pre>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  readonly kin = new KinClient(KinTest)
  balances
  wallet
  destination

  async go() {
    this.wallet = createWallet('create')
    await this.kin.createAccount(this.wallet.secret).then(() => {
      console.log('Wallet Created')
    })
    await this.checkBalance()
    await this.airDrop()
    await this.checkBalance()
    await this.kin.submitPayment({
      secret: this.wallet.secret,
      tokenAccount: this.wallet.publicKey,
      amount: '50000',
      destination: 'Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ',
    })
    await this.checkBalance()
  }

  async airDrop() {
    await this.kin.requestAirdrop(this.wallet.publicKey, '50000').then((res) => {
      console.log('Airdrop', res)
    })
  }

  async checkBalance() {
    await this.kin.getBalances(this.wallet.publicKey).then((balances) => {
      this.balances = balances
    })

    await this.kin.getBalances('Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ').then((balances) => {
      this.destination = balances
    })
  }
}
