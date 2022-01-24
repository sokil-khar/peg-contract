import React, {Component} from 'react';
import './BuyFleepScreen.css';
import {account} from "../../redux/accountReducer";
import {connect} from "react-redux";
import {Col, Row} from "react-bootstrap";

import '../Dashboard/Dashboard.css';
import '../Dashboard/RewardOnBuys.css';
import '../Dashboard/TaxOnSell.css';
import '../Dashboard/MaxSell.css';
import '../Dashboard/BuyFleep.css';


class BuyFleepScreen extends Component {

    async componentWillMount() {
    }

    constructor(props) {
        super(props);
        this.state = this.props.account ? this.props.account.info ? this.props.account.info : {} : {};
    }


    render() {
        return (
            <div className='buyFleepBackground'>
                <div className='bodyContainer'>
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
export default connect(mapStateToProps, mapDispatchToProps)(BuyFleepScreen);
