import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

// Import our modules
import { GeminiModel } from './models/geminiModel.js';
import { getGoogleTrend } from './utils/googleTrends.js';
import { CONTENT } from './utils/constants.js';
import { plannerPrompt, qaPrompt, summarizePrompt } from './prompts/prompts.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Data models for token balance management
const TokenBalance = {
    token_symbol: String,
    balance: Number
};

const BalanceUpdate = {
    token_symbol: String,
    amount: Number
};

// Local data storage path
const DATA_FILE = path.join(__dirname, 'data', 'token_balances.json');

// Utility functions for data persistence
async function ensureDataDirectory() {
    await fs.ensureDir(path.join(__dirname, 'data'));
}

async function loadBalances() {
    await ensureDataDirectory();
    try {
        if (await fs.pathExists(DATA_FILE)) {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading balances:', error);
    }
    return {};
}

async function saveBalances(balances) {
    await ensureDataDirectory();
    await fs.writeFile(DATA_FILE, JSON.stringify(balances, null, 2));
}

async function getUserBalances(userId) {
    const allBalances = await loadBalances();
    return allBalances[userId] || {};
}

async function updateUserBalance(userId, tokenSymbol, newBalance) {
    const allBalances = await loadBalances();
    if (!allBalances[userId]) {
        allBalances[userId] = {};
    }
    allBalances[userId][tokenSymbol] = newBalance;
    await saveBalances(allBalances);
}

// API Routes

app.post('/process', async (req, res) => {
    try {
        const { input_text } = req.body;
        
        if (!input_text) {
            return res.status(400).json({ error: 'input_text is required' });
        }

        // Initialize the model instance
        const plannerModelInstance = new GeminiModel(plannerPrompt, 0);
        
        // Generate text using the model
        const prompt = `INPUT_TEXT: ${input_text}`;
        const [intentType, inputToken, outputToken] = await plannerModelInstance.generateText(prompt);
        
        const output = JSON.parse(intentType);
        
        // Return response
        res.json(output);
    } catch (error) {
        res.status(500).json({ error: `Error! ${error.message}` });
    }
});

async function summaryNews(news) {
    const summaryModelInstance = new GeminiModel(summarizePrompt, 0);
    const prompt = `INFORMATION: ${news}\nOUTPUT:`;
    const [summaryContent, inputToken, outputToken] = await summaryModelInstance.generateStringText(prompt);
    return summaryContent;
}

app.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const searchType = "news";
        const query2 = "crypto";
        
        const [filteredData, relatedSearches] = await getGoogleTrend(searchType, query);
        const [filteredData2, relatedSearches2] = await getGoogleTrend(searchType, query2);
        
        const totalData = [...filteredData, ...filteredData2];
        console.log(totalData.length);
        
        let totalNews = "";
        for (const item of totalData) {
            const singleNews = item.title + "\n" + item.snippet;
            totalNews += singleNews + "\n";
        }
        
        const summaryNewsContent = await summaryNews(totalNews);
        res.json({ news: totalData, summary: summaryNewsContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/defiInfo', async (req, res) => {
    try {
        const { input_text } = req.body;
        
        if (!input_text) {
            return res.status(400).json({ error: 'input_text is required' });
        }

        const qaModelInstance = new GeminiModel(qaPrompt, 0);
        const prompt = `INFORMATION:${CONTENT}\nQUESTION:${input_text}\nOUTPUT:`;
        const [output, inputToken, outputToken] = await qaModelInstance.generateStringText(prompt);
        
        res.json({ result: output });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Token Balance Management Endpoints

app.get('/balance/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { token_symbol } = req.query;
        
        const userBalances = await getUserBalances(userId);
        
        if (token_symbol) {
            const balance = userBalances[token_symbol] || 0.0;
            res.json({
                user_id: userId,
                token_symbol: token_symbol,
                balance: balance
            });
        } else {
            res.json({
                user_id: userId,
                balances: userBalances
            });
        }
    } catch (error) {
        res.status(500).json({ error: `Error retrieving balance: ${error.message}` });
    }
});

app.post('/balance/:userId/set', async (req, res) => {
    try {
        const { userId } = req.params;
        const { token_symbol, balance } = req.body;
        
        if (!token_symbol || balance === undefined) {
            return res.status(400).json({ error: 'token_symbol and balance are required' });
        }
        
        await updateUserBalance(userId, token_symbol, balance);
        
        res.json({
            user_id: userId,
            token_symbol: token_symbol,
            balance: balance,
            message: "Balance set successfully"
        });
    } catch (error) {
        res.status(500).json({ error: `Error setting balance: ${error.message}` });
    }
});

app.post('/balance/:userId/increment', async (req, res) => {
    try {
        const { userId } = req.params;
        const { token_symbol, amount } = req.body;
        
        if (!token_symbol || amount === undefined) {
            return res.status(400).json({ error: 'token_symbol and amount are required' });
        }
        
        const userBalances = await getUserBalances(userId);
        const currentBalance = userBalances[token_symbol] || 0.0;
        const newBalance = currentBalance + amount;
        
        await updateUserBalance(userId, token_symbol, newBalance);
        
        res.json({
            user_id: userId,
            token_symbol: token_symbol,
            previous_balance: currentBalance,
            increment_amount: amount,
            new_balance: newBalance,
            message: "Balance incremented successfully"
        });
    } catch (error) {
        res.status(500).json({ error: `Error incrementing balance: ${error.message}` });
    }
});

app.post('/balance/:userId/decrement', async (req, res) => {
    try {
        const { userId } = req.params;
        const { token_symbol, amount } = req.body;
        
        if (!token_symbol || amount === undefined) {
            return res.status(400).json({ error: 'token_symbol and amount are required' });
        }
        
        const userBalances = await getUserBalances(userId);
        const currentBalance = userBalances[token_symbol] || 0.0;
        
        if (currentBalance < amount) {
            return res.status(400).json({
                error: `Insufficient balance. Current: ${currentBalance}, Requested: ${amount}`
            });
        }
        
        const newBalance = currentBalance - amount;
        await updateUserBalance(userId, token_symbol, newBalance);
        
        res.json({
            user_id: userId,
            token_symbol: token_symbol,
            previous_balance: currentBalance,
            decrement_amount: amount,
            new_balance: newBalance,
            message: "Balance decremented successfully"
        });
    } catch (error) {
        res.status(500).json({ error: `Error decrementing balance: ${error.message}` });
    }
});

app.get('/balance/:userId/history', async (req, res) => {
    try {
        const { userId } = req.params;
        const userBalances = await getUserBalances(userId);
        const totalTokens = Object.keys(userBalances).length;
        
        res.json({
            user_id: userId,
            total_tokens: totalTokens,
            balances: userBalances,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: `Error retrieving balance history: ${error.message}` });
    }
});

app.delete('/balance/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { token_symbol } = req.query;
        
        const allBalances = await loadBalances();
        
        if (!allBalances[userId]) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if (token_symbol) {
            if (allBalances[userId][token_symbol]) {
                delete allBalances[userId][token_symbol];
                await saveBalances(allBalances);
                res.json({
                    user_id: userId,
                    token_symbol: token_symbol,
                    message: `Balance for ${token_symbol} cleared successfully`
                });
            } else {
                res.status(404).json({ error: `Token ${token_symbol} not found for user` });
            }
        } else {
            delete allBalances[userId];
            await saveBalances(allBalances);
            res.json({
                user_id: userId,
                message: "All balances cleared successfully"
            });
        }
    } catch (error) {
        res.status(500).json({ error: `Error clearing balances: ${error.message}` });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: "healthy", message: "Token balance API is running" });
});

// Execute swap endpoint (migrated from Next.js API route)
app.post('/api/execute-swap', async (req, res) => {
    try {
        const projectRoot = path.resolve(__dirname, '..');
        const contractDir = path.join(projectRoot, 'opto_contract');
        
        // Check if contract directory exists
        if (!await fs.pathExists(contractDir)) {
            return res.status(500).json({ 
                error: `Contract directory not found: ${contractDir}` 
            });
        }

        // Run the simple mock swap script
        const scriptCmd = `node scripts/simpleMockSwap.js`;
        
        try {
            const { stdout, stderr } = await execAsync(scriptCmd, { 
                cwd: contractDir,
                timeout: 300000 // 5 minutes timeout
            });
            
            // Check if the error is related to missing environment variables
            if (stderr && stderr.includes("Could not find MNEMONIC or PRIVATE_KEY")) {
                return res.json({
                    message: "Configuration Error: Missing authentication credentials",
                    output: stdout,
                    error: "The swap script requires MNEMONIC or PRIVATE_KEY environment variables to be set. Please configure authentication in the opto_contract/.env file.",
                    stderr: stderr
                });
            }
            
            res.json({ 
                message: "HBAR swap script executed successfully", 
                output: stdout 
            });
        } catch (execError) {
            if (execError.code === 'ENOENT') {
                return res.status(500).json({ 
                    error: "Node.js not found. Please install Node.js." 
                });
            }
            throw execError;
        }
    } catch (error) {
        if (error.code === 'TIMEOUT') {
            res.status(408).json({ error: "Script execution timed out." });
        } else {
            res.status(500).json({ error: `Execution error: ${error.message}` });
        }
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HedFi Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Documentation: http://localhost:${PORT}/api`);
});

export default app;
