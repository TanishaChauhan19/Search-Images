const fetch = require("node-fetch");

exports.handler = async (event) => {
    const query = event.queryStringParameters.query || "nature";
    const accessKey = process.env.API_KEY; // 🔒 API key stays hidden

    if (!accessKey) {
        return { statusCode: 500, body: "API key is missing!" };
    }

    const API_URL = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${API_KEY}&per_page=12`;


    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch images" })
        };
    }
};
