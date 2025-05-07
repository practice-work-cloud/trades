# GitHub Setup Instructions

To export this project to GitHub and fork it to your personal account, follow these steps:

## 1. Download the Project

First, download the entire project from Replit by:
- Click on the "..." menu (three dots) at the top of the file tree
- Select "Download as ZIP"
- Extract the downloaded ZIP file to your local machine

## 2. Create a New GitHub Repository

- Go to https://github.com/new
- Name your repository (e.g., "trading-dashboard")
- Add a description (optional)
- Choose to make it public or private
- Do NOT initialize with a README, .gitignore, or license (we already have these files)
- Click "Create repository"

## 3. Initialize Git and Push to GitHub

Open a terminal/command prompt, navigate to your project directory and run:

```bash
# Initialize Git repository
git init

# Add all files to staging
git add .

# Commit the files
git commit -m "Initial commit"

# Add the GitHub repository as remote origin
git remote add origin https://github.com/yourusername/trading-dashboard.git

# Push to GitHub
git push -u origin main
```

If your default branch is called "master" instead of "main", use:

```bash
git push -u origin master
```

## 4. Fork the Repository (Optional)

If you've created the repository under an organization account and want to fork it to your personal account:

- Go to the repository page on GitHub
- Click the "Fork" button in the top-right corner
- Select your personal account as the destination for the fork

## 5. Clone Your Fork Locally

```bash
git clone https://github.com/yourusername/trading-dashboard.git
cd trading-dashboard
```

## 6. Install Dependencies and Run

```bash
npm install
npm run db:push  # Initialize the database
npm run dev      # Start the development server
```