import React, { Component } from 'react';
import '../SearchBar/SearchBar';
import '../SearchResults/SearchResults';
import '../Playlist/Playlist';
import './App.css';
import Spotify from '../../util/Spotify';

// Constants
const CLIENT_ID = '76e6440834da4c86a58579c4af9eed25';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: 'New Playlist',
      playListTracks: [],
      userSession: {}
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.filter(playlistTrack => track.id !== playlistTrack.id)) {
    let tracks = this.state.playlistTracks;
    tracks.push(track)
    this.setState({playlistTracks: tracks})
   }
  }
  
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    const removeTrack = tracks.filter(playlistTrack => track.id !== playlistTrack.id);
    this.setState({playlistTracks: removeTrack});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({playListName: 'New Playlist', playListTracks: []});
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults: tracks});
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} />
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
