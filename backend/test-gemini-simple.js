#!/usr/bin/env node
/**
 * Simple test script to verify Gemini model implementation (without API key)
 */
import dotenv from 'dotenv';

dotenv.config();

async function testImports() {
    /**Test if we can import the required modules*/
    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        console.log("✅ @google/generative-ai imported successfully");
        return true;
    } catch (error) {
        console.log(`❌ Failed to import @google/generative-ai: ${error.message}`);
        console.log("Please install with: npm install @google/generative-ai");
        return false;
    }
}

async function testModelClass() {
    /**Test if we can create the GeminiModel class*/
    try {
        const { GeminiModel } = await import('./models/geminiModel.js');
        console.log("✅ GeminiModel class imported successfully");
        return true;
    } catch (error) {
        console.log(`❌ Failed to import GeminiModel: ${error.message}`);
        return false;
    }
}

function testEnvironment() {
    /**Test environment setup*/
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        console.log("✅ GEMINI_API_KEY found in environment");
        return true;
    } else {
        console.log("⚠️  GEMINI_API_KEY not found in environment");
        console.log("Please set GEMINI_API_KEY in your .env file");
        return false;
    }
}

async function main() {
    console.log("🚀 Testing Gemini Model Implementation");
    console.log("=".repeat(50));
    
    // Test imports
    const importSuccess = await testImports();
    
    if (importSuccess) {
        // Test model class
        const classSuccess = await testModelClass();
        
        if (classSuccess) {
            // Test environment
            const envSuccess = testEnvironment();
            
            if (envSuccess) {
                console.log("\n🎉 All basic tests passed! Ready to test with API key.");
                console.log("Run 'npm test' to test with actual API calls.");
            } else {
                console.log("\n⚠️  Basic tests passed, but API key not configured.");
                console.log("Set GEMINI_API_KEY in your .env file to test API calls.");
            }
        } else {
            console.log("\n💥 Model class import failed.");
        }
    } else {
        console.log("\n💥 Library import failed. Please install @google/generative-ai first.");
    }
}

main().catch(console.error);
