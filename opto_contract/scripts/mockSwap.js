const { ethers } = require("hardhat");

async function main() {
  console.log('🎭 Mock HBAR to HBARX Swap (Demo Mode)');
  console.log('=' .repeat(50));
  
  try {
    // Get signer
    const [signer] = await ethers.getSigners();
    const myAddress = await signer.getAddress();
    console.log('📝 Account:', myAddress);
    
    // Simulate checking HBAR balance
    const hbarBalance = await signer.getBalance();
    const hbarFormatted = ethers.utils.formatEther(hbarBalance);
    console.log('💰 HBAR Balance:', hbarFormatted, 'HBAR');
    
    // Mock swap parameters
    const swapAmount = '0.1'; // 0.1 HBAR
    const expectedHbarx = '0.095'; // 0.095 HBARX (simulated)
    const gasUsed = '45000';
    const transactionHash = '0x' + Math.random().toString(16).substr(2, 64);
    
    console.log('\n🔄 Simulating Swap...');
    console.log('   Amount In:', swapAmount, 'HBAR');
    console.log('   Expected Out:', expectedHbarx, 'HBARX');
    console.log('   Gas Limit: 500000');
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n📋 Transaction Details:');
    console.log('   Hash:', transactionHash);
    console.log('   Status: Success ✅');
    console.log('   Gas Used:', gasUsed);
    
    console.log('\n🎉 Mock Swap Summary:');
    console.log('   Swapped:', swapAmount, 'HBAR');
    console.log('   Received:', expectedHbarx, 'HBARX');
    console.log('   Transaction Hash:', transactionHash);
    console.log('   Network: Hedera Testnet (Mock)');
    
    console.log('\n✅ Mock swap completed successfully!');
    console.log('💡 This is a demo transaction - no real tokens were swapped');
    
  } catch (error) {
    console.error('❌ Mock swap failed:', error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
