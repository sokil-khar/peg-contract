import detectEthereumProvider from '@metamask/detect-provider';
import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import {
    Link
} from "react-router-dom";
import Web3 from 'web3';
import Token from '../../abis/FleepToken.json';
import './Dashboard.css';
import './RewardOnBuys.css';
import './TaxOnSell.css';
import './MaxSell.css';
import './BuyFleep.css';


window.web3 = {};

class Dashboard extends Component {

    async componentWillMount() {
        // this.loadWeb3();
    }

    componentDidMount() {
        this.loadWeb3();
        this.loadWeb3Accounts();
        this.interval = setInterval(() => this.loadStaticData(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    constructor(props) {
        super(props)
        this.state = {
            web3: undefined,
            currentBlock: {

            },
            tokenAddress: '',
            tokenName: Token.contractName,
            balance: 0,
            tokenPrice: 0,
            peggedPrice: 0,
            tax: 0,
            rewardOnBuy: 0,
            maxSellable: 0,
            showtaxs: false
        }
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider()
        if (provider) {
            console.log('Ethereum successfully detected!')
            const chainId = await provider.request({
                method: 'eth_chainId'
            })
            window.web3 = new Web3(provider);
            this.setState({ web3: new Web3(provider), netId: Number(chainId) });
            console.log(this.state.web3)
        } else {
            // if the provider is not detected, detectEthereumProvider resolves to null
            console.error('Please install MetaMask!')
        }
    }

    async loadWeb3Accounts() {
        try {
            const provider = await detectEthereumProvider()
            if (provider) {
                const chainId = await provider.request({
                    method: 'eth_chainId'
                })
                window.web3 = new Web3(provider);
                this.setState({ web3: new Web3(provider), netId: Number(chainId) });
            } else {
                // if the provider is not detected, detectEthereumProvider resolves to null
                window.alert('Please login with MetaMask');
            }
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!window.web3) {
                window.alert('Please login with MetaMask');
                return;
            }
            if (typeof accounts[0] !== 'undefined') {
                // const balance = await this.state.web3.eth.getBalance(accounts[0]);
                // console.log("balance:" + JSON.stringify(balance));
                const token = new window.web3.eth.Contract(Token.abi, Token.networks[this.state.netId].address)
                this.setState(
                    {
                        token: token,
                        tokenAddress: Token.networks[this.state.netId].address,
                        // balance: balance,
                        accounts: accounts,
                        account: accounts[0],
                    })
            } else {
                window.alert('Please login with MetaMask');
            }
        } catch (e) {
            console.log('Error', e)
            window.alert('Contracts not deployed to the current network')
        }
    }

    async loadStaticData() {
        // get price of token
        // get pegged price
        if (this.state.account) {
            let peggedPrice = await this.getPeggedPrice();
            let tokenPrice = await this.getTokenPrice();
            let currentBlock = await this.getBlockchainBlock();
            let balance = await this.getBalanceOf();
            let taxAndReward = await this.getTaxAndReward();
            // let reward = await this.getReward();
            let buyerReward = await this.getBuyerReward();
            let maxSellable = await this.getMaxSellable();
            this.setState({
                peggedPrice: peggedPrice,
                tokenPrice: tokenPrice,
                currentBlock: currentBlock,
                balance: balance,
                tax: taxAndReward.tax,
                dev: taxAndReward.dev,
                rewardOnBuy: buyerReward,
                maxSellable: maxSellable
            })
        }
    }

    async getPeggedPrice() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.getPeggedPrice().call({ from: this.state.account });
                return Web3.utils.fromWei(result);
            } catch (e) {
                // alert(e);
                console.log(e);
            }
        }
    }

    async getTokenPrice() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.getTokenPrice().call({ from: this.state.account });
                return Web3.utils.fromWei(result);
            } catch (e) {
                console.log(e);
            }
        }
    }

    async getBalanceOf() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.balanceOf(this.state.account).call({ from: this.state.account });
                return Web3.utils.fromWei(result);
            } catch (e) {
                // alert(e);
                console.log(e);
            }
        }
    }

    async getBlockchainBlock() {
        if (this.state.web3 !== 'undefined') {
            try {
                return await this.state.web3.eth.getBlock("latest");
            } catch (e) {
                console.log(e);
            }
        }
    }

    async getTaxAndReward() {
        if (this.state.token !== 'undefined') {
            try {
                let tax = await this.state.token.methods.getTaxPercent().call({ from: this.state.account });
                let reward = await this.state.token.methods.getRewardPercent().call({ from: this.state.account });
                return {
                    tax: ((tax[0] / tax[1]) + "%"),
                    reward: (reward[0] / reward[1] + "%"),
                    dev: ((tax[0] / tax[1] - reward[0] / reward[1]).toFixed(4)) + "%"
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    // async getReward() {
    //     if (this.state.token !== 'undefined') {
    //         try {

    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    // }

    async getBuyerReward() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.getBuyerRewardPercent().call({ from: this.state.account });
                return (result[0] / result[1] + "%");
            } catch (e) {
                alert(e);
            }
        }
    }

    async getMaxSellable() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.getMaxSellable().call({ from: this.state.account });
                return Web3.utils.fromWei(result);
            } catch (e) {
                alert(e);
            }
        }
    }
    showTaxs () {
        this.setState({showtaxs: !this.state.showtaxs})
    }
    showNumber (number) {
        return Number(number).toFixed(3)
    }
    render() {
        return (
            <div className='background'>
                <div className= 'container'>
                <Row className="justify-content-between">
                    <div style={{flex :1}}>
                        <h5 >Welcome to  <Link to="/contract"> {this.state.tokenName} - {this.state.tokenAddress}</Link></h5>
                    </div>
                    {
                        !this.state.account
                         &&
                        <div style={{width: 300}
                        }>
                            <Button
                                onClick={() => this.loadWeb3Accounts()}
                                // borderColor: 'transparent', backgroundColor: 'transparent',
                                style={{  boxShadow: 'none',borderColor: 'transparent', backgroundColor: 'transparent', }}>
                                <img alt={''} style={{ height: '50px', width: '250px',top: '1vh', right: '2vw' }} src={require('../../resources/img/ConnectWallet.png')}/>
                            </Button>
                        </div>
                    }
                </Row>
                    <br></br>
                    <br></br>
                <Row className="justify-content-between">
                    <div className="balance-btn">
                        <p>{this.state.balance}</p>
                    </div>
                    <div className="price-btn">
                        <p>{this.showNumber(this.state.tokenPrice)} DAI </p>
                    </div>
                </Row>
                <br/>
                <br/>
                <Row className="">
                    <div className='col-lg-3 col-sm-12'>
                        <div className="h5 text-primary">
                            <h3 className="h4 text-primary">Buy Fleep</h3>
                            <div style={{ width: "100px", height: "50px" }}>
                                <Button
                                    onClick={() => this.showTaxs()}
                                    style={{ boxShadow: 'none',borderColor: 'transparent', backgroundColor: 'transparent', }}>
                                    {/* <div className="buyFleepBtn" /> */}
                                    <img className="buyFleepBtn" src={require('../../resources/img/BuyFleep.png')} alt={''}/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={(this.state.showtaxs?  'basket '  : 'basket hide ') + 'col-lg-9 col-sm-12'}>
                        <Row className="h5 text-primary">
                            <div>
                                <Col className="taxOnSell" />
                                <div className="textCenter">{this.state.tax}</div>
                            </div>
                        </Row>
                        <Row className="h5 text-primary">
                            <div>
                                <Col className="rewardOnBuys"></Col>
                                <div className="rewardOnBuysText">{this.state.rewardOnBuy}</div>
                            </div>
                        </Row>
                        <Row className="h5 text-primary">
                            <div>
                                <Col className="maxSell" />
                                <div className="maxSellText">{this.state.maxSellable} TOKEN </div>
                            </div>
                        </Row>
                    </div>
                </Row>
                <Row className="justify-content-between">
                    <div style={{width: 400}} className="block-text h5 text-danger">Current block {this.state.currentBlock.number}</div>
                    <div className="peg-btn text-center" >
                        <p className="text-primary" style={{marginTop: 40, marginBottom: 0}}> {this.state.peggedPrice} DAI</p>
                        <p className="text-primary"> DEV{this.state.dev}</p>
                    </div>
                </Row>
                </div>
            </div>
        );
    }
}
export default Dashboard;
