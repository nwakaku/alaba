import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export function formatResults(organicResults) {
    /**
     * Format organic search results.
     *
     * @param {Array} organicResults - List of organic search results.
     * @returns {Array} Formatted results containing title, link, and snippet.
     */
    const resultStrings = [];
    for (const result of organicResults) {
        const formattedResult = {
            title: result.title || 'No Title',
            link: result.link || '#',
            snippet: result.snippet || 'No snippet available.'
        };
        resultStrings.push(formattedResult);
    }
    
    return resultStrings;
}

export function isRecentNews(dateStr) {
    const dateString = String(dateStr).toLowerCase();
    const excludedTerms = ['day', 'days', "week", "weeks"];
    return !excludedTerms.some(term => dateString.includes(term));
}

export async function getGoogleTrend(searchType, query) {
    /**
     * Get the Google trend results for the given query.
     *
     * @param {string} searchType - The type of Google trend to get (search, news, shopping).
     * @param {string} query - The query to get the Google trend for.
     * @returns {Array} The Google trend results and related searches.
     */
    const urlMap = {
        "search": "https://google.serper.dev/search",
        "news": "https://google.serper.dev/news"
    };

    const searchUrl = urlMap[searchType] || "https://google.serper.dev/search";

    const payload = JSON.stringify({
        q: query,
        num: 10,
        gl: "tw"
    });

    const headers = {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(searchUrl, payload, { headers });
        const results = response.data;
        let relatedSearches = ["None"];

        if (searchType === "search") {
            relatedSearches = results.relatedSearches?.map(item => item.query) || [];
            const formattedResults = formatResults(results.organic || []);
            return [formattedResults, relatedSearches];
        }

        if (searchType === "news") {
            const newsItems = results.news || [];
            const filteredData = [];
            
            for (const item of newsItems) {
                if (isRecentNews(item.date || '')) {
                    const newsData = {
                        title: item.title || 'N/A',
                        link: item.link || 'N/A',
                        snippet: item.snippet || 'N/A',
                        date: item.date || 'N/A',
                        source: item.source || 'N/A'
                    };
                    filteredData.push(newsData);
                }
            }
            
            return [filteredData, relatedSearches];
        }

        return [{ "Response": "Invalid search type provided." }, relatedSearches];

    } catch (error) {
        if (error.response) {
            return [{ "Response": `HTTP error occurred: ${error.response.status}` }, ["None"]];
        } else if (error.request) {
            return [{ "Response": `Request error occurred: ${error.message}` }, ["None"]];
        } else {
            return [{ "Response": `An unexpected error occurred: ${error.message}` }, ["None"]];
        }
    }
}
