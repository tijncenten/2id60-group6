import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import style from '../scss/style.scss';
import { Button, Toolbar, Paper, Card, TextField, CardTitle, CardText, CardActions } from 'react-md';


class Registration extends React.Component {
  render() {
    const title = (registrationType === "login") ? "Login" : "Sign up";
    const other = (registrationType === "login") ? "Sign up" : "Login";
    const link = (registrationType === "login") ? "signup" : "login";
    let content;

    if(registrationType === "login"){
      content = (
        <span>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token}/>
          <TextField
            id="id_username"
            label="Username"
            placeholder="Username"
            className="md-cell md-cell--bottom input-field"
            maxLength={150}
            required={true}
            name="username"
          />
          <TextField
            id="id_password"
            label="Password"
            placeholder="Password"
            className="md-cell md-cell--bottom input-field"
            required={true}
            type="password"
            name="password"
          />
        </span>
      );
    } else {
      content = (
        <span>
          <input type="hidden" name="csrfmiddlewaretoken" value={csrf_token}/>
          <TextField
            id="id_username"
            label="Username"
            placeholder="Username"
            className="md-cell md-cell--bottom input-field"
            maxLength={150}
            required={true}
            name="username"
          />
          <TextField
            id="id_first_name"
            label="Firstname"
            placeholder="Firstname"
            className="md-cell md-cell--bottom input-field"
            required={true}
            maxLength={30}
            name="first_name"
          />
          <TextField
            id="id_last_name"
            label="Lastname"
            placeholder="Lastname"
            className="md-cell md-cell--bottom input-field"
            required={true}
            maxLength={30}
            name="last_name"
          />
          <TextField
            id="id_email"
            label="Email"
            placeholder="Email"
            className="md-cell md-cell--bottom input-field"
            required={true}
            name="email"
          />
          <TextField
            id="id_password1"
            label="Password"
            placeholder="Password"
            className="md-cell md-cell--bottom input-field"
            required={true}
            type="password"
            name="password1"
          />
          <ul className="password-list">
            <li>Your password can't be too similar to your other personal information.</li>
            <li>Your password must contain at least 8 characters.</li>
            <li>Your password can't be a commonly used password.</li>
            <li>Your password can't be entirely numeric.</li>
          </ul>
          <h4>Confirm password.</h4>
          <TextField
            id="id_password2"
            label="Password"
            placeholder="Password"
            className="md-cell md-cell--bottom input-field"
            required={true}
            type="password"
            name="password2"
          />
          
        </span>
      );
    }

    return (
      <div>
        <Toolbar
          colored
          title={title}
          className="md-paper md-paper--2"
        />
        <Card className="md-block-centered registration-card">
          <CardTitle title={title} className="card-title"/>
          <form className="registration-form" method="post">
            {/* <div className="input-div" dangerouslySetInnerHTML={{ __html: this.props.children }} /> */}
            <CardText>
            {content}
            </CardText>
            <CardActions>
              <Button raised primary className="submit-button" type="submit">{title}</Button>
              <a href={"/" + link}>
                <Button flat primary>{other}</Button>
              </a>
            </CardActions>
          </form>
        </Card>
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
