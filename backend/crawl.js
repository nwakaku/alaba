import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function crawlWebsite(url) {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extract text content
        const content = await page.evaluate(() => {
            // Remove script and style elements
            const scripts = document.querySelectorAll('script, style');
            scripts.forEach(el => el.remove());
            
            // Get text content
            return document.body.innerText || document.body.textContent || '';
        });
        
        return content;
    } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
        return `Error crawling ${url}: ${error.message}`;
    } finally {
        await browser.close();
    }
}

async function main() {
    const urls = [
        "https://stable.kittypunch.xyz/pools",
        "https://app.bonzo.finance/dashboard", 
        "https://www.staderlabs.com/hedera/defi/",
        "https://defillama.com/chains",
        "https://gho.aave.com/markets/",
    ];
    
    const dataDir = join(__dirname, 'data');
    await fs.ensureDir(dataDir);
    
    const filePath = join(dataDir, 'information.txt');
    let fileContent = '';
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            console.log(`Crawling ${i + 1} Website: ${url}`);
            const content = await crawlWebsite(url);
            
            fileContent += `\n${'='.repeat(80)}\n`;
            fileContent += `Website ${i + 1}: ${url}\n`;
            fileContent += `${'='.repeat(80)}\n\n`;
            
            if (content) {
                fileContent += content;
            } else {
                fileContent += "Cannot get content";
            }
            
            fileContent += "\n\n";
            console.log(`Successfully crawled: ${url}`);
            
        } catch (error) {
            console.log(`Crawl ${url} Error: ${error.message}`);
            fileContent += `\n${'='.repeat(80)}\n`;
            fileContent += `Website ${i + 1}: ${url}\n`;
            fileContent += `Error: ${error.message}\n`;
            fileContent += `${'='.repeat(80)}\n\n`;
        }
    }
    
    await fs.writeFile(filePath, fileContent, 'utf-8');
    console.log("Save all the information to ./data/information.txt");
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}
