import React, { Component } from 'react';
import '../SearchBar/SearchBar'
import '../SearchResults/SearchResults'
import '../Playlist/Playlist'
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state.searchResults = {};
  }

  render() {
    return (
      <div>
        <h1>Ja<span class="highlight">mmm</span>ing</h1>
        <div class="App">
          <SearchBar />
          <div class="App-playlist">
            <SearchResults searchResults={this.state.searchResults} />
            <Playlist />
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
