import React from 'react';
import View from './View.jsx';

export default class SettingsView extends View {
  constructor(props) {
    super(props);
    this.title = "Settings";
  }


  render() {
    return (
      <div>
        <h1>Settings</h1>
      </div>
    );
  }
}
