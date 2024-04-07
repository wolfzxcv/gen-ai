import info from '@/utils/extra-information';
import { openai } from '@/utils/openai';
import { ChatCompletionMessage, ChatCompletionRole } from 'openai/resources';

import type { NextApiRequest, NextApiResponse } from 'next';

export type IChatGPTMessage = {
  role: ChatCompletionRole;
  content: string | null;
};

const chatHistory: IChatGPTMessage[] = [...info];

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
        model: 'gpt-3.5-turbo',
        //@ts-ignore
        messages
      });

      const lastAnswer: ChatCompletionMessage = chat.choices[0].message;

      // update history
      chatHistory.push(lastQuestion);
      chatHistory.push(lastAnswer);

      res.json(chatHistory);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Please use only POST method');
  }
}
