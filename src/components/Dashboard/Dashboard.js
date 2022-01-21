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




class Dashboard extends Component {

    async componentWillMount() {
        this.loadWeb3();
    }

    componentDidMount() {
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
            tokenName: Token.contractName,
            balance: 0,
            tokenPrice: 0,
            peggedPrice: 0,
            tax: 0,
            rewardOnBuy: 0,
            maxSellable: 0
        }
    }

    async loadWeb3() {
        const provider = await detectEthereumProvider()
        if (provider) {
            console.log('Ethereum successfully detected!')
            const chainId = await provider.request({
                method: 'eth_chainId'
            })
            this.setState({ web3: new Web3(provider), netId: Number(chainId) });
        } else {
            // if the provider is not detected, detectEthereumProvider resolves to null
            console.error('Please install MetaMask!')
        }
    }

    async loadWeb3Accounts() {
        try {
            console.log('web3:' + (!this.state.web3));
            if (!this.state.netId || this.state.netId === undefined) {
                this.loadWeb3();
            }
            console.log('netId:' + JSON.stringify(this.state.netId));
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!this.state.web3) {
                window.alert('Please login with MetaMask');
                return;
            }
            if (typeof accounts[0] !== 'undefined') {
                // const balance = await this.state.web3.eth.getBalance(accounts[0]);
                // console.log("balance:" + JSON.stringify(balance));
                const token = new this.state.web3.eth.Contract(Token.abi, Token.networks[this.state.netId].address)
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

    render() {
        return (
            <div className='background'>
                <h5>Welcome to  <Link to="/contract"> {this.state.tokenName} - {this.state.tokenAddress}</Link></h5>
                <Row>
                    <Col />
                    <Col />
                    <Col>
                        <Button
                            onClick={() => this.loadWeb3Accounts()}
                            // borderColor: 'transparent', backgroundColor: 'transparent',
                            style={{  boxShadow: 'none',borderColor: 'transparent', backgroundColor: 'transparent', }}>
                            <img style={{ height: '50px', width: '250px', position: 'absolute', top: '1vh', right: '2vw' }} src={require('../../resources/img/ConnectWallet.png')}></img>
                        </Button>
                    </Col>
                </Row>
                <Row className="headingRow">
                    <Col xs={6} className="balance-btn">
                    </Col>
                    <Col className='balance-text text-primary'>
                        {this.state.balance}
                    </Col>
                    <Col className="price-btn">
                    </Col>
                    <Col className='price-text text-primary'>{this.state.tokenPrice} DAI</Col>
                    <Col>
                    </Col>
                </Row>

                <div className='bodyContainer'>
                    <Col>
                        <Row className="h5 text-primary">
                            <Row className="h4 text-primary">Buy Fleep</Row>
                            <div style={{ width: "100px", height: "50px" }}>
                                <Link
                                    to="/buyFleep"
                                    style={{ boxShadow: 'none',borderColor: 'transparent', backgroundColor: 'transparent', }}>
                                    {/* <div className="buyFleepBtn" /> */}
                                    <img className="buyFleepBtn" src={require('../../resources/img/BuyFleep.png')} />
                                </Link>
                            </div>
                        </Row>
                    </Col>
                    <Col>
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
                    </Col>

                </div>
                <Row className="footerRow">

                    <Col className="block-text h5 text-danger">Current block {this.state.currentBlock.number}</Col>
                    <Col xs={6}></Col>
                    <Col>
                        <Row>
                            <Col className="peg-btn"></Col>
                            <Row className="peg-text text-primary"> {this.state.peggedPrice} DAI</Row>
                            <Row className="dev-text text-primary"> DEV{this.state.dev}</Row>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default Dashboard;