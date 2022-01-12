import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react';
import Token from '../abis/FleepToken.json'
import Web3 from 'web3';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum)
      const netId = await web3.eth.net.getId();

      const accounts = await web3.eth.getAccounts()
      console.log('netId:' + netId + "accounts:" + JSON.stringify(accounts));

      //load balance
      if (typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({ account: accounts[0], balance: balance, web3: web3 })
      } else {
        window.alert('Please login with MetaMask')
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        // const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
        // const dBankAddress = dBank.networks[netId].address
        this.setState(
          {
            token: token,
            tokenAddress: Token.networks[netId].address,
            tokenName: Token.contractName
          })
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }

  /**
   * write
   */
  async addTaxList(_address) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.addToApplyTaxList(_address).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ addTaxList: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async removeTaxList(_address) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.removeApplyTaxList(_address).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ removeTaxList: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async addIgnoreList(_address) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.addToIgnoreTaxList(_address).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ addIgnoreList: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async removeIgnoreList(_address) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.removeIgnoreTaxList(_address).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ removeIgnoreList: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async setPairForPrice(_address, _isToken0) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.setPairForPrice(_address, _isToken0 === 'true' ? true : false).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ setPairForPrice: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async setUseFeedPrice(_useFeedPrice) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.setUseFeedPrice(_useFeedPrice === 'true' ? true : false).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ setUseFeedPrice: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async changeInitialPeggedPrice(_initialPrice) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.changeInitialPeggedPrice(_initialPrice).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ changeInitialPeggedPrice: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async transfer(_recipient, _amount) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.transfer(_recipient, _amount).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ transfer: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async transferFrom(_sender, _recipient, _amount) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.transferFrom(_sender, _recipient, _amount).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ transferFrom: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async changeInitialTimestamp(_initialTimestamp) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.changeInitialTimestamp(_initialTimestamp).send({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ changeInitialTimestamp: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }




  //read
  async queryTaxList(_address) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.isApplyTaxList(_address).call({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ queryTaxList: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async queryIgnoreList(_address) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.isIgnoreTaxList(_address).call({ from: this.state.account });
        console.log('result:' + result);
        this.setState({ queryIgnoreList: result + "" });
      } catch (e) {
        alert(e);
      }
    }
  }

  async queryBalance() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.balanceOf(this.state.account).call({ from: this.state.account });
        this.setState({ balance: result })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getTokenPrice(_pairAddress, _isToken0, _amount) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getTokenPrice(_pairAddress, _isToken0 === 'true' ? true : false, _amount).call({ from: this.state.account });
        this.setState({ getTokenPrice: result })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getTokenPrice_() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getTokenPrice().call({ from: this.state.account });
        this.setState({ getTokenPrice_: result })
      } catch (e) {
        alert(e)
      }
    }
  }

  async getDeviant() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getDeviant().call({ from: this.state.account });
        this.setState({ getDeviant: result })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getPeggedPrice() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getPeggedPrice().call({ from: this.state.account });
        this.setState({ getPeggedPrice: result })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getTaxPercent_() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getTaxPercent().call({ from: this.state.account });
        this.setState({ getTaxPercent_: (result[0] / result[1]) + "%" })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getRewardPercent_() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getRewardPercent().call({ from: this.state.account });
        this.setState({ getRewardPercent_: (result[0] / result[1]) + "%" })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getBuyerRewardPercent_() {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getBuyerRewardPercent().call({ from: this.state.account });
        this.setState({ getBuyerRewardPercent_: (result[0] / result[1]) + "%" })
      } catch (e) {
        alert(e);
      }
    }
  }

  async transferOwnership(_newOwner) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.transferOwnership(_newOwner).send({ from: this.state.account });
        this.setState({ transferOwnership: result })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getTaxPercent(_deviant) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getTaxPercent(_deviant).call({ from: this.state.account });
        this.setState({ getTaxPercent: (result[0] / result[1]) + "%" })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getRewardPercent(_deviant) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getRewardPercent(_deviant).call({ from: this.state.account });
        this.setState({ getRewardPercent: (result[0] / result[1]) + "%" })
      } catch (e) {
        alert(e);
      }
    }
  }

  async getBuyerRewardPercent(_deviant) {
    if (this.state.token !== 'undefined') {
      try {
        let result = await this.state.token.methods.getBuyerRewardPercent(_deviant).call({ from: this.state.account });
        this.setState({ getBuyerRewardPercent: (result[0] / result[1]) + "%" })
      } catch (e) {
        alert(e);
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      balance: 0,
      result: "result",
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <div className="container-fluid mt-5 ">
          <br></br>
          <h1>Welcome to Fleep Contract</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <main role="main">
            <div>
              <h2>Token name {this.state.tokenName}</h2>
              <h2>Token address {this.state.tokenAddress}</h2>
              <button onClick={() => {
                this.queryBalance();
              }} className='btn btn-primary'>Query Balance</button>
              <h2>Balance {this.state.balance}</h2>
              <Tabs defaultActiveKey="ReadContract" id="uncontrolled-tab-example">
                <Tab eventKey="ReadContract" title="Read contract">
                  <br />
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    this.queryTaxList(this.queryTaxListInput.value)
                  }}>
                    <div className='form-group mr-sm-2'>
                      <label>Query applyTaxList</label>
                      <input
                        id='queryTaxList'
                        type='string'
                        ref={(input) => { this.queryTaxListInput = input }}
                        className="form-control form-control-md"
                        placeholder='_addressInput...'
                        required />
                    </div>
                    <div>
                      <button type='submit' className='btn btn-primary'>Query</button>
                      {this.state.queryTaxList}
                    </div>
                  </form>

                  <div>
                    <br />
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      try {
                        this.queryIgnoreList(this._inputqueryIgnoreList.value)
                      } catch (e) {
                        alert(e);
                      }
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>
                          QueryIgnoreList
                        </label>
                        <input
                          id='_inputqueryIgnoreList'
                          type='string'
                          ref={(input) => { this._inputqueryIgnoreList = input }}
                          className="form-control form-control-md"
                          placeholder='_addressInput...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.queryIgnoreList}
                      </div>
                    </form>
                  </div>
                  <br />
                  <br />
                  <div>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      try {
                        this.getTokenPrice(this._pairFeedPrice.value
                          , this._isToken0.value, this._amount.value);
                      } catch (e) {
                        alert(e);
                      }
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>getTokenPrice</label>
                        <input
                          id='_pairFeedPrice'
                          type='string'
                          ref={(input) => { this._pairFeedPrice = input }}
                          className="form-control form-control-md"
                          placeholder='_pairFeedPrice...'
                          required />
                        <input
                          id='_isToken0'
                          type='string'
                          ref={(input) => { this._isToken0 = input }}
                          className="form-control form-control-md"
                          placeholder='_isToken0...'
                          required />
                        <input
                          id='_amount'
                          type='string'
                          ref={(input) => { this._amount = input }}
                          className="form-control form-control-md"
                          placeholder='_amount...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getTokenPrice}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <br />

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      try {
                        this.getTokenPrice_();
                      } catch (e) {
                        alert(e);
                      }
                    }}>
                      <div>
                        <label>getTokenPrice</label>
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getTokenPrice_}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getTaxPercent(this._taxDeviant.value);
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>getTaxPercent</label>
                        <input
                          id='_taxDeviant'
                          type='string'
                          ref={(input) => { this._taxDeviant = input }}
                          className="form-control form-control-md"
                          placeholder='_taxDeviant...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getTaxPercent}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getTaxPercent_();
                    }}>
                      <div><label>getTaxPercent</label></div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getTaxPercent_}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getRewardPercent(this._rewardDeviant.value);
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>getRewardPercent</label>
                        <input
                          id='_rewardDeviant'
                          type='string'
                          ref={(input) => { this._rewardDeviant = input }}
                          className="form-control form-control-md"
                          placeholder='_rewardDeviant...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getRewardPercent}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getRewardPercent_();
                    }}>
                      <div>
                        <label>getRewardPercent</label>
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getRewardPercent_}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getPeggedPrice();
                    }}>
                      <div>
                        <label>getPeggedPrice</label>
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getPeggedPrice}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getDeviant();
                    }}>
                      <div>
                        <label>getDeviant</label>
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getDeviant}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getBuyerRewardPercent(this._rewardBuyerDeviant.value);
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>getBuyerRewardPercent</label>
                        <input
                          id='_rewardBuyerDeviant'
                          type='string'
                          ref={(input) => { this._rewardBuyerDeviant = input }}
                          className="form-control form-control-md"
                          placeholder='_rewardBuyerDeviant...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getBuyerRewardPercent}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.getBuyerRewardPercent_();
                    }}>
                      <div>
                        <label>getBuyerRewardPercent</label>
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.getBuyerRewardPercent_}
                      </div>
                    </form>
                  </div>
                </Tab>
                <Tab eventKey="WriteContract" title="Write Contract">
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.transferOwnership(this._inputtransferOwnership.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>transferOwnership</label>
                        <input
                          id='_inputtransferOwnership'
                          type='string'
                          ref={(input) => { this._inputtransferOwnership = input }}
                          className="form-control form-control-md"
                          placeholder='_newOwnerShip (carefully - not change owner to contract address)...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.transferOwnership}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br></br>

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.addIgnoreList(this._inputaddIgnoreList.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>AddIgnoreList</label>
                        <input
                          id='_inputaddIgnoreList'
                          type='string'
                          ref={(input) => { this._inputaddIgnoreList = input }}
                          className="form-control form-control-md"
                          placeholder='_addressInput...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>Execute</button>
                        {this.state.addIgnoreList}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />

                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.addTaxList(this.addTaxListInut.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>addToApplyTaxList</label>
                        <input
                          id='addTaxList'
                          type='string'
                          ref={(input) => { this.addTaxListInut = input }}
                          className="form-control form-control-md"
                          placeholder='_addressInput...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.addTaxList}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.changeInitialPeggedPrice(this._inputchangeInitialPeggedPrice.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>changeInitialPeggedPrice</label>
                        <input
                          id='_inputchangeInitialPeggedPrice'
                          type='string'
                          ref={(input) => { this._inputchangeInitialPeggedPrice = input }}
                          className="form-control form-control-md"
                          placeholder='_inputchangeInitialPeggedPrice...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.changeInitialPeggedPrice}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.changeInitialTimestamp(this._inputchangeInitialTimestamp.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>changeInitialTimestamp</label>
                        <input
                          id='_inputchangeInitialTimestamp'
                          type='string'
                          ref={(input) => { this._inputchangeInitialTimestamp = input }}
                          className="form-control form-control-md"
                          placeholder='_inputchangeInitialTimestamp...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.changeInitialTimestamp}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.removeIgnoreList(this._inputremoveIgnoreList.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>removeIgnoreList</label>
                        <input
                          id='_inputremoveIgnoreList'
                          type='string'
                          ref={(input) => { this._inputremoveIgnoreList = input }}
                          className="form-control form-control-md"
                          placeholder='_inputremoveIgnoreList...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.removeIgnoreList}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.removeTaxList(this._inputremoveTaxList.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>removeTaxList</label>
                        <input
                          id='_inputremoveTaxList'
                          type='string'
                          ref={(input) => { this._inputremoveTaxList = input }}
                          className="form-control form-control-md"
                          placeholder='_inputremoveTaxList...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.removeTaxList}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.setPairForPrice(this._inputsetPairForPrice.value
                        , this._inputsetPairForPriceIsToken0.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>setPairForPrice</label>
                        <input
                          id='_inputsetPairForPrice'
                          type='string'
                          ref={(input) => { this._inputsetPairForPrice = input }}
                          className="form-control form-control-md"
                          placeholder='_inputsetPairForPrice...'
                          required />
                        <input
                          id='_inputsetPairForPriceIsToken0'
                          type='string'
                          ref={(input) => { this._inputsetPairForPriceIsToken0 = input }}
                          className="form-control form-control-md"
                          placeholder='_inputsetPairForPriceIsToken0...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.setPairForPrice}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.setUseFeedPrice(this._inputsetUseFeedPrice.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>setUseFeedPrice</label>
                        <input
                          id='_inputsetUseFeedPrice'
                          type='string'
                          ref={(input) => { this._inputsetUseFeedPrice = input }}
                          className="form-control form-control-md"
                          placeholder='_inputsetUseFeedPrice...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.setUseFeedPrice}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.transfer(this._inputtransferRecipient.value,
                        this._inputtransferAmount.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>transfer</label>
                        <input
                          id='_inputtransferRecipient'
                          type='string'
                          ref={(input) => { this._inputtransferRecipient = input }}
                          className="form-control form-control-md"
                          placeholder='_inputtransferRecipient...'
                          required />
                        <input
                          id='_inputtransferAmount'
                          type='string'
                          ref={(input) => { this._inputtransferAmount = input }}
                          className="form-control form-control-md"
                          placeholder='_inputtransferAmount...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.transfer}
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      this.transferFrom(this._inputtransferFromSender.value,
                        this._inputtransferFromRecipient.value,
                        this._inputtransferFromAmount.value)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <label>transferFrom</label>
                        <input
                          id='_inputtransferFromSender'
                          type='string'
                          ref={(input) => { this._inputtransferFromSender = input }}
                          className="form-control form-control-md"
                          placeholder='_inputtransferFromSender...'
                          required />
                        <input
                          id='_inputtransferFromRecipient'
                          type='string'
                          ref={(input) => { this._inputtransferFromRecipient = input }}
                          className="form-control form-control-md"
                          placeholder='_inputtransferFromRecipient...'
                          required />
                        <input
                          id='_inputtransferFromAmount'
                          type='string'
                          ref={(input) => { this._inputtransferFromAmount = input }}
                          className="form-control form-control-md"
                          placeholder='_inputtransferFromAmount...'
                          required />
                      </div>
                      <div>
                        <button type='submit' className='btn btn-primary'>ADD</button>
                        {this.state.transferFrom}
                      </div>
                    </form>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      // </div>
    );
  }
}

export default App;
