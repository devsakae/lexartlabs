'use client';
import { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import BotMessage from './chatmsgFromBot';
import UserMessage from './chatmsgFromUser';

// Type for the chatbot log
type Log = {
  author?: string;
  screen?: boolean;
  timestamp?: Date;
  message?: string;
};

type Thread = 'blank' | 'info_user' | 'info_password' | 'start'

// Prepare to engage conversation
const greetingsRegex = /(^good)|(hello)|(i\swant)|(hey\b)|(hi\b)|(get\sstart\b)/gi;
const chatbot = 'Chatbot';
const checkLocal = localStorage.getItem('devsakaelexartlabs') || null;
const localUser = checkLocal ? JSON.parse(checkLocal).name : 'visitor';
const forbiddenWords = ['visitor', 'chatbot'];
const changeUsernameVariable = (data: string) => data.replace('USERNAME_VARIABLE', localUser);

const Chatbot = () => {
  const [user, setUser] = useState(localUser);
  const [disabledInput, setDisabledInput] = useState(false);
  const [log, setLog] = useState<Log[]>([]);
  const [loadedMessage, setLoadedMessage] = useState<string[]>([]);
  const [cache, setCache] = useState<string>('');
  const [thread, setThread] = useState<Thread>('blank');

  const addMessage = (author: string, message: string) => {
    const timestamp = new Date();
    setLog(prev => [...prev, { author: author, timestamp, message }]);
  };

  useEffect(() => {
    if (user !== 'visitor') {
      const handleUserThreads = async () => {
        await fetch('/api/chat')
        .then(response => response.json())
        .then(({ data: { userLogged } }) => {
          userLogged.map(({ message }: any) => addMessage(chatbot, changeUsernameVariable(message)))
          setThread('info_password');
        });
      }
      handleUserThreads();
    }
    const waitForHello = async () => {
      await fetch('/api/chat')
        .then((response) => response.json())
        .then(({ data }) => {
          const newGreet = changeUsernameVariable(data.greetings).split('\n');
          setLoadedMessage([...newGreet, data.askForName]);
        })
        .catch((error) => console.error(error));
    };
    waitForHello();
    return () => localStorage.setItem('devsakaelexartlabs', '');
  }, []);

  const showOptions = () => {
    const timestamp = new Date();
    setLog(prev => [...prev, { screen: true, author: chatbot, timestamp }])
  }

  const login = async (info: Thread, message: string) => {
    switch (info) {
      case 'info_password':
        if (message.split(' ').length > 1) {
          addMessage(chatbot, 'Sorry, your password can\'t have blank spaces.');
          return addMessage(chatbot, 'Let\'s try again! Please, type your password to proceed:');
        };
        await fetch('/api/login')
        .then(response => response.json())
        .then(data => {
          if (data.status !== 200) {
            console.error('Error connecting to database');
            addMessage(chatbot, 'Error connecting to database. Please, restart the process.');
            return setThread('blank');
          }
          addMessage(chatbot, '*** Welcome to our system! ***');
          const newPostGreeting = data.message.postGreeting.split('\n');
          addMessage(chatbot, newPostGreeting[0]);
          addMessage(chatbot, newPostGreeting[1]);
          return setThread('start');
        })
        // API would throw an error if user don't exists in db
        .catch(err => {
          console.error(err);
          addMessage(chatbot, 'Sorry, we didn\'t found your credentials in our database.');
          return setThread('blank');
        });
        break;    
      default:
        if (message.split(' ').length > 1 || forbiddenWords.includes(message)) {
          addMessage(chatbot, 'Sorry, your username is not allowed.');
          return addMessage(chatbot, 'Let\'s try again! Please, type your username:');
        };
        setUser(message);
        const chatbotUsername = JSON.stringify({ name: message });
        localStorage.setItem('devsakaelexartlabs', chatbotUsername);
        addMessage(chatbot, `Welcome, ${message.trim()}! Please, type in your password to proceed:`);
        setThread('info_password');
        break;
    }
  }

  const checkAnswer = async (message: string) => {
    if (message.trim() === '') return;

    thread === 'info_password' ? addMessage(user, '********') : addMessage(user, message);

    // Is user providing username?
    if (thread === 'info_user') return login('info_user', message);
    if (thread === 'info_password') return login('info_password', message);

    // Check if user wants talk about loan
    if (message.match(/loan/gi)) {
      return addMessage(chatbot, 'You want a loan')
    };

    // Ending conversation
    if (message.match(/goodbye/gi)) {
      console.log('Saying goodbye...')
      addMessage(user, message);
      const savedLog = JSON.stringify({ name: user, log: log });
      await fetch('/api/chat/save', { 
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: savedLog
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));

      setTimeout(() => setDisabledInput(true), 1000);
      return addMessage(
        chatbot,
        'Thank you! We saved this conversation for later!',
      );
    };

    // User says hello
    if (message.match(greetingsRegex)) {
      if (thread === 'blank') {
        loadedMessage.map(message => addMessage(chatbot, message as string));
        return setThread('info_user');
      }
      return addMessage(chatbot, 'Hello, how are you?');
    };

    // User asked for help
    if (message.match(/help/i)) {
      addMessage(chatbot, 'Sure, what do you need?');
      user === 'visitor' ? setThread('info_user') : setThread('info_password');
      return addMessage(chatbot, loadedMessage[2] as string);
    };

    addMessage(
      chatbot,
      "Sorry, I can't understand what you want 😔. If you need assistance, please write 'help'.",
    );
  };

  const handleMessage = (e: any) => {
    e.preventDefault();
    setCache(e.target.value);
  };

  const sendMessage = async (e: any) => {
    e.preventDefault();
    setCache('');
    checkAnswer(cache);
  };

  return (
    <section className='flex flex-col items-center justify-center w-full h-screen'>
      <div
        id='chatarea'
        className='flex flex-col gap-y-2 justify-end bg-red-100 w-full md:w-3/5 h-screen md:h-[420px] p-3 overflow-clip md:border-gray-400 md:border-2 md:rounded-lg md:shadow-xl'
      >
        {log?.map((item, index) =>
          item.screen
            ? (
              <p>I am a screen</p>
            )
            : item.author === chatbot
              ? <BotMessage message={item.message} key={index} />
              : <UserMessage message={item.message} key={index} />
        )}
        <form className='flex flex-row w-full'>
          <input
            type={thread === 'info_password' ? 'password' : 'text'}
            placeholder='Type your message and hit [enter] or click send'
            value={cache}
            onChange={handleMessage}
            disabled={disabledInput}
            className='w-full h-10 rounded-md px-3'
          />
          <button onClick={sendMessage} className='px-5'>
            <IoSend />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chatbot;
