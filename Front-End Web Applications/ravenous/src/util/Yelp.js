const apiKey = 'NEfel9f2zgwWy_nkbZ18T68hKphzAHDHeNvwLddp-n3MOrqvkHJBjO-_iVvLQoYgO1x3TZqcbTp8Pu-y3jnrvNrxhM1IAx5CtQ1_9Kfd79UXmsYkonnAJ6LWEVtRW3Yx';
const yelpAPI = 'https://api.yelp.com/v3'

async function search(term, location, sortBy) {
    const endpoint = `https://cors-anywhere.herokuapp.com/${yelpAPI}/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
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

/* Shorthand
const search = async (api = 'businesses', term, location, sortBy) => await (await fetch(`https://cors-anywhere.herokuapp.com/${yelpAPI}/${api}/search?term=${term}&location=${location}&sort_by=${sortBy}`)).json()
*/
export default search;