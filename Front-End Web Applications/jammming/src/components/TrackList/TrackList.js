import React from 'react'
import '../Track/Track'
import './TrackList.css'

class TrackList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }   

    render() {
        return (
            <div className="TrackList">
            {
                this.props.tracks.map(track => {
                    return // <Track key={track.id} track={track} />
                })
            }
            </div>
        )
    }
}

export default TrackList;

