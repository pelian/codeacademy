import React from 'react';
import Header from '../Header/Header'
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Login from '../Login/Login'
import Spotify from '../../util/Spotify';
import './Jammming.css';

class Jammming extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: Spotify.hasAccessToken(),
      isLogin: Spotify.getAuthCode(),
      searchResults: {
        loading: false,
        term: "",
        results: []
      },
      playListName: 'New Playlist',
      playListTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);
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

  updatePlaylistName(newPlaylistName) {
    this.setState({playlistName: newPlaylistName})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({playListName: this.playlistName, playListTracks: []});
    });
  }

  async handleSearch(term) {
    this.setState({
      searchResults: {
        loading: true,
        term: term,
        results: []
      }
    });
    const tracks = await Spotify.search(term);
    if (tracks) {
      this.setState({
        searchResults: {
          loading: true,
          term: term,
          results: tracks
        }
      });
    }
  }

  handleLogOut() {
    Spotify.setAccessToken(null);
    // Set https://accounts.spotify.com/authorize query parameter show_dialog to true to force permissions dialog
    window.location.href = '/';
  }

  getNewAccessToken() {
    Spotify.requestAccessToken().then(tokenResponse => {
      if(tokenResponse.access_token) {
        Spotify.setAccessToken(tokenResponse.access_token);
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }
    });
  }

  render() {
    let view;
    if (this.state.isAuthorized) {
      view = (
        <div className='Jamming__container'>
          <SearchBar onSearch={this.handleSearch} />
          <div className='Jammming__playlist'>
            <SearchResults 
              term={this.state.searchResults.term}
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
      );
    } else if (this.state.isLogin) {
      this.getNewAccessToken();
      view = <p className='Jammming__loading'>Logging you into Spotify... Please wait</p>;
    } else {
      view = <Login authorizeUserUrl={Spotify.getAuthorizeUserUrl()} />
    }
    
    return (
      <div className='Jammming'>
        <Header isAuthorized={this.state.isAuthorized} handleLogOut={this.handleLogOut} />
        {view}
      </div>
    );
  }
}
 
export default Jammming;