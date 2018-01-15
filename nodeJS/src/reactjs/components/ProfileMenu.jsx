import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, AccessibleFakeButton, IconSeparator, FontIcon, DropdownMenu } from 'react-md';
import history from '../../js/history';
import profilePictureParser from '../../js/utils/profilePictureParser';



class ProfileMenu extends React.Component {
  render(){
    const { simplifiedMenu } = this.props;

    let avatar;
    if(activeUser.profilePicture === null){
      avatar = (
        <Avatar suffix={activeUser.avatarColor}>{activeUser.firstName[0] + activeUser.lastName[0]}</Avatar>
      );
    } else {
      avatar = (
        <Avatar src={profilePictureParser.parseThumb(activeUser.profilePicture)}/>
      );
    }
    
    return(
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
        position={DropdownMenu.Positions.BELOW}
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
          {avatar}
        </AccessibleFakeButton>
      </DropdownMenu>
    );
  }
}

ProfileMenu.propTypes = {
  simplifiedMenu: PropTypes.bool,
};

export default ProfileMenu;
