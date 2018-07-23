// Constants
const CORS_URI = 'https://cors-anywhere.herokuapp.com/';
const SEARCH_API = 'https://api.spotify.com/v1/search?';
const AUTHORIZE_API = 'https://accounts.spotify.com/authorize?';
const REDIRECT_URI = 'https://pelian-jammming.surge.sh';

export default Spotify = (function() {
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
            const spotify = internal(this);
            spotify.id = id;
            spotify.statekey = 'spotify_auth_state';
            spotify.token = ''
            spotify.scopes = ['playlist-modify-public'];
        }
        
        // Set properties
        // set id(newID) { internal(this).id = newID; }
        // set secret(newSecret) { internal(this).secret = newSecret; }
        // set token(newToken) { internal(this).token = newToken; }
        set scopes(newScopes) { internal(this).scopes = newScopes; }
        
        // Get properties
        get id() { return spotify.id; }
        get key() { return spotify.statekey; }
        // get token() { return internal(this).token; }
        get scopes() { return spotify.scopes; }
        
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
            sessionStorage.setItem(spotify.statekey, this.generateRandomString());
            return (sessionStorage.getItem(spotify.statekey));
        }

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        static getHashParams() {
            const hash = windows.location.hash
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
            if (spotify.token) {
                return spotify.token;
            }

            // Send an authorization request if no valid token exists
            try {
                let hash = getHashParams();
                let token = hash.access_token;
                let state = hash.state;
                let expires = hash.expires_in;
                let storedState = sessionStorage.getItem(spotify.statekey);
                
                if (token && (state == null || state !== storedState)) {
                    alert('An error was encountered during authentication');
                } else if (token && expires) { 
                    window.setTimeout(() => spotify.token = '', expires * 1000);
                    window.history.pushState('Access Token', null, '/');
                    spotify.token = token;
                } else {
                    if (this.generateStateToken()) {
                        let params = {
                            client_id: spotify.id,
                            response_type: 'token',
                            redirect_uri: REDIRECT_URI,
                            state: sessionStorage.getItem(spotify.key),
                            scope: spotify.scopes.join('%20'),
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
            } return spotify.token
        }

        /**
         * Get Spotify Catalog information about artists, albums, tracks or playlists that match a keyword string.
         * @param {string} url API endpoint
         * @param {string} q Search query keywords and optional field filters and operators
         * @param {string} type A comma-separated list of item types to search across
         * @param {string} market An ISO 3166-1 alpha-2 country code or the string from_token
         * @param {number} limit Maximum number of results to return default: 20, minimum: 1, maximum: 50
         * @param {number} offset The index of the first result to return default (the first result): 0, maximum offset (including limit): 10,000
         * @return {object} An array of artist objects, simplified album objects, and/or track objects wrapped in a paging object in JSON
         */
        async search(url, q, type, market, limit, offset) {
            const endpoint = `https://cors-anywhere.herokuapp.com/${url}search?q=${q}&type=${type}&sort_by=${sortBy}`;
            try {  
                const response = await fetch(endpoint, {
                    headers: { 
                        Authorization: `Bearer ${accessToken}` 
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.businesses) {
                        return data.businesses.map(business => ({
                            id: business.id,
                            imageSrc: business.image_url,
                            name: business.name,
                            address: business.location.address1,  
                            city: business.location.city,
                            state: business.location.city,
                            zipCode: business.location.zip_code,
                            category: business.categories[0].title,
                            rating: business.rating,
                            reviewCount: business.review_count
                        }));
                    }
                }
            } catch(error) {
                console.log(error);
            }
        }
    }
    return Spotify;
}());