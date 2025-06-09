# MCP Checker

A Node.js API service that checks repository information using Express and TypeScript.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-checker
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /check
Checks a repository URL.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    // Repository check results
  }
}
```

## Tech Stack

- Express.js
- TypeScript
- Node.js
- body-parser
- simple-git 

Example to run:
curl -X POST http://localhost:3000/check \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/21st-dev/magic-mcp"}'