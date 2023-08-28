'use client'
import { useState, useEffect } from 'react';
type Log = {
  timestamp: Date,
  message: String,
}

const Chatbot = () => {
  const [disabledInput, setDisabledInput] = useState(false);
  const [log, setLog] = useState<Log[]>([{ timestamp: new Date(), message: '' }]);
  const [cache, setCache] = useState<string>('');

  useEffect(() => {
    const getFirstGreeting = async () => {
      await fetch('api/chat')
        .then((response) => console.log(response));
        // .then((response) => response.json())
        // .then((data) => data)
        // .catch((err) => console.error('ERRO:', err));
    };
    getFirstGreeting();
  }, [])

  // Regex greetings as instructions
  const greetingsRegex = /(^good)|(hello)|(i\swant)/ig;

  const checkAnswer = async (message: string) => {
    if (message.match(greetingsRegex)) {
      try {
        return 'Hello indeed'
      } catch (err) {
        return 'not a hello'
      }
    }

    switch (message) {
      case 'goodbye':
        setTimeout(() => setDisabledInput(true), 1000);
        return 'Goodbye!';
      default:
        return 'Sorry, I am not understanding. Do you want some help on infos I can reply to it?';
    }
  }

  const handleMessage = (e: any) => {
    e.preventDefault();
    setCache(e.target.value);
  }

  const sendMessage = async (e: any) => {
    const timestamp = new Date();
    e.preventDefault();
    const lastLog = {
      timestamp,
      message: cache
    };
    setLog(prev => [...prev, lastLog]);
    setCache('');
    const message = await checkAnswer(cache);
    setLog(prev => [...prev, { timestamp, message }]);
  }

  return (
    <section>
      {log.map((item, index) => <p key={index}>{item.message}</p>)}
      <form>
        <input
          type='text'
          placeholder='Digite sua mensagem'
          value={cache}
          onChange={handleMessage}
          disabled={disabledInput}
        />
        <button
          onClick={sendMessage}
        >
          Enviar mensagem
        </button>
      </form>
    </section>
  )
}

export default Chatbot