import { ChatOpenAI } from '@langchain/openai'
import { MCPAgent, MCPClient } from 'mcp-use'
import { Request, Response } from 'express'
import 'dotenv/config'

const theQuery = `I want you to go to this website: https://mcp.so/server/MiniMax-MCP/MiniMax-AI?tab=tools , 
// scrape it and return me back the server configuration JSON, so I can properly set it up in cursor.`

export async function main(req: Request, res: Response) {
  // 1. Configure MCP servers
  try {
    const config = {
      mcpServers: {
        // tavily: { command: 'npx', args: ["-y",
        //     "tavily-mcp"], env: {TAVILY_API_KEY: process.env.TAVILY_API_KEY}},
        // airbnb: { command: 'npx', args: ['@openbnb/mcp-server-airbnb'] },
        // playwright: { command: 'npx', args: ['@playwright/mcp@0.0.28'] },
        firecrawl: { command: 'npx', args: ['-y', 'firecrawl-mcp'], 
          env : {
            "FIRECRAWL_API_KEY": "fc-43227f0a42f44c73be828036c27a26f3",
            "PATH": `${process.env.PATH}`
          }}
      }
    }
    const client = MCPClient.fromDict(config)
  
    // 2. Create LLM
    const llm = new ChatOpenAI({ modelName: 'gpt-4' })
  
    // 3. Instantiate agent
    const agent = new MCPAgent({ llm, client, maxSteps: 20 })
  
    // 4. Run query
    const result = await agent.run(theQuery)
    console.log('Result:', result)
    res.status(200).json(result)
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}

//main().catch(console.error)