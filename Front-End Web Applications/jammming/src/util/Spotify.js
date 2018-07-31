// Private
const _clientId = '76e6440834da4c86a58579c4af9eed25';
const _clientSecret = '511618b520a64069a14f58af28fc946f';
const _scope = ['playlist-modify-public'];
const _stateKey = 'spotify_auth_state';
const _accessKey = 'spotify_access_token';
const _refreshKey = 'spotify_refresh_token';
let _stateToken = sessionStorage.getItem(_stateKey) ? sessionStorage.getItem(_stateKey) : null; 
let _accessToken = sessionStorage.getItem(_accessKey) ? sessionStorage.getItem(_accessKey) : null;
let _refreshToken = sessionStorage.getItem(_refreshKey) ? sessionStorage.getItem(_refreshKey) : null; 


// Constant
const CORS_URI = 'https://cors-anywhere.herokuapp.com/';
const REDIRECT_URI = 'https://pelian-jammming.surge.sh';
const SEARCH_URI = 'https://api.spotify.com/v1/search?';
const USER_URI = 'https://api.spotify.com/v1/me';
const AUTHORIZE_URI = 'https://accounts.spotify.com/authorize?';
const TOKEN_URI = 'https://accounts.spotify.com/api/token';
const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Possible characters definition for state token generation

function parseURLParameter(param) {
  if (param) {
    param = param.replace(/[[]/, '[').replace(/[\]]/, ']');
    var regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
    var response = regex.exec(window.location.search);
    return response === null ? '' : decodeURIComponent(response[1].replace(/\+/g, ' '));  
  } else {
    const response = window.location.search
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
    window.location.search = '';
    return response;
  }
}

function getUrlParameter(param, hash=false) {
  let response = '';
  let params = new URLSearchParams(window.location.search);
  if (params) {
    if (params.has(param)) {
      response = params.get(param); 
    } else {
      for(let item of params.entries()) {
        response[item[0]] = decodeURIComponent(item[1]);
      }
    }      
  } else {
    // Fallback if URLSearchParams is unsupported on browser
    response = parseURLParameter(param);
  }
  return response;
}

/**
 * Generates a random string containing numbers and letters to act as a state token
 * @param {number} length The length of the generated string
 * @return {string} The PRNG string from nanoid library
 */
function generateRandomString(length = 16) {
  // Use the nanoid libarary to generate a state token
  const generate = require('nanoid/generate');
  const dictionary = require('nanoid-dictionary');

  if (generate && dictionary) {
    return generate(dictionary.filename, length);
  }
  // Fallback to getRandomValues() from the Cryptography API if nanoid library is unavailable
  let array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  array = array.map(x => POSSIBLE.charCodeAt(x % POSSIBLE.length));
  return String.fromCharCode.apply(null, array);
}

/**
 * Calls generateRandomString() to generate a state token and store it to sessionStorage
 */
async function generateStateToken() {
  const response = await sessionStorage.setItem(_stateKey, generateRandomString());
  return response ? sessionStorage.getItem(_stateKey) : null;
}

export const Spotify = {
  
  setAccessToken(token) {
    _accessToken = token;
    sessionStorage.setItem(_accessKey, _accessToken);
  },

  getAccessToken() {
    return _accessToken;
  },

  hasAccessToken() {
    let token = this.getAccessToken();
    if (token) return true;
    return false;
  },

  setStateToken(token) {
    _stateToken = token;
    sessionStorage.setItem(_stateKey, _stateToken);
  },

  getStateToken() {
    return _stateToken;
  },  

  hasStateToken() {
    let token = this.getStateToken();
    if (token) return true;
    return false;
  },

  setRefreshToken(token) {
    _refreshToken = token;
    sessionStorage.setItem(_refreshKey, _refreshToken);
  },

  getRefreshToken() {
    return _refreshToken;
  },  

  hasRefreshToken() {
    let token = this.getRefreshToken();
    if (token) return true;
    return false;
  },

  getAuthCode() {
    return getUrlParameter('code');
  },

  getAuthorizeUserUrl() {
    // https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow
    if (!this.hasStateToken()) {
      generateStateToken();
    }
    return `${AUTHORIZE_URI}client_id=${_clientId}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${_stateToken}&scope=${encodeURIComponent(_scope.join('%20'))}&show_dialog=true`;
  },

  async requestAccessToken() {
    const response = await fetch(`${CORS_URI}${TOKEN_URI}`, {
      method: 'POST',
      body: `grant_type=authorization_code&code=${this.hasRefreshToken() ? this.getRefreshToken() : this.getAuthCode()}&redirect_uri=${REDIRECT_URI}`,
      headers: {
        // Authorization: Basic *<base64 encoded client_id:client_secret>*
        'Authorization': 'Basic '+ btoa(_clientId + ':' + _clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (response.ok) {
      const data = await response.json();
      if (data) {
        const refresh = await this.setRefreshToken(data.refresh_token);
        if (refresh) {
          window.setTimeout(() => this.requestAccessToken(),  data.expires_in * 1000);
          window.history.pushState('Access Token', null, '/');
        }
      }
      return data;
    }
  },

  async search(term) {
    if (term) {
      const response = await fetch(`${CORS_URI}${SEARCH_URI}q=${term}&type=track&limit=10`, {
        headers: {
          'Authorization': `Bearer ${_accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        let tracks = (data.tracks && data.tracks.items.length > 0 ? data.tracks.items : []);
        return tracks.map(track => {
          let albumCover;
          for(var i = 0; i < track.album.images.length; i++) {
            let image = track.album.images[i];
            if(image.height === 64) {
              albumCover = image.url;
              break;
            }
          };
          return {
            id: track.id,
            artist: track.artists[0].name,
            album: track.album.name,
            cover: albumCover,
            title: track.name,
            preview_url: track.preview_url
          };
        });
      }   
    } else {
      // No valid search terms
      return new Promise(resolve => {
        resolve({});
      });
    }
  },

  async savePlaylist(playlistName, playlistTracks) {
    if (!playlistName || !playlistTracks || playlistTracks.length === 0) return;
    const headers = {
      Authorization: `Bearer ${_accessToken}`
    };
    let userId, playlistId;
    const user = await fetch(`${USER_URI}`, {
      headers: headers
    })
    if (user.ok) {
      const jsonUser = await user.json();
      if (!jsonUser) {
        console.log('Error retrieving' + jsonUser)
      }
      userId = jsonUser.id;
    }
    if (userId) {
      const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
      const playlist = await fetch(createPlaylistUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: playlistName
        })
      })
      if (playlist.ok) {
        const jsonPlaylist = await playlist.json();
        if (!jsonPlaylist) {
          console.log('Error retrieving' + jsonPlaylist)
        }
        playlistId = jsonPlaylist.id;
      }
      if (playlistId) {
        const addPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
        return await fetch(addPlaylistUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            uris: playlistTracks
          })
        });
      }
    }
  }  
}