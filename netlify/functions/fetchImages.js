const fetch = require("node-fetch");

exports.handler = async function (event) {
    const query = event.queryStringParameters.query || "nature";
    const page = event.queryStringParameters.page || 1; //Define page properly
    const accessKey = process.env.API_KEY; // API key stays hidden

    if (!accessKey) {
        return { statusCode: 500, body: JSON.stringify({ error: "API key is missing!" }) };
    }

    const API_URL = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}&per_page=12`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" }, //Ensure correct response format
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch images", details: error.message }) //Include error details
        };
    }
};
