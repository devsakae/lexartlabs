'use client'
import { useState, useRef } from 'react';

export default function Home() {
  const [log, setLog] = useState('Mensagem padrão');
  const messageRef = useRef();

  const handleMessage = (e) => {
    e.preventDefault();
    setLog(messageRef.current.value);
  }

  return (
    <main>
      Chatbot.
      { log }
      <form>
        <input
          type='text'
          placeholder='Digite sua mensagem'
          ref={ messageRef }
        />
        <button
          onClick={ handleMessage }
        >
          Enviar mensagem
        </button>
      </form>
    </main>
  )
}
