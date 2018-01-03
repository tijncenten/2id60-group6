import React from 'react';
import View from './View.jsx';
import Feed from '../components/feed/Feed.jsx';

export default class MainView extends View {
  constructor(props) {
    super(props);
    this.title = "Main";
  }


  render() {
    return (
      <div>
        <Feed />
      </div>
    );
  }
}
