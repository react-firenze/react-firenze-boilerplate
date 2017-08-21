import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: 'This component has its own state.'
    };
  }

  onButtonClick = () => {
    this.setState({ test: 'And it\'s not styled withe styled components' });
  };

  render() {
    return (
      <div>
        <h1>About</h1>
        <p>
          {this.state.test}
        </p>
        <Link to="/">Home</Link>
        <br />
        <br />
        <button onClick={this.onButtonClick}>Change Text</button>
      </div>
    );
  }
}

export default About;
