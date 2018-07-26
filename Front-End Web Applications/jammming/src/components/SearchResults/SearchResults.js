import React from 'react';
import Track from '../Track/Track';  
import AudioPlayer from '../AudioPlayer/AudioPlayer'
import './SearchResults.css';
class SearchResults extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        audioFile: ''
      };
      this.playPreviewAudio = this.playPreviewAudio.bind(this);
  }   

  playPreviewAudio(newAudioFile) {
    if (window.HTMLAudioElement) {
      document.querySelector('.AudioPlayer').pause();
      if (newAudioFile !== this.state.audioFile) {
        this.setState({
          audioFile: newAudioFile
        }, () => {
          document.querySelector('.AudioPlayer').play();
        });
      } else {
        document.querySelector('.AudioPlayer').play();
      }
    }
  }

  render() {
    let view;
    if (this.props.term !== "") {
      let playPreview = this.playPreviewAudio;
      view = (
        <div className='SearchResults__tracks'>
          <p className='SearchResults__count'>{this.props.results.length} Results</p>
          {
            this.props.results.map(function(track) {
              return <Track key={track.id} info={track} playPreview={playPreview} />
            })
          }
        </div>
      );  
    } else {
      view = <p className='SearchResults__message'>Use the Search Bar above to view tracks.</p>
    }
    
    return (
      <div className='SearchResults'>
        <AudioPlayer src={this.state.audioFile} />
        <div className='SearchResults__content'>
          <h2 className='SearchResults__header'>Search Results: <span className='SearchResults__term'>{this.props.term}</span></h2>
          {view}
        </div> 
      </div>
    );
  }
}

export default  SearchResults;