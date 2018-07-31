import React from 'react';
import { Base } from '../Base/Base';
import { Grid, Header, Icon } from 'semantic-ui-react';
import { TrackList } from '../TrackList/TrackList';  
import './SearchResults.css';
export class SearchResults extends Base {
  render() {    
    return (
      <Grid.Column width={6} className='search-results'>
        <Grid.Row className='search-results-term'>
          <Header as='h2'>
            I <Icon name='heart' color='purple' /> {this.props.searchTerm ? this.props.searchTerm : 'Jammming'}
          </Header>
        </Grid.Row>
        <Grid.Row className='search-results-tracks'>
          <TrackList 
            tracks={this.props.searchResults}
            onAdd={this.props.onAdd} 
            onRemove={this.props.onRemove}
          />
        </Grid.Row >
      </Grid.Column>
    );
  }
}

export default SearchResults;