const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';

export async function getImages(urlOptions) {
    const response = await axios.get(BASE_URL, urlOptions);
    return response.data;
}