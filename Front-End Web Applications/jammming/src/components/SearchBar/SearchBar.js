import React from 'react'
import './SearchBar.css'

const types = ['album', 'artist', 'playlist', 'track']
export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        };

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    search() {
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
                <a onClick={this.search}>SEARCH</a>
            </div>
        )
    }
}