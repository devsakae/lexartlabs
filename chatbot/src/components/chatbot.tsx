'use client';
import { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import BotMessage from './chatmsgFromBot';
import UserMessage from './chatmsgFromUser';
import OptionsBox from './optionBox';

// Type for the chatbot log
export type Log = {
  author?: string;
  screen?: OptionMenu[] | null;
  timestamp?: Date;
  message?: string;
};

export type OptionMenu = {
  id: string,
  title: string,
  url: string,
  info: string[],
}

export type UsernameFunction = {
  data: string;
  user: string;
};

export type Thread = 'blank' | 'info_user' | 'info_password' | 'start';

// Presettings
const greetingsRegex = /(^good)|(hello)|(i\swant)|(hey\b)|(hi\b)|(get\sstart\b)/gi;
const forbiddenUsernames = ['visitor', 'chatbot', 'help', 'loan'];
const chatbot = 'Chatbot';
const visitor = 'visitor'

const Chatbot = () => {
  const [user, setUser] = useState(visitor);
  const [disabledInput, setDisabledInput] = useState(false);
  const [log, setLog] = useState<Log[]>([]);
  const [loadedMessage, setLoadedMessage] = useState<string[]>([]);
  const [loanInfo, setLoanInfo] = useState<OptionMenu[]>([])
  const [cache, setCache] = useState<string>('');
  const [thread, setThread] = useState<Thread>('blank');
  const [connectToHuman, setConnectToHuman] = useState<boolean>(false);

  // Functions needed
  const changeUsernameVariable = (params: UsernameFunction) => params.data.replace('USERNAME_VARIABLE', params.user);
  
  const addMessage = (author: string, message: string) => {
    const mockLag = (author === chatbot) ? 630 : 0;
    const timestamp = new Date();
    setTimeout(() => setLog(prev => [...prev, { author: author, timestamp, message }]), mockLag);
  };

  // Should be on top. Consider on refactoring
  useEffect(() => {
    // localStorage inside useEffect because of Next.js v13 bug
    const checkLocal = localStorage.getItem('devsakaelexartlabs') || null;
    const localUser = checkLocal ? JSON.parse(checkLocal).name : 'visitor';
    setUser(localUser);

    // Preload messages
    const fetchData = async () => {
      await fetch('/api/chat')
        .then(response => response.json())
        .then(({ data }) => {
          const greetUser = changeUsernameVariable({ data: data.greetings, user: localUser });
          if (localUser !== 'visitor') {
            const welcomeBack = [greetUser, data.userLogged];
            welcomeBack.forEach(item => addMessage(chatbot, item));
            setTimeout(() => showOptions(), 700);
            return setThread('start');
          }
          return setLoadedMessage([greetUser, data.askForName]);
        })
        .catch(err => console.error(err));
    };
    fetchData();
    return () => localStorage.setItem('devsakaelexartlabs', '');
  }, []);

  const showOptions = async () => {
    const timestamp = new Date();
    await fetch('/api/chat/loan')
      .then(response => response.json())
      .then(({ data }) => {
        setLoanInfo(data);
        setTimeout(() => setLog(prev => [...prev, { screen: data, author: chatbot, timestamp }]), 650)
      })
      .catch(error => console.error(error));
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
            data.message.postGreeting.split('\n').map((newgreeting: string, index: number) => setTimeout(() => addMessage(chatbot, newgreeting), (index + 1) * 550));
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
        if (message.split(' ').length > 1 || forbiddenUsernames.includes(message)) {
          addMessage(chatbot, 'Sorry, your username should not contain any white spaces or invalid chars.');
          return addMessage(chatbot, 'Let\'s try again! Please, type your username:');
        };
        setUser(message);
        const chatbotUsername = JSON.stringify({ name: message });
        localStorage.setItem('devsakaelexartlabs', chatbotUsername);
        addMessage(chatbot, `Welcome, ${message.trim()}! Please, write your password (we won't save/check, it's just a test):`);
        setThread('info_password');
        break;
    }
  }

  const checkAnswer = async (message: string) => {
    // If message is empty, ignore
    if (message.trim() === '') return;

    // Is user typing password? Hide it!
    thread === 'info_password' ? addMessage(user, '***********') : addMessage(user, message);

    // Is user providing username?
    if (thread === 'info_user') return login('info_user', message);
    if (thread === 'info_password') return login('info_password', message);

    // Check for word 'loan'
    if (message.match(/loan\b/gi)) {
      addMessage(chatbot, 'Choose one of our options:')
      return setTimeout(() => showOptions(), 780)
    };

    if (connectToHuman) {
      setConnectToHuman(false);
      if (message.match(/\bno\b/ig) && connectToHuman) {
        addMessage(chatbot, 'You can ask for help by typing \'help\'. Meanwhile, check our most common options below:');
        return showOptions();
      }
      // Connect to a human logic goes here
      return addMessage(chatbot, 'Ok, we are connecting you to a human operator. Please hold...')
    }

    // Ending conversation
    if (message.match(/goodbye/gi)) {
      addMessage(chatbot, 'Ok, saving thread, please hold...')
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
      return addMessage(chatbot, 'Thank you! We saved this conversation for later!');
    };

    // User says hello
    if (message.match(greetingsRegex)) {
      if (thread === 'blank') {
        loadedMessage.map((message, index) => setTimeout(() => addMessage(chatbot, message as string), (index + 1) * 450));
        return setThread('info_user');
      }
      return addMessage(chatbot, 'Hello, how are you?');
    };

    // User asked for help
    if (message.match(/help/i)) {
      addMessage(chatbot, 'Sure, what do you need?');
      return showOptions();
    };

    // It's a question?
    if (message.endsWith('?'))

    // All other messages here
    addMessage(chatbot, "Sorry, I didn't understood what you just said.");
    addMessage(chatbot, "Do you want to chat with a human?");
    setConnectToHuman(true);
  };

  const handleAction = (id: string) => {
    const userAnswer = (id === 'LOAN_APPLY') ? 'I want apply for a loan.' : (id === 'LOAN_CONDITIONS') ? 'Tell me more about loan conditions' : 'I need help with webchat usage';
    addMessage(user, userAnswer);
    const loanDetails = loanInfo.filter(info => info?.id === id);
    loanDetails[0].info.forEach(item => addMessage(chatbot, item));
    addMessage(chatbot, `<a href=${loanDetails[0].url} target="blank">Click here to see more</a>`);
  }

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
    <section className='flex flex-col items-center justify-center w-full h-screen bg-stone-100'>
      <div
        id='chatarea'
        className='flex flex-col gap-y-2 justify-end bg-white w-full md:w-3/5 h-screen md:h-[420px] p-3 overflow-clip md:border-gray-400 md:border-2 md:rounded-lg md:shadow-xl'
        draggable
      >
        {log?.map((item, index) =>
          (item.screen && item?.screen.length > 1)
            ? (<OptionsBox options={item.screen} handleAction={handleAction} key={ index } />)
            : item.author === chatbot
              ? (<BotMessage message={item.message} key={index} />)
              : (<UserMessage message={item.message} key={index} />)
        )}
        <form className='flex flex-row w-full text-black border-t-2 border-black border-opacity-10'>
          <input
            type={thread === 'info_password' ? 'password' : 'text'}
            placeholder='Type your message and hit [enter] or click send'
            value={cache}
            onChange={handleMessage}
            disabled={disabledInput}
            className='w-full h-10 rounded-md px-3 text-black'
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
