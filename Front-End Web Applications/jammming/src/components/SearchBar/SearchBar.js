import React from 'react';
import { Grid, Input, Icon, Button } from 'semantic-ui-react';
import { Base } from '../Base/Base';
import './SearchBar.css';
export class SearchBar extends Base {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }

    this._bind('handleSubmit', 'handleTermChange');
  }

  handleSubmit() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(e) {
    if (e.target.value && e.target.value.length >= 1) {
      this.setState({term: e.target.value});
    }
  }

  render() {
    return (
      <Grid.Row className='jammming-searchbar' columns='equal'>
        <Grid.Column />
        <Grid.Column width={6}>
          <Input 
            fluid 
            type='text' 
            icon 
            iconPosition='left' 
            placeholder='Search Jammming...' 
            className='search-bar-input' 
            onChange={this.handleTermChange} 
            onKeyPress={(e) => e.key === 'Enter' && e.target.value.length >= 1 ? this.handleSubmit(e.target.value) : e.key} 
            action>
            <input />
            <Icon name='search' />
            <Button type='submit' className='search-bar-submit' onClick={(e) => this.state.term && this.state.term.length >= 1 ? this.handleSubmit(e.target.value) : null} color='purple'>
              SEARCH
            </Button>
          </Input>
        </Grid.Column>          
        <Grid.Column />
      </Grid.Row>
    )
  }
}

export default SearchBar;