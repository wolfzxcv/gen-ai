import info from '@/utils/extra-information';
import { openai } from '@/utils/openai';
import type OpenAI from 'openai';
type ChatCompletionMessage = OpenAI.Chat.Completions.ChatCompletionMessage;
type ChatCompletionRole = OpenAI.Chat.Completions.ChatCompletionRole;

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
        // Input text from Dialogflow
        content: req.body.queryResult.queryText
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

      const result = lastAnswer.content;

      const toPlatforms = {
        google: {
          expectUserResponse: true,
          richResponse: {
            items: [
              {
                simpleResponse: {
                  textToSpeech: result
                }
              }
            ]
          }
        },
        facebook: {
          attachment: {
            type: '',
            payload: {}
          }
        },
        slack: {
          text: '',
          attachments: []
        },
        telegram: {
          text: '',
          parse_mode: ''
        }
      };

      const output = {
        payload: toPlatforms,
        fulfillmentText: result,
        speech: result,
        displayText: result,
        source: ''
      };
      return res.json(output);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Failed to fetch response from OpenAI.' });
    }
  } else {
    console.log('Please use only POST method');
  }
}
