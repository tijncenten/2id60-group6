import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, AccessibleFakeButton, IconSeparator, FontIcon, DropdownMenu } from 'react-md';
import { NavLink } from 'react-router-dom';

const ProfileMenu = ({ simplifiedMenu }) => (
  <DropdownMenu
    id={`${!simplifiedMenu ? 'smart-' : ''}avatar-dropdown-menu`}
    menuItems={[
      <NavLink to="/profile/julian">
        Profile
      </NavLink>,
      { divider: true },
      <a href="/logout">Log out</a>]}
    anchor={{
      x: DropdownMenu.HorizontalAnchors.INNER_RIGHT,
      y: DropdownMenu.VerticalAnchors.BOTTOM,
    }}
    position={DropdownMenu.Positions.TOP_RIGHT}
    animationPosition="below"
    sameWidth
    simplifiedMenu={simplifiedMenu}
  >
    <AccessibleFakeButton
      component={IconSeparator}
      iconBefore
      label={
        <IconSeparator label={activeUser.firstName}>
          <FontIcon>arrow_drop_down</FontIcon>
        </IconSeparator>
      }
    >
      <Avatar random>{activeUser.firstName.substring(0,1) + activeUser.lastName.substring(0,1)}</Avatar>
    </AccessibleFakeButton>
  </DropdownMenu>
);

ProfileMenu.propTypes = {
  simplifiedMenu: PropTypes.bool,
};

export default ProfileMenu;
