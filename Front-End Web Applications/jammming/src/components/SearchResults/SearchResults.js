import React from 'react'
import '../TrackList/TrackList'
import './SearchResults.css'

class SearchResults extends React.Component {
  constructor(props) {
      super(props);
      this.state = {}
  }   

  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        
      </div>
    )
  }
}

export default SearchResults;

//<TrackList tracks={this.props.searchResults}/>