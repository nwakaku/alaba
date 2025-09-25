# Frontend Integration Guide

This guide covers the complete integration of the backend swap execution with the frontend UI, including balance management, error logging, and user flow polish.

## 🚀 Features Implemented

### 1. API Service Layer (`src/lib/api.ts`)
- Centralized API communication with comprehensive error handling
- User ID tracking for all operations
- Automatic logging of all API requests and responses
- Type-safe interfaces for all API responses

### 2. Custom Hooks
- **`useSwap`** (`src/hooks/useSwap.ts`): Manages swap execution state and operations
- **`useBalances`** (`src/hooks/useBalances.ts`): Handles token balance management with real-time updates

### 3. Swap & Deposit Button (`src/components/SwapDepositButton/index.tsx`)
- Integrated swap execution with visual feedback
- Automatic balance refresh after successful swaps
- Error handling with user-friendly messages
- Loading states and success indicators

### 4. Enhanced UI Components
- **Main Page** (`src/app/page.tsx`): 
  - Real-time balance display for logged-in users
  - Improved AI chat interface with better error handling
  - Integrated swap functionality in portfolio completion flow
- **Profile Page** (`src/app/profile/page.tsx`):
  - Real-time balance integration
  - Refresh functionality for balance updates
  - Swap & Deposit button integration
  - Debug panel for development

### 5. Comprehensive Logging (`src/lib/logger.ts`)
- Multi-level logging (DEBUG, INFO, WARN, ERROR)
- User action tracking
- API request/response logging
- Swap operation logging
- Balance update tracking
- Export functionality for debugging

### 6. Integration Testing (`src/lib/test-integration.ts`)
- Backend connection testing
- Balance operations testing
- Swap execution testing
- Automated test runner
- Browser console integration

## 🔧 Backend Integration

### API Endpoints Used
- `POST /api/execute-swap` - Execute HBAR to HBARX swap
- `POST /defiInfo` - Get DeFi information and AI responses
- `GET /balance/{user_id}` - Get user token balances
- `POST /balance/{user_id}/set` - Set initial token balance
- `POST /balance/{user_id}/increment` - Increment token balance
- `POST /balance/{user_id}/decrement` - Decrement token balance
- `GET /health` - Health check endpoint

### Error Handling
- Comprehensive error logging for all operations
- User-friendly error messages in UI
- Automatic retry mechanisms where appropriate
- Detailed error context for debugging

## 🎯 User Flow

### 1. Login Flow
1. User connects wallet via Privy
2. Balances are automatically loaded and displayed
3. Real-time balance updates are enabled

### 2. Portfolio Creation Flow
1. User selects investment strategy (multi or single)
2. User enters investment amount
3. AI provides portfolio recommendations
4. User can execute "Swap & Deposit" to trigger the full workflow
5. Balances are updated in real-time after successful operations

### 3. Profile Management
1. User can view all token balances
2. Manual refresh functionality
3. Swap & Deposit operations
4. Debug tools for development

## 🛠️ Development Tools

### Debug Panel
- Available only in development mode
- Run integration tests
- View and export logs
- Monitor API performance
- Test swap execution

### Console Integration
```javascript
// Access test functions in browser console
window.testIntegration.runAllTests(userId);
window.testIntegration.testBackendConnection();
window.testIntegration.logger.getLogs();
```

## 📊 Monitoring & Logging

### Log Levels
- **DEBUG**: Detailed debugging information
- **INFO**: General information about operations
- **WARN**: Warning messages for potential issues
- **ERROR**: Error messages for failed operations

### Tracked Operations
- User actions (login, portfolio creation, swaps)
- API requests and responses
- Swap execution lifecycle
- Balance updates and changes
- Error occurrences and context

## 🔄 Real-time Updates

### Balance Updates
- Automatic refresh after successful swaps
- Manual refresh functionality
- Real-time display in UI
- Error handling for failed updates

### State Management
- Centralized state management with custom hooks
- Optimistic updates where appropriate
- Error state handling
- Loading state management

## 🚨 Error Handling

### Frontend Error Handling
- User-friendly error messages
- Automatic error logging
- Graceful degradation
- Retry mechanisms

### Backend Error Handling
- Comprehensive error responses
- Detailed error logging
- Timeout handling
- Network error recovery

## 🧪 Testing

### Integration Tests
- Backend connection testing
- Balance operations testing
- Swap execution testing
- End-to-end workflow testing

### Manual Testing
- Debug panel for interactive testing
- Console integration for debugging
- Log export for analysis
- Real-time monitoring

## 📝 Usage Examples

### Basic Swap Execution
```typescript
import { useSwap } from "@/hooks/useSwap";

const { swapState, executeSwap } = useSwap();
const success = await executeSwap(userId);
```

### Balance Management
```typescript
import { useBalances } from "@/hooks/useBalances";

const { balanceState, refreshBalances, incrementBalance } = useBalances();
await refreshBalances(userId);
await incrementBalance(userId, "USDC", 100);
```

### API Service Usage
```typescript
import { apiService } from "@/lib/api";

const response = await apiService.executeSwap(userId);
const balance = await apiService.getBalance(userId, "USDC");
```

## 🔧 Configuration

### Environment Variables
- `VITE_BACKEND_URL`: Backend API URL (default: http://localhost:8000)

### Development Mode
- Debug panel enabled
- Enhanced logging
- Test utilities available
- Console integration active

## 🎉 Benefits

1. **Seamless Integration**: Backend and frontend work together seamlessly
2. **Real-time Updates**: Users see immediate feedback and balance updates
3. **Error Resilience**: Comprehensive error handling and user feedback
4. **Developer Experience**: Extensive logging and debugging tools
5. **User Experience**: Smooth, intuitive interface with clear feedback
6. **Maintainability**: Clean, modular code with proper separation of concerns

The integration provides a complete, production-ready solution for DeFi portfolio management with swap execution capabilities.
