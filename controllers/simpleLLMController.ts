import { ChatOpenAI } from '@langchain/openai'
import { MCPAgent, MCPClient } from 'mcp-use'
import { Request, Response } from 'express'
import { OpenAI } from 'openai';
import 'dotenv/config'


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function talkWithLLM(req: Request, res: Response) {
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });
  
      const answer = chatResponse.choices[0]?.message?.content;
      res.json({ answer });
    } catch (error: any) {
      console.error('OpenAI Error:', error.message);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  }