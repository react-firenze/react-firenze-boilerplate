import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import duomo from 'images/santa-maria-del-fiore.svg';
import { setTest } from 'actions/actionCreators';

import Button from '../Button';
import { Text, Title } from './style';

const Landing = ({ actions, test }) => (
  <div>
    <Title>This is the Duomo of Firenze!</Title>
    <img alt="florence duomo" src={duomo} width="100" />
    <Text>This p is styled with glamorous.</Text>
    <Text>{`This boilerplate supports env vars => ${
      process.env.MY_ENV_VAR
    }`}</Text>
    <Text>{test}</Text>
    <Link style={{ marginRight: '10px' }} to="/about">
      About
    </Link>
    <Link to="/coin">Coin</Link>
    <br />
    <br />
    <Button onClick={() => actions.setTest('State has been updated!')}>
      Click me
    </Button>
  </div>
);

Landing.propTypes = {
  actions: shape({
    setTest: func.isRequired,
  }).isRequired,
  test: string.isRequired,
};

const mapStateToProps = (state) => ({ test: state.test });
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ setTest }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
