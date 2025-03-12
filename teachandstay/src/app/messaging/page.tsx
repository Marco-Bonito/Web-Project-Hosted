'use client';

import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import styles from './Messaging.module.css';

interface Message {
  id: number;
  type: 'user' | 'other';
  content: string;
}

interface Chat {
  id: number;
  name: string;
  messages: Message[];
}

const MessagingPage: React.FC = () => {
  // Chat di esempio con messaggi contrassegnati in base al mittente
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Chat con Host A',
      messages: [
        { id: 1, type: 'other', content: 'Ciao, come posso aiutarti?' },
        { id: 2, type: 'user', content: 'Ho bisogno di informazioni sui corsi.' },
      ],
    },
    {
      id: 2,
      name: 'Chat con Teacher B',
      messages: [
        { id: 1, type: 'other', content: 'Salve, sono disponibile per una lezione.' },
      ],
    },
    {
      id: 3,
      name: 'Chat con Utente C',
      messages: [
        { id: 1, type: 'other', content: 'Ciao, come va?' },
        { id: 2, type: 'user', content: 'Tutto bene, grazie!' },
      ],
    },
    {
      id: 4,
      name: 'Chat con Host D',
      messages: [],
    },
  ]);

  // Chat corrente selezionata (inizialmente la prima)
  const [currentChatId, setCurrentChatId] = useState<number>(chats[0]?.id || 1);
  // Stato per il nuovo messaggio in input
  const [newMessage, setNewMessage] = useState<string>('');

  // Recupera la chat corrente
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  // Quando clicchi su un elemento della lista chat, aggiorna la chat corrente
  const handleChatClick = (id: number) => {
    setCurrentChatId(id);
  };

  // Aggiorna il valore dell'input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  // Quando viene premuto "Enter", aggiunge il messaggio
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newMessage.trim() !== '') {
      addMessage();
    }
  };

  // Funzione per aggiungere un nuovo messaggio alla chat corrente (sempre inviato dall'utente)
  const addMessage = () => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        const newMsg: Message = {
          id: chat.messages.length + 1,
          type: 'user',
          content: newMessage,
        };
        return { ...chat, messages: [...chat.messages, newMsg] };
      }
      return chat;
    });
    setChats(updatedChats);
    setNewMessage('');
  };

  return (
    <div className={styles.messagingContainer}>
      <div className={styles.chatList}>
        <h3>Elenco Chat</h3>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={currentChatId === chat.id ? styles.activeChat : ''}
              onClick={() => handleChatClick(chat.id)}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatWindow}>
        <div className={styles.messages}>
          {currentChat?.messages.map((message) => (
            <div
              key={message.id}
              className={
                message.type === 'user'
                  ? styles.userMessage
                  : styles.otherUserMessage
              }
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="Scrivi un messaggio..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={addMessage}>Invia</button>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
