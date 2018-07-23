// Constants
const CORS_URI = 'https://cors-anywhere.herokuapp.com/';
const SEARCH_API = 'https://api.spotify.com/v1/search?';
const AUTHORIZE_API = 'https://accounts.spotify.com/authorize?';
const REDIRECT_URI = 'https://pelian-jammming.surge.sh';

const Spotify = (function() {
    const _private = new WeakMap();
    const internal = (key) => {
        // Initialize if not created
        if (!_private.has(key)) {
            _private.set(key, {});
        }
        // Return private properties object
        return _private.get(key);
    };
    class Spotify {
        constructor(id) {
            internal(this).id = id;
            internal(this).statekey = 'internal(this)_auth_state';
            internal(this).token = ''
            internal(this).scopes = ['playlist-modify-public'];
        }
        
        // Set properties
        // set id(newID) { internal(this).id = newID; }
        // set secret(newSecret) { internal(this).secret = newSecret; }
        // set token(newToken) { internal(this).token = newToken; }
        set scopes(newScopes) { internal(this).scopes = newScopes; }
        
        // Get properties
        get id() { return internal(this).id; }
        get key() { return internal(this).statekey; }
        // get token() { return internal(this).token; }
        get scopes() { return internal(this).scopes; }
        
        /**
         * Generates a random string containing numbers and letters
         * @param {number} length The length of the generated string
         * @return {string} The PRNG string from nanoid library
         */
        static generateRandomString(length = 16) {
            const generate = require('nanoid/generate');
            const dictionary = require('nanoid-dictionary');

            return generate(dictionary.filename, length);
        }

        /**
         * Calls generateRandomString() to generate a state token and saves it to sessionStorage
         */
        static generateStateToken() {
            sessionStorage.setItem(internal(this).statekey, this.generateRandomString());
            return (sessionStorage.getItem(internal(this).statekey));
        }

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        static getHashParams() {
            const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce(function (initial, item) {
                if(item) {
                    let parts = item.split('=');
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
            }, {});
            window.location.hash = '';
            return hash;
        }

        /**
         * Returns the API access token (valid for an hour) if valid otherwise requests and authorization from the user
         */
        static getAccessToken() {
            // Return access token if a valid token exists
            if (internal(this).token) {
                return internal(this).token;
            }

            // Send an authorization request if no valid token exists
            try {
                let hash = this.getHashParams();
                let token = hash.access_token;
                let state = hash.state;
                let expires = hash.expires_in;
                let storedState = sessionStorage.getItem(internal(this).statekey);
                
                if (token && (state == null || state !== storedState)) {
                    alert('An error was encountered during authentication');
                } else if (token && expires) { 
                    window.setTimeout(() => internal(this).token = '', expires * 1000);
                    window.history.pushState('Access Token', null, '/');
                    internal(this).token = token;
                } else {
                    if (this.generateStateToken()) {
                        let params = {
                            client_id: internal(this).id,
                            response_type: 'token',
                            redirect_uri: REDIRECT_URI,
                            state: sessionStorage.getItem(internal(this).key),
                            scope: internal(this).scopes.join('%20'),
                            show_dialog: true
                        }
                        
                        // Setup the query
                        let cors = CORS_URI;
                        let endpoint = AUTHORIZE_API;
                        let esc = encodeURIComponent;
                        let query = Object.keys(params)
                        .map(key => `${esc(key)}=${esc(params[key])}`)
                        .join('&');
                        
                        // Send request
                        window.location = `${cors}${endpoint}${query}`;
                    }              
                }
            } catch(error) {
                console.log(error);
            } return internal(this).token
        }
    }
    return Spotify;
}());