import React, { Component } from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { Spotify } from '../../util/Spotify';
import './Header.css';

export class Header extends Component {
  state = { activeItem: 'home' }

  handleLogOut() {
    Spotify.setAccessToken('');
    Spotify.setRefreshToken('');
    Spotify.setStateToken('');
    window.location.href = '/';
    window.location.reload();
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  loginButton = (
    this.props.isAuthorized ?
      <Menu.Item className='header-logout' name='logout' active={this.state.activeItem === 'logout'} onClick={this.handleLogOut} color='#6d589d'>
        <Button icon labelPosition='left' color='purple'>
          <Icon name='spotify' />
          Logout
        </Button>
      </Menu.Item>
      : 
      <Menu.Item href={Spotify.getAuthorizeUserUrl()} className='header-login' name='login' active={this.state.activeItem === 'login'} onClick={this.handleItemClick} >
        <Button icon labelPosition='left' color='purple'>
          <Icon name='spotify' />
          Login
        </Button>
      </Menu.Item>
    )

  render() {
    const { activeItem } = this.state
    return (
      <Menu className='header' stackable inverted secondary>
        <Menu.Item>
          <span className='logo font-effect-anaglyph'>jammming</span>
        </Menu.Item>
        <Menu.Item href='#' className='logo' name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item
          href='https://github.com/pelian/codeacademy/tree/master/Front-End%20Web%20Applications/jammming'
          name='github'
          active={activeItem === 'github'}
          onClick={this.handleItemClick}
        />
        <Menu.Menu position='right'>
          {this.loginButton}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Header;