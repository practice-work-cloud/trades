# API Documentation

This document outlines the API endpoints available in the Trading Dashboard application.

## Base URL

All API endpoints are relative to the base URL of your deployment:

```
http://localhost:5000/api
```

## Authentication

**Note**: The current implementation uses a simple authentication mechanism. In a production environment, you would want to implement proper JWT authentication.

## Endpoints

### Users

#### Register User

```
POST /api/users/register
```

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe"
}
```

#### Login

```
POST /api/users/login
```

Authenticate a user and create a session.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe"
}
```

### Orders

#### Get All Orders

```
GET /api/orders
```

Retrieve all orders for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "instrument": "NIFTY 50",
    "type": "BUY",
    "price": 24500,
    "quantity": 1,
    "status": "COMPLETED",
    "trigger": "Target Price",
    "createdAt": "2025-05-07T12:00:00Z"
  }
]
```

#### Create Order

```
POST /api/orders
```

Create a new order.

**Request Body:**
```json
{
  "userId": 1,
  "instrument": "NIFTY 50",
  "type": "BUY",
  "price": 24500,
  "quantity": 1,
  "status": "PENDING",
  "trigger": "Target Price"
}
```

**Response:**
```json
{
  "id": 2,
  "userId": 1,
  "instrument": "NIFTY 50",
  "type": "BUY",
  "price": 24500,
  "quantity": 1,
  "status": "PENDING",
  "trigger": "Target Price",
  "createdAt": "2025-05-07T12:15:00Z"
}
```

### Trading Rules

#### Get All Trading Rules

```
GET /api/trading-rules
```

Retrieve all trading rules for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "targetPrice": 24500,
    "takeProfit": 25000,
    "stopLoss": 23500,
    "autoExecute": true,
    "strategy": "targetPrice",
    "isActive": true,
    "createdAt": "2025-05-07T12:00:00Z",
    "updatedAt": "2025-05-07T12:00:00Z"
  }
]
```

#### Create Trading Rule

```
POST /api/trading-rules
```

Create a new trading rule.

**Request Body:**
```json
{
  "userId": 1,
  "targetPrice": 24500,
  "takeProfit": 25000,
  "stopLoss": 23500,
  "autoExecute": true,
  "strategy": "targetPrice",
  "isActive": true
}
```

**Response:**
```json
{
  "id": 2,
  "userId": 1,
  "targetPrice": 24500,
  "takeProfit": 25000,
  "stopLoss": 23500,
  "autoExecute": true,
  "strategy": "targetPrice",
  "isActive": true,
  "createdAt": "2025-05-07T12:15:00Z",
  "updatedAt": "2025-05-07T12:15:00Z"
}
```

#### Update Trading Rule

```
PATCH /api/trading-rules/:id
```

Update an existing trading rule.

**Request Body:**
```json
{
  "targetPrice": 24600,
  "takeProfit": 25100,
  "stopLoss": 23400,
  "isActive": true
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "targetPrice": 24600,
  "takeProfit": 25100,
  "stopLoss": 23400,
  "autoExecute": true,
  "strategy": "targetPrice",
  "isActive": true,
  "createdAt": "2025-05-07T12:00:00Z",
  "updatedAt": "2025-05-07T12:30:00Z"
}
```

### Market Data

#### Get Latest Market Data

```
GET /api/market-data/latest/:symbol
```

Get the latest market data for a specific symbol.

**Response:**
```json
{
  "id": 1,
  "symbol": "NIFTY 50",
  "data": {
    "ltp": 24500,
    "open": 24300,
    "high": 24600,
    "low": 24250,
    "close": 24300,
    "volume": 1250000,
    "volumeChange": 5.2,
    "change": 0.82,
    "isMarketOpen": true
  },
  "timestamp": "2025-05-07T12:15:00Z"
}
```

## WebSocket API

The application provides real-time updates via WebSocket.

### Connection

Connect to the WebSocket server:

```javascript
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;
const socket = new WebSocket(wsUrl);
```

### Market Data Updates

Listen for market data updates:

```javascript
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === "marketData") {
    // Handle market data update
    console.log(message.data);
  }
};
```

### Order Execution Updates

Listen for order execution updates:

```javascript
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === "orderExecution") {
    // Handle order execution
    console.log(message.data);
  }
};
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request body or parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a message field:

```json
{
  "message": "Error message details"
}
```