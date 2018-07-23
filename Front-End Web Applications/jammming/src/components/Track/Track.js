import React from 'react'
import './Track.css'

class Track extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }   

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3></h3>
          <p></p>
        </div>
        <a className="Track-action"></a>
      </div>
    )
  }
}

export default Track;
/*
<div class="Track">
  <div class="Track-information">
    <h3>{name}</h3>
    <p>{artist} | {album}</p>
  </div>
  <a class="Track-action">{action}</a>
</div>
*/