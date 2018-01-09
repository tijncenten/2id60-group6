import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { FontIcon, ListItem, Badge } from 'react-md';

/**
 * Due to the fact that react-router uses context and most of the components
 * in react-md use PureComponent, the matching won't work as expected since
 * the PureComponent will block the context updates. This is a simple wrapper
 * with Route to make sure that the active state is correctly applied after
 * an item has been clicked.
 */
const NavItemLink = ({ label, to, icon, exact, badgeContent }) => (
  <Route path={to} exact={exact}>
    {({ match }) => {
      let leftIcon;
      if (icon) {
        leftIcon = <FontIcon>{icon}</FontIcon>;
        if (badgeContent) {
          leftIcon = (
            <Badge badgeClassName="icon-badge"
              primary
              invisibleOnZero
              badgeContent={badgeContent}
              badgeId={label}>
              {leftIcon}
            </Badge>
          )
        }
      }

      return (
        <ListItem
          component={Link}
          active={!!match}
          to={to}
          primaryText={label}
          leftIcon={leftIcon}
        />
      );
    }}
  </Route>
);

NavItemLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  exact: PropTypes.bool,
  icon: PropTypes.node,
  badgeContent: PropTypes.number,
};
export default NavItemLink;
