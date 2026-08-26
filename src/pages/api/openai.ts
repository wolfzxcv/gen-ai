import info, { initGreeting } from '@/utils/extra-information';
import { openai } from '@/utils/openai';
import type OpenAI from 'openai';
type ChatCompletionMessage = OpenAI.Chat.Completions.ChatCompletionMessage;
type ChatCompletionRole = OpenAI.Chat.Completions.ChatCompletionRole;

import type { NextApiRequest, NextApiResponse } from 'next';

export type IChatGPTMessage = {
  role: ChatCompletionRole;
  content: string | null;
};

const chatHistory: IChatGPTMessage[] = [initGreeting, ...info];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const lastQuestion: IChatGPTMessage = {
        role: 'user',
        content: req.body.content
      };

      const messages = [...chatHistory, lastQuestion];

      const chat = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        //@ts-expect-error -- messages type mismatch between IChatGPTMessage and openai SDK types
        messages
      });

      const lastAnswer: ChatCompletionMessage = chat.choices[0].message;

      // update history
      chatHistory.push(lastQuestion);
      chatHistory.push(lastAnswer);

      res.json(chatHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch response from OpenAI.' });
    }
  } else {
    console.log('Please use only POST method');
  }
}
