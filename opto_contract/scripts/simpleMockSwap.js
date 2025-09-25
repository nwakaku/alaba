// Simple mock swap script that doesn't require hardhat
console.log('🎭 Mock HBAR to HBARX Swap (Demo Mode)');
console.log('=' .repeat(50));

// Simulate account info
const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
console.log('📝 Account:', mockAddress);

// Simulate balance check
const hbarBalance = (Math.random() * 10 + 1).toFixed(4);
console.log('💰 HBAR Balance:', hbarBalance, 'HBAR');

// Mock swap parameters
const swapAmount = '0.1';
const expectedHbarx = '0.095';
const gasUsed = '45000';
const transactionHash = '0x' + Math.random().toString(16).substr(2, 64);

console.log('\n🔄 Simulating Swap...');
console.log('   Amount In:', swapAmount, 'HBAR');
console.log('   Expected Out:', expectedHbarx, 'HBARX');
console.log('   Gas Limit: 500000');

// Simulate processing time
setTimeout(() => {
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
  
  // Exit the process
  process.exit(0);
}, 1000);
