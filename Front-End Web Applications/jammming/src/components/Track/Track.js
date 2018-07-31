import React from 'react';
import { Base } from '../Base/Base';
import AudioPlayer from 'react-modular-audio-player';
import { Image, Item, Icon } from 'semantic-ui-react'
import './Track.css';
export class Track extends Base {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: ''
    }
    this._bind('renderAction', 'addTrack', 'removeTrack', 'renderTrack');
  }

  renderAction() {
    if (this.props.isRemovable) {
      return <Icon link name='minus circle' size='big' color='pink' className='track-action' onClick={this.removeTrack} />;
    } else {
      return <Icon link name='plus circle' size='big' color='pink' className='track-action' onClick={this.addTrack} />;
    }
  }
  
  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  renderTrack() {
    let track = this.props.track;
    let rearrangedPlayer = [
      {
        className: track.id,
        style: { 
          cursor: 'pointer',
          backgroundImage: track.cover ? 'url(' + track.cover + ')' : 'url(./images/generic_album_cover.jpg)',
          backgroundSize: 'cover'
        },
        innerComponents: [
          {
            type: 'play',
            style: {
              width: '100%',
              justifyContent: 'center',
              filter: 'invert(100%)',
              opacity: '0.4'
            }
          }
        ]
      }
    ];

    return (
      track.preview_url ? 
      <AudioPlayer 
        audioFiles={[
          {
            src: track.preview_url,
            title: track.title,
            artist: track.artist
          } 
        ]}
        rearrange={rearrangedPlayer}
        playerWidth='auto'
        iconSize='auto'
      /> : <Image src={track.cover ? track.cover : './images/generic_album_cover.jpg'} size='tiny' />
    )
  }
    
  render() {
    let track = this.props.track;
    return (
      <Item className='track'>
        <Item.Image size='tiny'>
          {this.renderTrack()}
        </Item.Image>
        <Item.Content className='track-information'>
          <Item.Header className='track-title' style={{color: 'white'}}>{track.title}</Item.Header>
          <Item.Description className='track-description'>
            <p className='track-artist' style={{color: 'white'}}>{track.artist}</p>
            <p className='track-album' style={{color: 'white'}}>{track.album}</p>
          </Item.Description>
        </Item.Content>
        <Item.Content className='track-action'>
          <Item.Extra>
            {this.renderAction()}
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  }
}

export default Track;