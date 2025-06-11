# CVSkaparen - Swedish CV Generation App

A Swedish CV generation application with PDF text extraction, job description analysis, and AI-powered optimization.

## Features

- **PDF Text Extraction**: Upload PDF CVs and automatically extract text content
- **Manual Text Input**: Paste CV content directly with live character/word counting
- **Job Description Analysis**: 
  - Manual text input with feedback
  - Website URL extraction with AI-powered content parsing
- **Swedish Interface**: All text and feedback in Swedish
- **Clean Design**: Simplified, user-friendly interface

## Project info

**URL**: https://lovable.dev/projects/85f2912e-de60-49be-850f-f4977cb1d103

## Quick Start

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd crafted-resume-boost

# Install dependencies
npm install

# Create environment file (see Setup section below)
# Create a .env file and add your API key

# Start development server
npm run dev
```

## Setup Instructions

### 1. Environment Variables

The app has optional Google Gemini AI integration for enhanced job description extraction:

1. **Get a free Gemini API key (Optional):**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign up/login with Google account
   - Click "Create API Key" 
   - Copy the generated key

2. **Create your environment file (Optional):**
   - Create a new file called `.env` in the project root
   - Add this single line: `VITE_GEMINI_API_KEY=your_actual_api_key_here`
   - Replace `your_actual_api_key_here` with your real API key

3. **The app works without API Key:**
   - Basic web scraping still extracts content from job posting URLs
   - Manual text input works perfectly without any API key
   - AI enhancement is optional for better content filtering

⚠️ **Security Warning**: Never commit your .env file or share your API key publicly!

**Note**: The app uses Gemini 1.5 Flash (free tier) for AI features. If you encounter API errors, the app automatically falls back to basic extraction.

### 2. Development Setup

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd crafted-resume-boost

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Create environment file and add your Gemini API key
# Create .env file: echo 'VITE_GEMINI_API_KEY=your_actual_api_key_here' > .env
# (Replace your_actual_api_key_here with your real API key)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/85f2912e-de60-49be-850f-f4977cb1d103) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn-ui components
- **PDF Processing**: pdfjs-dist for client-side PDF text extraction
- **AI Integration**: Google Gemini API for intelligent content extraction
- **Web Scraping**: CORS proxy for website content extraction

## App Features

### CV Upload & Processing
- **PDF Upload**: Drag & drop or click to upload PDF files
- **Text Extraction**: Automatic PDF text extraction with character/word count
- **Manual Input**: Direct text paste with live feedback
- **File Management**: Remove uploaded files with X button

### Job Description Analysis
- **Manual Input**: Paste job descriptions with live character/word counting
- **Website Extraction**: Extract job descriptions from URLs
- **AI Enhancement**: Smart content filtering using Gemini AI
- **Review & Edit**: Preview extracted content before processing

### User Experience
- **Swedish Interface**: All text and feedback in Swedish
- **Real-time Feedback**: Toast notifications and live counters
- **Console Logging**: Debug information logged to browser console
- **Error Handling**: Clear error messages in Swedish

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/85f2912e-de60-49be-850f-f4977cb1d103) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
