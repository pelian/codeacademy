import React from 'react';
import { Base } from '../Base/Base';
import { Grid, Input, Button, Icon } from 'semantic-ui-react';
import { TrackList } from '../TrackList/TrackList';
import './Playlist.css';
export class Playlist extends Base {  
  constructor(props) {
    super(props);

    this._bind('handleNameChange');
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }

  render() {
    return (
      <Grid.Column width={6} className='playlist'>
        <Grid.Row className='playlist-save'>
          <Input
            type='text' 
            icon 
            iconPosition='left' 
            placeholder='New Playlist...' 
            className='playlist-input' 
            onChange={this.handleNameChange} 
            onKeyPress={(e) => e.key === 'Enter' ? this.props.onSave(e.target.value) : e.key} 
            action>
            <input />
            <Icon name='heart' />
            <Button type='submit' className='playlist-submit' onClick={this.props.onSave} color='pink'>
              SAVE PLAYLIST
            </Button>
          </Input>
        </Grid.Row>
        <Grid.Row className='playlist-tracks'>
          <TrackList 
            tracks={this.props.playlistTracks} 
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}
            isRemovable={true}
          />
        </Grid.Row>
      </Grid.Column>
    );
  }
}

export default Playlist;