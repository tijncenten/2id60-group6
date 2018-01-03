import React from 'react';
import { Drawer } from 'react-md';

export default class Aside extends React.Component {
  render() {
    return (
      <Drawer
        type={Drawer.DrawerTypes.FLOATING}
        desktopType={Drawer.DrawerTypes.CLIPPED}
        defaultVisible
        onVisibilityChange={(x) => {console.log(x)}}
        position="right">
        <div>
          <p>Het werkt!</p>
        </div>
      </Drawer>
    );
  }
}
