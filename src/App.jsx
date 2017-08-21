import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import store from './store/store';
import About from './components/About';
import Landing from './components/Landing';

const App = () =>
  <Provider store={store}>
    <div>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/about" component={About} />
      </Switch>
    </div>
  </Provider>;

export default App;
