import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import style from '../scss/style.scss';
import { Button, Toolbar} from 'react-md';


class Registration extends React.Component {
  render() {
    return (
      <div>
        <Toolbar
          colored
          title="Login"
        />
        <form method="post">
          <div dangerouslySetInnerHTML={{ __html: this.props.children }} />

          <Button flat primary type="submit">login</Button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(
  <Registration>
    {document.getElementById('app').innerHTML}
  </Registration>,
  document.getElementById('app')
);
