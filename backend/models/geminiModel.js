import { GoogleGenAI } from '@google/genai';
import { encoding_for_model } from 'tiktoken';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiModel {
    constructor(systemPrompt, temperature = 0) {
        this.temperature = temperature;
        this.systemPrompt = systemPrompt;
        
        // Initialize the client with API key
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyD7zgnZsnAeXZXPI1lmVt4s8z9TlrmyxgQ";
        this.genAI = new GoogleGenAI({ apiKey });
        this.modelName = "gemini-2.5-flash";
    }

    async generateText(prompt) {
        try {
            const inputTokensLength = this.numTokensFromString(this.systemPrompt + prompt);
            console.log("input tokens length", inputTokensLength);
            
            // Combine system prompt and user prompt for Gemini
            const fullPrompt = `${this.systemPrompt}\n\n${prompt}`;
            
            const response = await this.genAI.models.generateContent({
                model: this.modelName,
                contents: fullPrompt,
            });
            
            const responseText = response.text;
            const outputTokensLength = this.numTokensFromString(responseText);
            console.log("output tokens length", outputTokensLength);
            
            return [responseText, inputTokensLength, outputTokensLength];
        } catch (error) {
            const response = { error: `Error in invoking model! ${error.message}` };
            console.log(response);
            return response;
        }
    }

    async generateStringText(prompt) {
        try {
            const inputTokensLength = this.numTokensFromString(this.systemPrompt + prompt);
            console.log("input tokens length", inputTokensLength);
            
            // Combine system prompt and user prompt for Gemini
            const fullPrompt = `${this.systemPrompt}\n\n${prompt}`;
            
            const response = await this.genAI.models.generateContent({
                model: this.modelName,
                contents: fullPrompt,
            });
            
            const responseText = response.text;
            const outputTokensLength = this.numTokensFromString(responseText);
            console.log("output tokens length", outputTokensLength);
            
            return [responseText, inputTokensLength, outputTokensLength];
        } catch (error) {
            const response = { error: `Error in invoking model! ${error.message}` };
            console.log(response);
            return response;
        }
    }

    async generateWithWebAnnotations(prompt, searchModel = "gemini-2.5-flash") {
        try {
            const inputTokensLength = this.numTokensFromString(prompt);
            console.log("input tokens length", inputTokensLength);
            
            const response = await this.genAI.models.generateContent({
                model: searchModel,
                contents: prompt,
            });
            
            const content = response.text;
            
            // Gemini doesn't have the same annotation system as OpenAI, so we'll return empty array
            const annotations = [];
            const outputTokensLength = this.numTokensFromString(content);
            console.log("output tokens length", outputTokensLength);
            
            return [content, annotations, inputTokensLength, outputTokensLength];
        } catch (error) {
            console.log(`Error in generateWithWebAnnotations: ${error.message}`);
            return { error: error.message };
        }
    }

    numTokensFromString(string, encodingName = "gpt-4o-mini") {
        try {
            const encoding = encoding_for_model(encodingName);
            const numTokens = encoding.encode(string).length;
            return numTokens;
        } catch (error) {
            // Fallback to approximate token count (roughly 4 characters per token)
            return Math.ceil(string.length / 4);
        }
    }
}
