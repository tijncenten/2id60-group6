import React from 'react';
import PropTypes from 'prop-types';
import FeedComponent from './FeedComponent.jsx';

class FeedComponentAlbum extends FeedComponent {
  constructor(props) {
    super(props);


  }

  render() {
    return (
      <FeedComponent {...this.props}>
        <h1>Album</h1>
      </FeedComponent>
    );
  }
}


export default FeedComponentAlbum;
