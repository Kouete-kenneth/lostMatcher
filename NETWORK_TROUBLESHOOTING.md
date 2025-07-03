# Network Error Troubleshooting Guide

## Current Issue

```
LOG  API Request to /lost: {"hasToken": true, "isFormData": true, "method": "POST"}
ERROR  API Error for /lost: [AxiosError: Network Error]
ERROR  API Error details: {"data": undefined, "message": "Network Error", "method": "POST", "status": 500, "url": "/lost"}
WARN  Report lost item submission failed: Network Error
```

## Root Cause

The React Native client cannot connect to the backend server at `http://192.168.43.205:5001/api-v1`

## Quick Fixes

### 1. Check Server Status

First, ensure the backend server is running:

```powershell
# In the lostmatcher-server-1 directory
cd "c:\Users\GENIUS ELECTRONICS\Documents\Project Space\lostMatcher\lostmatcher-server-1"
npm run dev
```

### 2. Test Server Connectivity

Use the REST client to test these endpoints (in order):

1. **Test localhost** (if running on same machine):

    ```
    GET http://localhost:5001/api-v1/health
    ```

2. **Test current IP** (if using physical device):

    ```
    GET http://192.168.43.205:5001/api-v1/health
    ```

3. **Test Android emulator IP** (if using emulator):
    ```
    GET http://10.0.2.2:5001/api-v1/health
    ```

### 3. Update API Configuration

Based on which endpoint works, update `lostmatcher-client/lib/api.ts`:

**For localhost (same machine):**

```typescript
const API_BASE_Development = "http://localhost:5001/api-v1";
```

**For Android Emulator:**

```typescript
const API_BASE_Development = "http://10.0.2.2:5001/api-v1";
```

**For Physical Device (update IP):**

```powershell
# Get your current IP address
ipconfig | findstr IPv4
```

Then update:

```typescript
const API_BASE_Development = "http://YOUR_NEW_IP:5001/api-v1";
```

### 4. Alternative Solutions

**Option A: Use Production Server (if available)**

```typescript
const API_BASE =
	typeof __DEV__ !== "undefined" && __DEV__
		? API_BASE_Production // Use production instead of development
		: API_BASE_Production;
```

**Option B: Run on Different Port**
If port 5001 is blocked, change server port in `lostmatcher-server-1/src/server.ts`:

```typescript
const PORT = process.env.PORT || 3000; // Change from 5001 to 3000
```

## Testing Sequence

1. **Start the server:**

    ```powershell
    cd lostmatcher-server-1
    npm run dev
    ```

2. **Check server logs** - should show:

    ```
    Server running on port 5001
    Connected to MongoDB
    ```

3. **Test connectivity** using the REST file endpoints above

4. **Update client configuration** based on which endpoint works

5. **Restart the React Native app** after configuration changes

## Network Configuration Notes

-   **Physical Device**: Needs the computer's actual IP address on the local network
-   **Android Emulator**: Uses `10.0.2.2` to access the host machine's localhost
-   **iOS Simulator**: Can usually use `localhost` directly
-   **Expo Go**: Requires the actual IP address of your development machine

## Firewall/Security Considerations

If still getting network errors:

1. Check Windows Firewall - allow port 5001
2. Check antivirus software - allow Node.js/npm
3. Try a different port (3000, 8000, etc.)
4. Ensure your network allows local development servers

## Quick Test Commands

```powershell
# Test if server is running locally
curl http://localhost:5001/api-v1/health

# Test if server is accessible from network
curl http://192.168.43.205:5001/api-v1/health

# Get your current IP address
ipconfig | findstr IPv4
```
