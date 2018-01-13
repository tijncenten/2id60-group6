import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import style from '../scss/style.scss';


class Registration extends React.Component {
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.children }} />
    );
  }
}

ReactDOM.render(
  <Registration>
    {document.getElementById('app').innerHTML}
  </Registration>,
  document.getElementById('app')
);
