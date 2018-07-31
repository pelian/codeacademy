import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { Base } from '../Base/Base';
import { Header } from '../Header/Header';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';
import './Jammming.css';

class Jammming extends Base {
  
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: Spotify.hasAccessToken(),
      isProcessingLogin: Spotify.getAuthCode(),
      playlistName: 'New Playlist',
      playlistTracks: [],
      searchResults: {
        loading: false,
        term: '',
        tracks: []
      }
    };

    this._bind('addTrack', 'removeTrack', 'updatePlaylistName', 'savePlaylist', 'handleSearch', 'getNewAccessToken');
  }

  addTrack(track) {
    if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      });
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    });
  } 

  updatePlaylistName(newPlaylistName) {
    this.setState({playlistName: newPlaylistName})
  }

  async savePlaylist() {
    if (!this.state.playlistName) {
      console.log('playlist has no name!')
      return // todo: possibly add a function to request a playlist name before rejecting!
    }
    const trackLinks = await this.state.playlistTracks.map(playlistTrack => 'spotify:track:' + playlistTrack.id);
    const response = await Spotify.savePlaylist(this.state.playlistName, trackLinks);
    if (response) {
      this.setState({searchResults: {
        loading: false, 
        term: '',
        tracks: []
      }, playlistName: this.playlistName, playlistTracks: []});
    }
    this.updatePlaylistName('New Playlist');
  }

  async handleSearch(term) {
    this.setState({
      searchResults: {
        loading: true,
        term: term,
        tracks: []
      }
    });
    const response = await Spotify.search(term);
    if (response) {
      this.setState({
        searchResults: {
          loading: false,
          term: term,
          tracks: response
        }
      });
    }
  }

  getNewAccessToken() {
    Spotify.requestAccessToken().then(tokenResponse => {
      if(tokenResponse.access_token) {
        console.log(Spotify.getAccessToken());
        console.log(Spotify.getRefreshToken());
        console.log(Spotify.getStateToken());
        console.log(tokenResponse.expires_in);
        Spotify.setAccessToken(tokenResponse.access_token);
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }
    });
  }

  render() {
    let body;
    if (this.state.isAuthorized) {
      body = (
        <Segment>
          <Grid stackable>
            <SearchBar onSearch={this.handleSearch} />
            <Grid.Row columns={2} className='jammming-body'>
              <Grid.Column width={1} />
              <SearchResults 
                searchTerm={this.state.searchResults.term}
                searchResults={this.state.searchResults.tracks} 
                onAdd={this.addTrack}
                onRemove={this.removeTrack}
              />
              <Grid.Column width={2} />
              <Playlist 
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onNameChange={this.updatePlaylistName} 
                onRemove={this.removeTrack}
                onSave={this.savePlaylist}
              />
              <Grid.Column width={1} />
            </Grid.Row>
          </Grid>
        </Segment>
      );
    } else if (this.state.isProcessingLogin) {
      this.getNewAccessToken();
      body = <p className='jammming-loading'>Jammming is loading... Please wait</p>;
    } else {
      body = <div className='jammming-blank'>Please Login to start Jammming!</div>
    }
    
    return (
      <main className='jammming'>
        <Header isAuthorized={this.state.isAuthorized}/>
        {body}
      </main>
    );
  }
}
 
export default Jammming;