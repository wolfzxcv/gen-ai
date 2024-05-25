'use client';
import { IChatGPTMessage } from '@/pages/api/openai';
import { initGreeting } from '@/utils/extra-information';
import { Box, Button, Flex, Stack, Textarea } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Home = () => {
  const [chatHistory, setChatHistory] = useState<IChatGPTMessage[]>([
    initGreeting
  ]);

  const [question, setQuestion] = useState<string>('');
  const [recognizing, setRecognizing] = useState<boolean>(false);
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (shouldSubmit && question) {
      handleSubmit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, question]);

  const handleSubmit = async () => {
    if (!question) {
      console.log('There is no question, please type something');
      return;
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/openai',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: question
        })
      }
    );

    const chatgptData = await res.json();

    // console.log(chatgptData);

    setChatHistory(chatgptData);

    setQuestion('');
  };

  const startRecognition = () => {
    const SpeechRecognition =
      //@ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Detect user's preferred language
      const userLanguage = navigator.language || 'en-US';
      recognition.lang = userLanguage;

      recognition.onstart = () => {
        setRecognizing(true);
      };

      recognition.onspeechend = () => {
        setRecognizing(false);
        recognition.stop();
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        // console.log('Transcript:', transcript);
        setShouldSubmit(true); // Trigger submission after setting question
      };

      recognition.onerror = (event) => {
        setRecognizing(false);
        console.error('Error occurred in speech recognition:', event.error);
      };

      recognition.start();
    } else {
      alert('Speech Recognition API is not supported in this browser.');
    }
  };

  return (
    <Flex flexDir="column">
      <Box
        width="100%"
        textAlign="center"
        color={'teal'}
        my={3}
        fontWeight={700}
      >
        ChatGPT Based Customer Service
      </Box>
      <Flex mx={{ base: 1, md: 10 }} flexDir={{ base: 'column', md: 'row' }}>
        <Textarea
          rows={2}
          width={{ base: '100%', md: '80%' }}
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Flex>
          <Button
            colorScheme="teal"
            variant={{ base: 'solid', md: 'outline' }}
            height={{ base: '35px', md: 'inherit' }}
            ml={{ base: 0, md: 3 }}
            width={{ base: '100%', md: 'auto' }}
            onClick={() => {
              setShouldSubmit(true), handleSubmit;
            }}
          >
            Submit
          </Button>
          <Button
            colorScheme="teal"
            variant="outline"
            height="inherit"
            ml={{ base: 1, md: 3 }}
            display={{ base: 'none', md: 'block' }}
            onClick={startRecognition}
            isDisabled={recognizing}
          >
            {recognizing ? 'Listening...' : 'Speak'}
          </Button>
        </Flex>
      </Flex>

      <Flex flexDir="column" mx={3} mt={5}>
        <Stack>
          {chatHistory
            .filter((each) => each.role === 'user' || each.role === 'assistant')
            .map((each) => (
              <Flex key={each.content} flexDir="column" pb={1}>
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
