# Database Schema Documentation

This document outlines the database schema for the Trading Dashboard application.

## Tables

### Users

The `users` table stores user authentication information.

| Column   | Type    | Description                 | Constraints      |
|----------|---------|-----------------------------|------------------|
| id       | serial  | Unique user identifier      | PRIMARY KEY      |
| username | text    | Username for login          | UNIQUE, NOT NULL |
| password | text    | Hashed password             | NOT NULL         |

### Orders

The `orders` table stores trade execution history.

| Column      | Type      | Description                       | Constraints                   |
|-------------|-----------|-----------------------------------|-------------------------------|
| id          | serial    | Unique order identifier           | PRIMARY KEY                   |
| userId      | integer   | Reference to the user             | FOREIGN KEY (users.id)        |
| instrument  | text      | Trading instrument/symbol         | NOT NULL                      |
| type        | text      | Order type (BUY, SELL)           | NOT NULL                      |
| price       | real      | Execution price                   | NOT NULL                      |
| quantity    | integer   | Number of units                   | NOT NULL                      |
| status      | text      | Order status                      | NOT NULL                      |
| trigger     | text      | What triggered the order          | NOT NULL                      |
| createdAt   | timestamp | When the order was created        | NOT NULL, DEFAULT now()       |

### Trading Rules

The `tradingRules` table stores user-defined trading parameters.

| Column      | Type      | Description                       | Constraints                   |
|-------------|-----------|-----------------------------------|-------------------------------|
| id          | serial    | Unique rule identifier            | PRIMARY KEY                   |
| userId      | integer   | Reference to the user             | FOREIGN KEY (users.id)        |
| targetPrice | real      | Price to buy at                   | NOT NULL                      |
| takeProfit  | real      | Price to sell for profit          | NOT NULL                      |
| stopLoss    | real      | Price to sell to cut losses       | NOT NULL                      |
| autoExecute | boolean   | Whether to execute automatically  | NOT NULL, DEFAULT true        |
| strategy    | text      | Strategy type                     | NOT NULL                      |
| isActive    | boolean   | Whether rule is active            | NOT NULL, DEFAULT true        |
| createdAt   | timestamp | When the rule was created         | NOT NULL, DEFAULT now()       |
| updatedAt   | timestamp | When the rule was last updated    | NOT NULL, DEFAULT now()       |

### Market Data

The `marketData` table stores snapshots of market data.

| Column    | Type      | Description                       | Constraints                   |
|-----------|-----------|-----------------------------------|-------------------------------|
| id        | serial    | Unique snapshot identifier        | PRIMARY KEY                   |
| symbol    | text      | Trading symbol                    | NOT NULL                      |
| data      | jsonb     | Full market data snapshot         | NOT NULL                      |
| timestamp | timestamp | When the snapshot was taken       | NOT NULL, DEFAULT now()       |

## Relationships

The database schema has the following relationships:

1. One-to-Many: User to Orders
   - A user can have multiple orders
   - Each order belongs to a single user

2. One-to-Many: User to Trading Rules
   - A user can have multiple trading rules
   - Each trading rule belongs to a single user

## Sample Queries

### Get all orders for a user

```sql
SELECT * FROM orders
WHERE userId = 1
ORDER BY createdAt DESC;
```

### Get active trading rules

```sql
SELECT * FROM tradingRules
WHERE isActive = true;
```

### Get latest market data for a symbol

```sql
SELECT * FROM marketData
WHERE symbol = 'NIFTY 50'
ORDER BY timestamp DESC
LIMIT 1;
```