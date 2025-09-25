#!/usr/bin/env node
/**
 * Test script to verify all dependencies are installed correctly
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDependencies() {
    console.log("🔍 Testing Node.js Dependencies...");
    console.log("=".repeat(50));
    
    const dependencies = [
        'express',
        'cors',
        'dotenv',
        '@google/generative-ai',
        'axios',
        'cheerio',
        'puppeteer',
        'node-cron',
        'tiktoken',
        'fs-extra'
    ];
    
    let allPassed = true;
    
    for (const dep of dependencies) {
        try {
            await import(dep);
            console.log(`✅ ${dep} - OK`);
        } catch (error) {
            console.log(`❌ ${dep} - FAILED: ${error.message}`);
            allPassed = false;
        }
    }
    
    return allPassed;
}

async function testFileStructure() {
    console.log("\n🔍 Testing File Structure...");
    console.log("=".repeat(50));
    
    const requiredFiles = [
        'server.js',
        'models/geminiModel.js',
        'utils/helperFunctions.js',
        'utils/googleTrends.js',
        'utils/constants.js',
        'prompts/prompts.js',
        'crawl.js',
        'package.json'
    ];
    
    let allFilesExist = true;
    
    for (const file of requiredFiles) {
        const filePath = path.join(__dirname, file);
        try {
            await fs.access(filePath);
            console.log(`✅ ${file} - EXISTS`);
        } catch (error) {
            console.log(`❌ ${file} - MISSING`);
            allFilesExist = false;
        }
    }
    
    return allFilesExist;
}

async function testEnvironmentSetup() {
    console.log("\n🔍 Testing Environment Setup...");
    console.log("=".repeat(50));
    
    const envFile = path.join(__dirname, '.env');
    const envExists = await fs.pathExists(envFile);
    
    if (envExists) {
        console.log("✅ .env file exists");
        
        const envContent = await fs.readFile(envFile, 'utf-8');
        const hasGeminiKey = envContent.includes('GEMINI_API_KEY');
        const hasSerperKey = envContent.includes('SERPER_API_KEY');
        
        if (hasGeminiKey) {
            console.log("✅ GEMINI_API_KEY found in .env");
        } else {
            console.log("⚠️  GEMINI_API_KEY not found in .env");
        }
        
        if (hasSerperKey) {
            console.log("✅ SERPER_API_KEY found in .env");
        } else {
            console.log("⚠️  SERPER_API_KEY not found in .env");
        }
        
        return hasGeminiKey && hasSerperKey;
    } else {
        console.log("❌ .env file not found");
        console.log("Please create a .env file with your API keys");
        return false;
    }
}

async function main() {
    console.log("🚀 HedFi Backend Installation Test");
    console.log("=".repeat(50));
    
    const depsPassed = await testDependencies();
    const filesPassed = await testFileStructure();
    const envPassed = await testEnvironmentSetup();
    
    console.log("\n📊 Test Results Summary:");
    console.log("=".repeat(50));
    console.log(`Dependencies: ${depsPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`File Structure: ${filesPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Environment: ${envPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (depsPassed && filesPassed && envPassed) {
        console.log("\n🎉 All tests passed! Backend is ready to run.");
        console.log("Run 'npm start' to start the server.");
    } else {
        console.log("\n💥 Some tests failed. Please fix the issues above.");
    }
}

main().catch(console.error);
