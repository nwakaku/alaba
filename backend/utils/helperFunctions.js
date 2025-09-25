import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export function numTokensFromString(string, encodingName = "gpt-4o-mini") {
    // Simple approximation: roughly 4 characters per token
    // In a production environment, you'd want to use a proper tokenizer
    return Math.ceil(string.length / 4);
}

export async function getTokenBalances(walletAddress) {
    try {
        const endpoint = `https://api.1inch.dev/balance/v1.2/1/balances/${walletAddress}`;
        const response = await axios.get(endpoint, {
            headers: {
                'Authorization': process.env.INCH_API_KEY
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.log(`Failed to fetch token balances. Error code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.log(`Error fetching token balances: ${error.message}`);
        return null;
    }
}
