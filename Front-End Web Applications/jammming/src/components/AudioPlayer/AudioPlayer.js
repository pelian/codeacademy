import React from 'react';

class AudioPlayer extends React.Component {
  render() {
    return <audio className='AudioPlayer' src={this.props.src}></audio>;
  }
}

export default AudioPlayer;