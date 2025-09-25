#!/usr/bin/env node
/**
 * Simple test script to verify Gemini model implementation
 */
import dotenv from 'dotenv';
import { GeminiModel } from './models/geminiModel.js';

// Load environment variables
dotenv.config();

async function testGeminiModel() {
    /**Test the Gemini model implementation*/
    try {
        // Check if API key is set
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.log("❌ GEMINI_API_KEY not found in environment variables");
            console.log("Please set GEMINI_API_KEY in your .env file");
            return false;
        }
        
        // Initialize the model
        console.log("🔄 Initializing Gemini model...");
        const model = new GeminiModel(
            "You are a helpful AI assistant that provides concise and accurate responses.",
            0.1
        );
        
        // Test basic text generation
        console.log("🔄 Testing basic text generation...");
        const testPrompt = "What is artificial intelligence in one sentence?";
        const [response, inputTokens, outputTokens] = await model.generateStringText(testPrompt);
        
        console.log("✅ Test successful!");
        console.log(`📝 Response: ${response}`);
        console.log(`📊 Input tokens: ${inputTokens}`);
        console.log(`📊 Output tokens: ${outputTokens}`);
        
        // Test JSON generation
        console.log("\n🔄 Testing JSON generation...");
        const jsonPrompt = "Generate a simple JSON object with name and age fields";
        const [jsonResponse, inputTokens2, outputTokens2] = await model.generateText(jsonPrompt);
        
        console.log("✅ JSON test successful!");
        console.log(`📝 Response: ${jsonResponse}`);
        console.log(`📊 Input tokens: ${inputTokens2}`);
        console.log(`📊 Output tokens: ${outputTokens2}`);
        
        return true;
        
    } catch (error) {
        console.log(`❌ Test failed with error: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log("🚀 Testing Gemini Model Implementation");
    console.log("=".repeat(50));
    
    const success = await testGeminiModel();
    
    if (success) {
        console.log("\n🎉 All tests passed! Gemini model is working correctly.");
    } else {
        console.log("\n💥 Tests failed. Please check your configuration.");
    }
}

main().catch(console.error);
