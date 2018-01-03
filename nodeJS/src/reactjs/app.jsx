import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import AppRouter from './AppRouter.jsx';
import history from '../js/history';
import style from '../scss/style.scss';


class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <AppRouter />
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
