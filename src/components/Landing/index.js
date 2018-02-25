import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import duomo from 'images/santa-maria-del-fiore.svg';
import { setTest } from 'actions/actionCreators';

import Button from '../Button';
import { Title, Text } from './style';

const Landing = ({ actions, test }) => (
  <div>
    <Title>This is the Duomo of Firenze!</Title>
    <img src={duomo} width="100" alt="florence duomo" />
    <Text>This text is styled with glamorous.</Text>
    <Text>{`This boilerplate supports env vars => ${
      process.env.MY_ENV_VAR
    }`}</Text>
    <Text>{test}</Text>
    <Link to="/about">About</Link>
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

const mapStateToProps = state => ({ test: state.test });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setTest }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
