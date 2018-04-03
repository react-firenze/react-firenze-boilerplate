import React from 'react';
import { renderRoutes } from 'react-router-config';
import { array, shape } from 'prop-types';

const App = ({ route }) => (
  <div>
    <p>App</p>
    <div>{renderRoutes(route.routes)}</div>
  </div>
);

App.propTypes = {
  route: shape({ routes: array }).isRequired,
};

export default App;
