import { openai } from '@/utils/openai';
import { ChatCompletionMessage, ChatCompletionRole } from 'openai/resources';

import type { NextApiRequest, NextApiResponse } from 'next';

export type IChatGPTMessage = {
  role: ChatCompletionRole;
  content: string | null;
};

const chatHistory: IChatGPTMessage[] = [
  {
    role: 'system',
    content:
      'You are a kind chatbot, and like to describe things in a simple way, can explain everything to people not in relevant areas.\n I want to tell you some questions and answer from my university, the full name is University of Europe for Applied Sciences, also called UE for short, hope you can remember these information, and answer me afterward.'
  },
  {
    role: 'system',
    content:
      "What requirements do I have to meet in order to study for a Bachelor's degree? High school/ Bachelor's diploma and transcript* or equivalent occupational diploma officially translated to English or German. In certain cases, you may also be able to study without a high school diploma. In such cases, you will need to have a minimum of three years of professional experience and be enrolling in a programme relevant to that experience.\n Is there a numerous clausus (NC)? No. Can I apply before finishing my high school diploma or an equivalent degree? \n Yes, you can submit the certified copy of your high school diploma or an equivalent certificate at a later time.\n  Can I study at UE without a diploma? Yes, § 11 of the Berlin University regulations allows entry for subject-specific occupational experience. Please mention this in your application. How can I apply for the Bachelor's programme? First, fill out the application form on our website. Upload a certified copy and the certified translation in German or English of your high school diploma or an equivalent certificate. If you have already studied, please also submit a copy (if necessary a certified translation) of your transcript. For Art & Design degree programmes, a portfolio must also be submitted. You will find the relevant information on the respective degree programme page or in the next section \"admission requirements\". Admission requirements Please find https://www.ue-germany.com/admission-requirements all the requirements for studying at UE.  Here after is the information about our Master's study programmes. What requirements do I have to meet in order to study a master's degree at UE ? The basic admission requirement for the Bachelor's programme at UE is the higher education entrance qualification (Fach-) Hochschulreife) that you have achieved with the Abitur or Fachabitur and, if applicable, the submission of a portfolio (for Art & Design programmes). A completed and study-related (individual examination) apprenticeship with subsequent 2 years of professional experience can also enable you to study at UE. UE will check your requirements and inform you immediately after you have submitted your documents whether you can be admitted to the degree programme. How can I apply for the Master's study programme at UE? First, fill out the online application on our website. Upload a certified copy and the certified translation in German or English of your Bachelor, MBA, Diploma or an equivalent certificate as well as your transcript.For Art & Design degree programmes, a portfolio must also be submitted. You will find the relevant information on the respective degree programme page or in the next section \"admission requirements\". When do I choose 2, 3 or 4 semesters for a Master's degree? For the 60 ECTS version: Undergraduate degree (Bachelors) with at least 240 credit points according to European Credit Transfer and Accumulation System (ECTS). For the 90 ECTS version: Undergraduate degree with at least 210 credit points.For the 120 ECTS version: Undergraduate degree with at least 180 credit points. Here below is the general questions. When is the opening hours? Monday to Friday, 9 am–4 pm. Berlin campus address is: Dessauer Str. 3-5, 10963 Berlin. Potsdam campus address is: Think Campus, Konrad-Zuse-Ring 11, 14469 Potsdam"
  }
];

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
