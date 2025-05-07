# Deployment Guide

This document outlines the steps for deploying the Trading Dashboard application to various environments.

## Prerequisites

Before deployment, ensure you have:

1. Node.js v16 or higher installed
2. PostgreSQL database server
3. All environment variables set up as specified in `.env.example`

## Local Deployment

For local development and testing:

```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`.

## Production Deployment

### Option 1: Traditional Server

1. Clone the repository on your server:
   ```bash
   git clone https://github.com/yourusername/trading-dashboard.git
   cd trading-dashboard
   ```

2. Install dependencies in production mode:
   ```bash
   npm install --production
   ```

3. Create a production build:
   ```bash
   npm run build
   ```

4. Set environment variables:
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=your_postgres_connection_string
   # Set other necessary environment variables
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Option 2: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t trading-dashboard .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 \
     -e DATABASE_URL=your_postgres_connection_string \
     -e NODE_ENV=production \
     trading-dashboard
   ```

### Option 3: Heroku Deployment

1. Create a Heroku app:
   ```bash
   heroku create your-trading-dashboard
   ```

2. Add PostgreSQL add-on:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. Deploy the app:
   ```bash
   git push heroku main
   ```

4. Ensure at least one instance is running:
   ```bash
   heroku ps:scale web=1
   ```

## Database Migration for Production

For production deployment, it's recommended to generate and apply migrations rather than using `db:push` directly:

```bash
# Generate migrations based on your schema
npm run db:generate

# Apply migrations
npm run db:migrate
```

## Monitoring and Maintenance

After deployment, you should:

1. Set up application monitoring (e.g., New Relic, Datadog)
2. Configure regular database backups
3. Set up automated health checks
4. Monitor system resources (CPU, memory, disk usage)

## Troubleshooting

Common deployment issues:

1. **Database Connection Errors**:
   - Verify your DATABASE_URL is correct
   - Ensure database server is accessible from your application host
   - Check database user permissions

2. **Port Conflicts**:
   - The application runs on port 5000 by default
   - To use a different port, set the PORT environment variable

3. **WebSocket Connection Issues**:
   - Ensure your reverse proxy (if used) supports WebSocket protocol
   - Properly configure timeouts for WebSocket connections