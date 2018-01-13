import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Toolbar, NavigationDrawer, TextField } from 'react-md';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import MainView from './views/MainView.jsx';
import ProfileView from './views/ProfileView.jsx';
import ChatView from './views/ChatView.jsx';
import NotificationView from './views/NotificationView.jsx';
import SettingsView from './views/SettingsView.jsx';
import NavItemLink from './components/NavItemLink.jsx';
import Aside from './components/Aside.jsx';
import ShareVariantIcon from 'mdi-react/ShareVariantIcon';
import style from '../scss/style.scss';

const TO_PREFIX = '';

const navItems = [{
    label: 'Home',
    to: `${TO_PREFIX}/`,
    exact: true,
    icon: 'home',
    component: MainView
  }, {
    label: 'My profile',
    to: `${TO_PREFIX}/profile/julian`,
    path: `${TO_PREFIX}/profile/:username`,
    exact: false,
    icon: 'person',
    component: ProfileView,
  }, {
    label: 'Chats',
    to: `${TO_PREFIX}/chats`,
    exact: true,
    icon: 'chat',
    component: ChatView,
    badgeContent: 2,
  }, {
    label: 'Notifications',
    to: `${TO_PREFIX}/notifications`,
    exact: true,
    icon: 'notifications',
    component: NotificationView,
    badgeContent: 4,
  }, {
    label: 'Settings',
    to: `${TO_PREFIX}/settings`,
    exact: true,
    icon: 'settings',
    component: SettingsView,
  },
];

class AppRouter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toolbarTitle: "Title"
    };

    this.setCurrentTitle = this.setCurrentTitle.bind(this);
  }

  setCurrentTitle(title) {
    this.setState({ toolbarTitle: title });
  }

  render() {
    const { toolbarTitle } = this.state;
    const { location } = this.props;
    return (
      <NavigationDrawer
        drawerTitle="Menu"
        toolbarTitle={toolbarTitle}
        toolbarActions={<TextField placeholder="search" id="testing"/>}
        navItems={navItems.map(props => <NavItemLink {...props} key={props.to} />)}>
        <Switch key={location.pathname}>
          {navItems.map(navItem => (
            <Route path={navItem.path == undefined ? navItem.to : navItem.path} exact={navItem.exact} key={navItem.to} render={props => React.createElement(navItem.component, Object.assign({onSetTitle: this.setCurrentTitle}, ...props)) } />
          ))}
        </Switch>
      </NavigationDrawer>
    );
  }
}

export default withRouter(AppRouter)


// <Route path={navItems[0].to} exact component={MainView} />
// <Route path={navItems[1].to} exact component={MainView} />
// <Route path={navItems[2].to} exact component={MainView} />
