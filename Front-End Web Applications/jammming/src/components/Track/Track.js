import React from 'react';
import './Track.css';
class Track extends React.Component {
  constructor(props) {
    super(props);

    this.handlePreviewClick = this.handlePreviewClick.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }   

  renderAction () {
    return this.props.isRemoval ? <a onClick={ this.removeTrack } className='Track__action'>-</a> : <a onClick={ this.addTrack } className='Track__action'>+</a>
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    let track = this.props.info;
    return (
      <div className='Track'>
        <img className='Track__albumCover' src={track.albumImage ? track.albumImage : '../../public/images/genericAlbumCover.jpg'} alt={track.album} />
        {track.preview_url ? <span className='Track__playPreviewOverlay' onClick={this.handlePreviewClick}><i className='fa fa-play-circle'></i></span> : ''}
        <div className='Track__information'>
          <h3 className='Track__title'>{this.props.track.name}</h3>
          <h4 className='Track__artistAlbum'>{track.artist}} | {track.album}</h4>
        </div>
        {this.renderAction()}
      </div>
    )
  }
}

export default Track;