import { ChatOpenAI } from '@langchain/openai'
import { MCPAgent, MCPClient } from 'mcp-use'
import 'dotenv/config'

export async function main() {
  // 1. Configure MCP servers
  try {
    const config = {
        mcpServers: {
          playwright: { command: 'npx', args: ['@playwright/mcp@latest'] }
        }
      }
      const client = MCPClient.fromDict(config)
    
      // 2. Create LLM
      const llm = new ChatOpenAI({ modelName: 'gpt-4o' })
    
      // 3. Instantiate agent
      const agent = new MCPAgent({ llm, client, maxSteps: 20 })
    
      // 4. Run query
      const result = await agent.run('Find the best restaurant in Tokyo using Google Search')
      console.log('Result:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

//main().catch(console.error)