# 🔧 Swap Functionality Setup Guide

## 🐛 **The Real Bug: Missing Authentication Configuration**

The 500 Internal Server Error is caused by **missing authentication credentials** for the Hedera testnet. The hardhat script requires either a `MNEMONIC` or `PRIVATE_KEY` to execute blockchain transactions.

## 🚀 **Solution: Configure Authentication**

### Step 1: Create Environment File
Create a `.env` file in the `opto_contract` directory:

```bash
# Navigate to the opto_contract directory
cd opto_contract

# Create the .env file
touch .env
```

### Step 2: Add Authentication Credentials
Add one of the following to your `.env` file:

#### Option A: Using Mnemonic Phrase (Recommended)
```env
MNEMONIC="your twelve word mnemonic phrase goes here like this example phrase"
```

#### Option B: Using Private Key
```env
PRIVATE_KEY="your_private_key_here_without_0x_prefix"
```

### Step 3: Get Testnet Credentials

#### For Hedera Testnet:
1. Visit [Hedera Portal](https://portal.hedera.com/)
2. Create a testnet account
3. Get your mnemonic phrase or private key
4. Get testnet HBAR from the faucet

#### For Development/Testing:
You can use any testnet wallet (MetaMask, etc.) and export the credentials.

### Step 4: Verify Setup
After adding the credentials, restart your backend server and try the swap functionality again.

## 🔍 **Error Details**

### What's Happening:
1. Frontend calls `/api/execute-swap` ✅
2. Backend finds the script ✅
3. Hardhat tries to execute the script ❌
4. Hardhat fails because no authentication credentials are provided
5. Backend returns 500 error with stderr details

### The Fix:
The hardhat configuration in `opto_contract/hardhat.config.ts` requires:
```typescript
const MNEMONIC = process.env.MNEMONIC
const PRIVATE_KEY = process.env.PRIVATE_KEY

if (accounts == null) {
    console.warn('Could not find MNEMONIC or PRIVATE_KEY environment variables...')
}
```

## 🛠️ **Alternative Solutions**

### Option 1: Mock Mode (For Development)
If you want to test the UI without actual blockchain transactions, you can modify the backend to return a mock response when credentials are missing.

### Option 2: Environment Variables in Backend
You could also set the environment variables in your backend environment instead of the opto_contract directory.

### Option 3: Configuration UI
Add a configuration interface in the frontend to let users input their credentials.

## ✅ **Verification**

Once configured, you should see:
- ✅ 200 OK response from `/api/execute-swap`
- ✅ Successful swap execution in the UI
- ✅ Real-time balance updates
- ✅ No more 500 errors

## 🚨 **Security Notes**

- ⚠️ **NEVER** use mainnet credentials in this file
- ⚠️ **NEVER** commit the `.env` file to version control
- ⚠️ Only use testnet credentials for development
- ⚠️ Keep your private keys secure

## 📝 **Next Steps**

1. Create the `.env` file with testnet credentials
2. Restart the backend server
3. Test the swap functionality
4. Verify the integration works end-to-end

The swap functionality will work perfectly once the authentication is properly configured! 🎉
