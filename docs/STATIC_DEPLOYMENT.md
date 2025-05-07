# Static Deployment Guide for Vercel

This guide explains how to deploy the static version of the Trading Dashboard to Vercel for demo purposes.

## Overview

The Trading Dashboard has been converted to a static version that can be deployed to Vercel without requiring a database or real WebSocket connections. All data is simulated client-side, making it perfect for demonstration purposes.

## Prerequisites

1. A [Vercel](https://vercel.com) account (sign up with GitHub for easier setup)
2. Git installed on your local machine
3. Node.js installed locally (version 16 or higher)

## Deployment Steps

### Option 1: Direct Deployment from GitHub

1. **Push your code to GitHub**:
   - Create a new repository on GitHub
   - Push the project code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/trading-dashboard.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Select your trading dashboard repository
   - Vercel will automatically detect the project as a Node.js application

3. **Configure the build settings**:
   - Framework Preset: Other
   - Build Command: `vite build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

4. **Important**: For static deployment, the build configuration in `vite.config.ts` should be modified to:
   ```typescript
   build: {
     outDir: path.resolve(import.meta.dirname, "client/dist"),
     emptyOutDir: true,
   },
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your static application
   - Once complete, you'll get a URL like `your-project.vercel.app`

### Option 2: Manual Deployment using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Prepare for deployment**:
   ```bash
   npm run build
   ```

3. **Deploy with Vercel CLI**:
   ```bash
   cd dist
   vercel
   ```

4. **Follow the prompts**:
   - Log in if required
   - Confirm project settings when prompted
   - Vercel will deploy your application

## Customizing the Deployment

### Environment Variables

For the static version, no environment variables are required as all data is simulated.

### Custom Domain

To use a custom domain:

1. Go to your project in the Vercel dashboard
2. Click "Settings" → "Domains"
3. Click "Add" and follow the instructions to add your domain

## Troubleshooting

- **Build Errors**: Ensure all dependencies are properly listed in `package.json`
- **Rendering Issues**: Check browser console for JavaScript errors
- **Static Data Issues**: All data is simulated in `client/src/data/staticData.ts`

## Limitations of the Static Version

- Data is simulated, not real-time from external sources
- Trading simulations are pre-programmed patterns
- No backend persistence for user settings or orders

## Updating the Deployment

When you make changes to your project:

1. Push changes to your GitHub repository
2. Vercel will automatically detect changes and rebuild your site
3. The deployment URL remains the same

## Technical Details

This static version has the following modifications:

1. Removed PostgreSQL database dependencies
2. Replaced WebSocket real-time connections with simulated data
3. Added static sample data for market prices, orders, and trading rules
4. Configured periodic updates to simulate real-time data changes

By using this approach, the application can be deployed without requiring any backend infrastructure while still demonstrating all the UI features and interactions.