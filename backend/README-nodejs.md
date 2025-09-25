# HedFi Backend (Node.js/Express.js)
HedFi's backend providing AI-powered DeFi insights, news analysis, and token balance management using Node.js and Express.js.

## Features
- **DeFi Knowledge Base**: RAG-powered Q&A system for DeFi strategies
- **News Analysis**: Real-time news search and AI summarization
- **Token Balance Management**: User portfolio tracking and management
- **Google Trends Integration**: Market sentiment analysis
- **Web Crawling**: Automated data collection from DeFi protocols

## Quick Start
### Prerequisites
- Node.js 18.0.0+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- Serper API key (for news search)

### Environment Setup
Create `.env` file:
```bash
GEMINI_API_KEY="your_gemini_api_key"
SERPER_API_KEY="your_serper_key"
INCH_API_KEY="your_1inch_api_key"
```

### Installation
```bash
npm install
```

### Run Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Test Implementation
Test the Gemini model implementation:
```bash
# Test with API calls
npm test

# Test basic setup
npm run test:simple

# Test installation
node test-installation.js
```

### Web Crawling
Run the web crawler to collect DeFi data:
```bash
npm run crawl
```

## API Endpoints

### AI Processing
- `POST /process` - Process input and determine intent type
- `POST /defiInfo` - Get DeFi information and Q&A
- `POST /search` - Search and summarize news

### Token Balance Management
- `GET /balance/:userId` - Get user token balances
- `POST /balance/:userId/set` - Set initial token balance
- `POST /balance/:userId/increment` - Increment token balance
- `POST /balance/:userId/decrement` - Decrement token balance
- `GET /balance/:userId/history` - Get balance history
- `DELETE /balance/:userId` - Clear user balances

### Utility
- `GET /health` - Server health status
- `POST /api/execute-swap` - Execute blockchain swap operations

## Project Structure
```
backend/
├── models/
│   └── geminiModel.js          # Google Gemini AI integration
├── utils/
│   ├── helperFunctions.js      # Utility functions
│   ├── googleTrends.js         # Google Trends API integration
│   └── constants.js            # Constants and data loading
├── prompts/
│   └── prompts.js              # AI prompts and templates
├── data/
│   ├── information.txt         # DeFi knowledge base
│   └── token_balances.json     # User balance storage
├── server.js                   # Main Express.js server
├── crawl.js                    # Web crawling functionality
├── test-gemini.js              # Gemini model tests
├── test-gemini-simple.js       # Basic setup tests
├── test-installation.js        # Installation verification
└── package.json                # Dependencies and scripts
```

## Migration from Python
This Node.js version is a complete migration from the original Python/FastAPI backend with the following improvements:

### Advantages of Node.js Version:
1. **Unified Language**: Same language as frontend (JavaScript/TypeScript)
2. **Better Performance**: Non-blocking I/O for concurrent requests
3. **Easier Deployment**: Single runtime environment
4. **Modern Async/Await**: Cleaner asynchronous code
5. **Rich Ecosystem**: Extensive npm package ecosystem

### Key Changes:
- **FastAPI → Express.js**: Web framework migration
- **Google Generative AI**: Updated to latest Node.js SDK
- **Puppeteer**: Replaced Python web crawling with headless Chrome
- **fs-extra**: Enhanced file system operations
- **ES Modules**: Modern JavaScript module system

## Health Check
- `GET /health` - Server health status

## Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Run web crawler
npm run crawl
```

## Production Deployment
```bash
# Install production dependencies
npm install --production

# Start server
npm start
```

The server will run on `http://localhost:8000` by default.
