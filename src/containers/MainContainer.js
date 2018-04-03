import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bool, func, shape, string } from 'prop-types';
import { fetchCoinPrice } from 'actions/actionCreators';

class MainContainer extends Component {
  static propTypes = {
    actions: shape({ fetchCoinPrice: func.isRequired }).isRequired,
    coinPrice: string,
    fetchError: string,
    isFetching: bool,
  };

  static defaultProps = {
    coinPrice: '',
    fetchError: '',
    isFetching: false,
  };

  componentDidMount() {
    if (!this.props.coinPrice) {
      this.props.actions.fetchCoinPrice();
    }
  }

  render() {
    const { coinPrice, fetchError, isFetching } = this.props;

    if (isFetching) return <div>Fetching data...</div>;
    if (fetchError) return <div>Something went wrong</div>;
    return <div>Right now the price of LTC is ${coinPrice}</div>;
  }
}

const mapStateToProps = (state) => ({
  coinPrice: state.coinPrice,
  fetchError: state.fetchCoinPriceError,
  isFetching: state.isFetchingCoinPrice,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ fetchCoinPrice }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
