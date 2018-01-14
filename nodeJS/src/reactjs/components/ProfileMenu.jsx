import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, AccessibleFakeButton, IconSeparator, FontIcon, DropdownMenu } from 'react-md';
import { NavLink, Route } from 'react-router-dom';

const ProfileMenu = ({ simplifiedMenu }) => (
  <Route render={({ history}) => (
    <DropdownMenu
      id={`${!simplifiedMenu ? 'smart-' : ''}avatar-dropdown-menu`}
      menuItems={[
        { primaryText: 'Profile', onClick: () => {
          history.push('/profile/' + activeUser.username);
        }},
        { divider: true },
        { primaryText: 'Log out', onClick: () => {
          window.location.href = '/logout';
        }}]}
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
        <Avatar suffix={activeUser.avatarColor}>{activeUser.firstName[0] + activeUser.lastName[0]}</Avatar>
      </AccessibleFakeButton>
    </DropdownMenu>
  )} />
);

ProfileMenu.propTypes = {
  simplifiedMenu: PropTypes.bool,
};

export default ProfileMenu;
