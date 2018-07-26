import React from 'react';
import './SearchBar.css';
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  handleSearch() {
    this.props.onSearch(this.state.term)
  }

  handleTermChange(event) {
    this.setState({ term: event.target.value });
  }

  onKeyPress(event) {
    if (event.key === "Enter") {
      this.props.onSearch(this.state.term)
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyPress={this.onKeyPress} />
        <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    )
  }
}