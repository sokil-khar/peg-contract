import detectEthereumProvider from '@metamask/detect-provider';
import React, {Component} from 'react';
import {Button, Row} from 'react-bootstrap';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Web3 from 'web3';
import Token from '../../abis/FleepToken.json';
import './Dashboard.css';
import './RewardOnBuys.css';
import './TaxOnSell.css';
import './MaxSell.css';
import './BuyFleep.css';
import {account} from '../../redux/accountReducer'
import song from '../../resources/audio/background.wav';
import cloud from '../../resources/img/cloudborder.png'

window.web3 = {};
const pairAddress = '0x3cCa3712f67cE186c0575f703abd80DF7AC88029';
const swapEvent = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822';

const {innerWidth: width, innerHeight: height} = window;

const initialState = {
    currentBlock: {},
    tokenAddress: '',
    tokenName: Token.contractName,
    balance: 0,
    account: null,
    tokenPrice: 0,
    peggedPrice: 0,
    tax: 0,
    rewardOnBuy: 0,
    maxSellable: 0,
    showtaxs: false,
    showGrass: false
}

class Dashboard extends Component {


    componentDidMount() {
        console.log('width:' + width);
        this.loadWeb3();
        // this.loadWeb3Accounts();
        this.interval = setInterval(() => this.loadStaticData(), 30000);
        //play audio
        this.audio = new Audio(song);
        this.audio.load();
        this.playAudio()
    }

    keepPlay(){
        const audioPromise = this.audio.play()
        if (audioPromise !== undefined) {
            audioPromise
                .then(_ => {
                    // autoplay started
                })
                .catch(err => {
                    // catch dom exception
                    console.info(err)
                })
        }
    }

    playAudio() {
        if (!this.state.playing) {
            this.keepPlay = this.keepPlay.bind(this);
            this.audio.addEventListener('ended', this.keepPlay, false);
            const audioPromise = this.audio.play()
            if (audioPromise !== undefined) {
                audioPromise
                    .then(_ => {
                        this.setState({playing: !this.state.playing});
                    })
                    .catch(err => {
                        // catch dom exception
                        console.info(err)
                    })
            }
        } else {
            this.audio.removeEventListener('ended', this.keepPlay, false);
            this.audio.pause()
            this.setState({playing: !this.state.playing});
        }


    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    constructor(props) {
        super(props)
        // console.log('init again');
        this.state = this.props.account ? this.props.account.info ? this.props.account.info : initialState : initialState;
        // console.log('this.state:'+JSON.stringify(this.state));

    }

    async loadWeb3() {
        const provider = await detectEthereumProvider()
        if (provider) {
            console.log('Ethereum successfully detected!')
            const chainId = await provider.request({
                method: 'eth_chainId'
            })
            window.web3 = new Web3(provider);
            const web3 = new Web3(provider);
            const tokenAddress = Token.networks[Number(chainId)].address;
            const token = new web3.eth.Contract(Token.abi, tokenAddress)
            this.setState({
                web3: web3,
                netId: Number(chainId),
                token: token,
                tokenAddress: tokenAddress
            }, () => {
                this.saveState();
                this.loadWeb3Accounts();
            });

        } else {
            // if the provider is not detected, detectEthereumProvider resolves to null
            console.error('Please install MetaMask!')
        }
    }

    async loadWeb3Accounts() {
        try {
            console.log('web3:' + (!this.state.web3));
            if (!this.state.netId) {
                await this.loadWeb3();
            }
            console.log('netId:' + JSON.stringify(this.state.netId));
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            if (!window.web3) {
                window.alert('Please login with MetaMask');
                return;
            }
            if (typeof accounts[0] !== 'undefined') {
                this.setState(
                    {
                        accounts: accounts,
                        account: accounts[0],
                    }, () => {
                        this.saveState();
                        this.loadStaticData();
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
        console.log('refresh data');
        //TODO load transaction data
        fetch('https://api-kovan.etherscan.io/api\n' +
            '   ?module=logs&action=getLogs&address=' + this.state.tokenAddress + '&apikey=AIBAW9EIPB9J9IRJST1MDB4KKVST8N4ZSS&fromBlock=0 &toBlock=99999999999&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
            .then(response => response.json())
            .then(data => this.setState({txns: data.result}));
        fetch('https://api-kovan.etherscan.io/api\n' +
            '   ?module=logs&action=getLogs&address=' + pairAddress + '&apikey=AIBAW9EIPB9J9IRJST1MDB4KKVST8N4ZSS&fromBlock=0 &toBlock=99999999999&topic0=' + swapEvent)
            .then(response => response.json())
            .then(data => this.setState({swaptnxs: data.result}));
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
            }, () => {
                this.saveState();
            })

        }
    }

    saveState() {
        this.props.saveAccount({...this.state, web3: undefined, token: undefined});
    }

    async getPeggedPrice() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.getPeggedPrice().call({from: this.state.account});
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
                let result = await this.state.token.methods.getTokenPrice().call({from: this.state.account});
                return Web3.utils.fromWei(result);
            } catch (e) {
                console.log(e);
            }
        }
    }

    async getBalanceOf() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.balanceOf(this.state.account).call({from: this.state.account});
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
                let tax = await this.state.token.methods.getTaxPercent().call({from: this.state.account});
                let reward = await this.state.token.methods.getRewardPercent().call({from: this.state.account});
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
                let result = await this.state.token.methods.getBuyerRewardPercent().call({from: this.state.account});
                return (result[0] / result[1] + "%");
            } catch (e) {
                alert(e);
            }
        }
    }

    async getMaxSellable() {
        if (this.state.token !== 'undefined') {
            try {
                let result = await this.state.token.methods.getMaxSellable().call({from: this.state.account});
                return Web3.utils.fromWei(result);
            } catch (e) {
                alert(e);
            }
        }
    }

    showEatGrass() {
        this.setState({showGrass: !this.state.showGrass})
    }

    showNumber(number) {
        return Number(number).toFixed(3)
    }

    render() {
        return (
            <div className='background' onClick={() => {
                if (this.state.showGrass) {
                    this.showEatGrass();
                }
            }}>
                <div className='myContainer' style={{zIndex: -2, borderImage: `url("${cloud}") 70 65 repeat`
                }}>
                    <Row className="justify-content-between" >
                        <div style={{flex: 1}}>
                        </div>

                        {
                            // !this.state.account
                            // &&
                            <div style={{width: 300}
                            }>
                                <Button
                                    onClick={() => this.loadWeb3Accounts()}
                                    // borderColor: 'transparent', backgroundColor: 'transparent',
                                    style={{
                                        boxShadow: 'none',
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent',
                                    }}>
                                    <img alt={''} style={{height: '50px', width: '250px', top: '1vh', right: '2vw', opacity: this.state.account ? '30%': '100%'}}
                                         src={this.state.account ? require('../../resources/img/afterConnectWallet.png'): require('../../resources/img/ConnectWallet.png')}/>
                                </Button>
                            </div>
                        }
                    </Row>
                    <Row className="justify-content-between">
                        <div className="balance-btn">
                            <p>{this.state.balance}</p>
                        </div>
                        <div className="price-btn">
                            <p>{this.showNumber(this.state.tokenPrice)} DAI </p>
                        </div>
                    </Row>
                    <br/>
                    <Row className="bodyCenter">
                        <div className='col-lg-2 col-sm-12'>
                            <div>
                                <Button className="pasture-btn"
                                        onClick={() => this.showEatGrass()}
                                        style={{
                                            boxShadow: 'none',
                                            borderColor: 'transparent',
                                            backgroundColor: 'transparent',
                                        }}>
                                </Button>
                            </div>
                        </div>
                        <div className='col-lg-8 col-sm-12'>

                        </div>
                        <div className='col-lg-2 col-sm-12'>
                            <Row>
                                <div className="d-flex flex-row-reverse">
                                    <Button className="book-btn"
                                        // onClick={() => this.showEatGrass()}
                                            style={{
                                                boxShadow: 'none',
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}>
                                    </Button>
                                </div>
                                <div className="d-flex flex-row-reverse">
                                    <Button className="uniswap-btn"
                                        // onClick={() => this.showEatGrass()}
                                            style={{
                                                boxShadow: 'none',
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}>
                                    </Button>
                                </div>
                                <div className="d-flex flex-row-reverse">
                                    <Button className={this.state.playing ? "audio-btn": "mute-btn"}
                                            onClick={() => this.playAudio()}
                                            style={{
                                                boxShadow: 'none',
                                                borderColor: 'transparent',
                                                backgroundColor: 'transparent',
                                            }}>
                                    </Button>
                                </div>
                            </Row>
                        </div>

                        {this.state.showGrass && (
                            <div
                                onClick={() => this.showEatGrass()}
                                style={{
                                    top: '10vh', left: '10vw',
                                    width: '80vw', height: '80vh', position: 'absolute', display: 'flex'
                                }} className="glass justify-content-center">
                                <img alt={''}
                                     src={require('../../resources/img/ramEat.gif')}/>
                            </div>
                        )}


                    </Row>
                    <Row className="justify-content-between">
                        <div className="block-text h5 text-danger">Current
                            block {this.state.currentBlock ? this.state.currentBlock.number : ''}
                        </div>

                        <div style={{width: '910px'}}>
                            <Row>
                                <div className="peg-btn">
                                    <p> {this.state.peggedPrice}</p>
                                </div>
                                <div className="taxOnSells">
                                    <p>{this.state.tax}</p>
                                </div>
                                <div className="maxSell">
                                    <p>{this.state.maxSellable}</p>
                                </div>
                                <div className="buyReward">
                                    <p>{this.state.rewardOnBuy}</p>
                                </div>
                            </Row>
                        </div>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => ({
    saveAccount: (payload) => dispatch(account(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
