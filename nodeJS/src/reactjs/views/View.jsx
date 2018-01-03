import React from 'react';

export default class View extends React.Component {
  constructor(props) {
    if (new.target === View) {
      throw new TypeError("Cannot construct View instances directly. Use components extended from View");
    }
    super(props);
    this.title = "[Title]";
  }

  componentDidMount() {
    this.updateTitle();
  }

  updateTitle(title = null) {
    if(title !== null) {
      this.title = title;
    }
    this.props.onSetTitle(this.title);
  }
}
