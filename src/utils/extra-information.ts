import dataJson from '@/data/data.json';
import { IChatGPTMessage } from '@/pages/api/openai';

const greeting: string =
  "Hey there! Don't hesitate to ask me anything about UE, the University of Europe for Applied Sciences. You can use any language you're comfortable with. I'm here to help!";

export const initGreeting: IChatGPTMessage = {
  role: 'assistant',
  content: greeting
};

const info: IChatGPTMessage[] = [
  {
    role: 'system',
    content: dataJson.infoData
  },
  {
    role: 'system',
    content: dataJson.filteredData
  }
];

export default info;
