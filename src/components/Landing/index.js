import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import * as AppActions from '../../actionCreators/actionCreators';
import duomo from '../../images/santa-maria-del-fiore.svg';

import Button from '../Button';
import { Title, Text } from './style';

const Landing = ({ actions, test }) =>
  <div>
    <Title>This is the Duomo of Florence!</Title>
    <img src={duomo} width="100" alt="santa marie del fiore" />
    <Text>This text is style with styled components.</Text>
    <Text>{`This boilerplate supports env vars => ${process.env.MY_ENV_VAR}`}</Text>
    <Text>{test}</Text>
    <Link to="/about">About</Link>
    <br />
    <br />
    <Button onClick={() => actions.setTest('State has been updated!')}>Click me</Button>
  </div>;

Landing.propTypes = {
  actions: shape({
    setTest: func.isRequired
  }).isRequired,
  test: string.isRequired
};

const mapStateToProps = state => ({ test: state.test });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(AppActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
