# Real-Time Trading Dashboard

A real-time trading dashboard application that integrates with Upstox WebSocket API, visualizes market data, and automates trade execution based on user-defined rules.

## Features

- Real-time market data visualization via WebSocket connection
- Interactive price chart with historical data
- Automated trading based on user-defined rules
- Target price, take profit, and stop loss configuration
- Order history tracking with PostgreSQL persistence
- Multiple simulation scenarios for demonstration purposes

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI with Tailwind CSS
- **Charting**: Recharts for data visualization
- **Backend**: Express.js server
- **Database**: PostgreSQL for persistent storage
- **API Integration**: WebSocket for real-time market data

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/trading-dashboard.git
   cd trading-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/trading_dashboard
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5000`

## Usage

### Dashboard

The main dashboard displays the current market data and price chart for Nifty 50. You can monitor the real-time price movements and see key statistics like open, high, low, and close prices.

### Automated Trading

Configure your trading rules by setting:
- Target price: The price at which to buy
- Take profit: The price at which to sell for profit
- Stop loss: The price at which to sell to minimize losses

Enable auto-trading to automatically execute trades based on your defined rules.

### Demo Mode

Use the "Run Demo" button to simulate various trading scenarios and see how the system would perform under different market conditions.

## Project Structure

- `client/`: Frontend React application
- `server/`: Backend Express API
- `shared/`: Shared types and schemas
- `drizzle/`: Database migrations and schema

## License

MIT

## Acknowledgments

- Built with [Shadcn UI](https://ui.shadcn.com/) components
- Real-time charting with [Recharts](https://recharts.org/)
- Database ORM with [Drizzle ORM](https://orm.drizzle.team/)