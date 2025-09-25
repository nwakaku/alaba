# Python to Node.js Migration Guide

This guide explains how to migrate from the Python/FastAPI backend to the Node.js/Express.js backend.

## Overview

The migration maintains 100% API compatibility while providing several advantages:

### Benefits of Node.js Migration:
1. **Unified Language Stack**: Same JavaScript/TypeScript across frontend and backend
2. **Better Performance**: Non-blocking I/O for concurrent AI requests
3. **Simplified Deployment**: Single runtime environment
4. **Modern Async/Await**: Cleaner asynchronous code patterns
5. **Rich Ecosystem**: Extensive npm package ecosystem

## Migration Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Copy your existing `.env` file or create a new one:
```bash
GEMINI_API_KEY="your_gemini_api_key"
SERPER_API_KEY="your_serper_key"
INCH_API_KEY="your_1inch_api_key"
```

### 3. Test Installation
```bash
node test-installation.js
```

### 4. Test AI Functionality
```bash
# Basic setup test
npm run test:simple

# Full AI test (requires API key)
npm test
```

### 5. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Compatibility

All existing API endpoints remain the same:

### AI Processing
- `POST /process` - Intent classification
- `POST /defiInfo` - DeFi Q&A
- `POST /search` - News search and summarization

### Token Balance Management
- `GET /balance/:userId` - Get balances
- `POST /balance/:userId/set` - Set balance
- `POST /balance/:userId/increment` - Increment balance
- `POST /balance/:userId/decrement` - Decrement balance
- `GET /balance/:userId/history` - Balance history
- `DELETE /balance/:userId` - Clear balances

### Utility
- `GET /health` - Health check
- `POST /api/execute-swap` - Blockchain operations

## Key Changes

### 1. Google Gemini Integration
**Python (Old):**
```python
from google import genai
client = genai.Client(api_key=api_key)
```

**Node.js (New):**
```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(apiKey);
```

### 2. Web Framework
**Python (Old):**
```python
from fastapi import FastAPI
app = FastAPI()
```

**Node.js (New):**
```javascript
import express from 'express';
const app = express();
```

### 3. Web Crawling
**Python (Old):**
```python
from crawl4ai import AsyncWebCrawler
async with AsyncWebCrawler() as crawler:
    result = await crawler.arun(url=url)
```

**Node.js (New):**
```javascript
import puppeteer from 'puppeteer';
const browser = await puppeteer.launch();
const page = await browser.newPage();
```

### 4. File Operations
**Python (Old):**
```python
import json
with open(file_path, 'r') as f:
    data = json.load(f)
```

**Node.js (New):**
```javascript
import fs from 'fs-extra';
const data = await fs.readJson(file_path);
```

## Performance Improvements

### 1. Concurrent AI Requests
Node.js handles multiple AI requests concurrently without blocking:
```javascript
// Multiple AI requests can run simultaneously
const [result1, result2, result3] = await Promise.all([
    model.generateText(prompt1),
    model.generateText(prompt2),
    model.generateText(prompt3)
]);
```

### 2. Memory Efficiency
- Better garbage collection
- Lower memory footprint
- Faster startup times

### 3. Async Operations
All file I/O and API calls are non-blocking:
```javascript
// Non-blocking file operations
const balances = await loadBalances();
const news = await getGoogleTrend('news', query);
```

## Data Migration

### Token Balances
The token balance data format remains identical:
```json
{
  "user123": {
    "USDC": 1000.0,
    "ETH": 2.5
  }
}
```

### DeFi Knowledge Base
The `data/information.txt` file format is preserved and automatically loaded.

## Testing

### 1. Installation Test
```bash
node test-installation.js
```

### 2. AI Functionality Test
```bash
npm test
```

### 3. Manual API Testing
```bash
# Health check
curl http://localhost:8000/health

# Process input
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"input_text": "What is DeFi?"}'
```

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Module Import Errors**
   - Ensure you're using Node.js 18+
   - Check package.json has `"type": "module"`

2. **API Key Issues**
   - Verify `.env` file exists and has correct keys
   - Check environment variable names match exactly

3. **Port Conflicts**
   - Default port is 8000
   - Change with `PORT=3000 npm start`

4. **Memory Issues**
   - Increase Node.js memory: `node --max-old-space-size=4096 server.js`

### Debug Mode
```bash
DEBUG=* npm run dev
```

## Rollback Plan

If you need to rollback to Python:

1. Stop Node.js server
2. Start Python server: `uvicorn server:app --reload`
3. Update frontend API endpoints if needed

## Support

For issues or questions:
1. Check the test files for examples
2. Review the console logs for error details
3. Verify all dependencies are installed correctly
