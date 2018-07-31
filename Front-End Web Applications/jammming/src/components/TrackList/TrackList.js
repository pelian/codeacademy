import React, { Component } from 'react';
import { Item } from 'semantic-ui-react'
import { Track } from '../Track/Track';
import './TrackList.css';
export class TrackList extends Component {  
  render() {
    return (
      <Item.Group className="tracklist" divided>
        {
          this.props.tracks.map(track => {
            return (
              <Track 
                key={track.id} 
                track={track} 
                onAdd={this.props.onAdd} 
                onRemove={this.props.onRemove} 
                isRemovable={this.props.isRemovable} 
              />
            )
          })
        }  
      </Item.Group>
    );
  }
}

export default TrackList;