import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Toolbar } from 'react-md';
import ShareVariantIcon from 'mdi-react/ShareVariantIcon';
import style from '../scss/style.scss';


class App extends React.Component {
  render() {
    return (
      <div>
        <Toolbar
          colored
          fixed
          nav={<Button icon>menu</Button>}
          title="Toolbar" />
        <div className="md-toolbar-relative">
        <p>Het werkt!</p>
        <Button floating secondary>share</Button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
