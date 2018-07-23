import React from 'react';

const CLIENT_ID = '76e6440834da4c86a58579c4af9eed25';
const CLIENT_SECRET = '511618b520a64069a14f58af28fc946f';
const SPOTIFY_API = 'https://api.spotify.com/v1/';
const AUTHORIZE_API = 'https://accounts.spotify.com/';
const REDIRECT_URI = ''
const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random string containing numbers and letters from the set of POSSIBLE
 * @param {number} length The length of the generated string
 * @return {string} The PRNG string from cryptography API
 */
function generateRandomString(length = 16) {
    let array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);   
}



async function search(url, q, type, market, limit, offset) {
    const endpoint = `https://cors-anywhere.herokuapp.com/${url}search?q=${q}&type=${type}&sort_by=${sortBy}`;
    try {  
        const response = await fetch(endpoint, {
            headers: { 
                Authorization: `Bearer ${apiKey}` 
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
};

async function authorize(client_id, response_type = 'token', redirect_uri, state, scope = 'all', show_dialog = false) {
    const endpoint = `https://cors-anywhere.herokuapp.com/${url}authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type={${response_type}}&state=${state}&show_dialog=${show_dialog}`;
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
                return data.
            }
        }
    }
}

class Spotify extends React.Component {

}

/* Shorthand
const search = async (term, location, sortBy) => await (await fetch(`https://cors-anywhere.herokuapp.com/${yelpAPI}/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`)).json()
*/
export default search;