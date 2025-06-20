import { ChatOpenAI } from '@langchain/openai'
import { MCPAgent, MCPClient } from 'mcp-use'
import { Request, Response } from 'express'
import 'dotenv/config'

export async function main(req: Request, res: Response) {
  // 1. Configure MCP servers
  try {
    const config = {
      mcpServers: {
        tavily: { command: 'npx', args: ["-y",
            "tavily-mcp"], env: {TAVILY_API_KEY: process.env.TAVILY_API_KEY}},
        airbnb: { command: 'npx', args: ['@openbnb/mcp-server-airbnb'] },
        playwright: { command: 'npx', args: ['@playwright/mcp@0.0.28'] }
      }
    }
    const client = MCPClient.fromDict(config)
  
    // 2. Create LLM
    const llm = new ChatOpenAI({ modelName: 'gpt-4' })
  
    // 3. Instantiate agent
    const agent = new MCPAgent({ llm, client, maxSteps: 20 })
  
    // 4. Run query
    const result = await agent.run('Give me airbnb options in Peniche, Portugal, then give me the cheapest one..')
    console.log('Result:', result)
    res.status(200).json(result)
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}

//main().catch(console.error)