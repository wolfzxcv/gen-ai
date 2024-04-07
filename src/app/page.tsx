'use client';
import { IChatGPTMessage } from '@/pages/api/openai';
import { Box, Button, Flex, Stack, Textarea } from '@chakra-ui/react';
import { useState } from 'react';

const Home = () => {
  const [chatHistory, setChatHistory] = useState<IChatGPTMessage[]>([]);

  const [question, setQuestion] = useState<string>('');

  const handleSubmit = async () => {
    if (!question) {
      console.log('type something');
      return;
    }

    const res = await fetch('http://localhost:3000/api/openai', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: question
      })
    });

    const chatgptData = await res.json();

    console.log(chatgptData);

    setChatHistory(chatgptData);

    setQuestion('');
  };

  return (
    <Flex flexDir="column">
      <Box width="100%" textAlign="center" my={3} fontWeight={700}>
        ChatGPT Based Customer Service
      </Box>
      <Flex>
        <Textarea
          ml={10}
          rows={2}
          width="80%"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Button
          colorScheme="teal"
          variant="outline"
          height="inherit"
          ml={3}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Flex>

      <Flex flexDir="column" mx={3} mt={5}>
        <Stack>
          {chatHistory
            .filter((each) => each.role === 'user' || each.role === 'assistant')
            .map((each) => (
              <Flex key={each.content} flexDir="column">
                <Box
                  color={each.role === 'user' ? 'red' : 'blue'}
                  fontWeight={700}
                >
                  {each.role === 'user' ? 'You' : 'ChatGPT'}
                </Box>

                <Box fontSize="16px">{each.content}</Box>
              </Flex>
            ))}
        </Stack>
      </Flex>
    </Flex>
  );
};

export default Home;
