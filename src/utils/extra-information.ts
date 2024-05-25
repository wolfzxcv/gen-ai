import dataJson from '@/data/data.json';
import { IChatGPTMessage } from '@/pages/api/openai';

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
