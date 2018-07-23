import React from 'react'
import './SearchBar.css'

const types = ['album' , 'artist', 'playlist', 'track']

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            q: '',
            type: '',
            market: 'US',
            limit: 20,
            offset: 0
        };
        
    }   

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" />
                <a>SEARCH</a>
            </div>
        )
    }
}

export default SearchBar;