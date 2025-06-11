import { ChatOpenAI } from '@langchain/openai'
import { MCPAgent, MCPClient } from 'mcp-use'
import { Request, Response } from 'express'
import 'dotenv/config'

export async function getMCPData(req: Request, res: Response) {
    try {
        const result = await fetch('https://router.mcp.so/mcp/oegudgmbqnbj6j')
        const data = await result.json()
        console.log(data)
        res.status(200).json(data)

    } catch (error: any) {
        console.error('Error:', error)
        res.status(500).json({ error: error.message })
    }
}