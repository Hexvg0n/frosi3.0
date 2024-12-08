// Frontend: Form.js (komponent React)

import { useState, useRef, useEffect } from 'react';

const Form = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageCount, setMessageCount] = useState(0);  // Licznik wiadomości
  const canvasRef = useRef(null);
  const MAX_CHARACTERS = 1150;
  const MAX_MESSAGES = 3;

  useEffect(() => {
    // Sprawdzenie liczby wysłanych wiadomości z ciasteczka przy załadowaniu komponentu
    const count = getMessageCountFromCookies();
    setMessageCount(count);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (messageCount >= MAX_MESSAGES) {
      alert('Osignąłeś maksymalną liczbę wysłanych wiadomości!');
      return;
    }

    setIsSubmitting(true);
    const imageUrl = await addTextToImage(content);
    const success = await sendToBackend(imageUrl);

    if (success) {
      setIsSubmitted(true);
      setTitle('');
      setContent('');
      // Zwiększ licznik wiadomości i zapisz w ciasteczkach
      const newMessageCount = messageCount + 1;
      setMessageCount(newMessageCount);
      setMessageCountToCookies(newMessageCount);
    }

    setIsSubmitting(false);
  };

  const addTextToImage = (content) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    return new Promise((resolve) => {
      const img = new Image();
      img.src = '/images/pusty_list.png';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = 'italic 24px "Dancing Script"';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
  
        const lines = wrapText(content, 68);
        let lineHeight = 40;
        let y = canvas.height / 2.3;
  
        lines.forEach((line) => {
          ctx.fillText(line, canvas.width / 2, y);
          y += lineHeight;
        });
  
        const imageUrl = canvas.toDataURL('image/jpeg');
        resolve(imageUrl);
      };
    });
  };

  const wrapText = (text, maxLineLength) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach((word) => {
      if (currentLine.length + word.length + 1 <= maxLineLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const sendToBackend = async (imageUrl) => {
    const response = await fetch('/api/send-to-discord', {  // Next.js API Route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DISCORD_SECRET_KEY}`, // Dodanie nagłówka Authorization
      },
      body: JSON.stringify({
        title: title,
        imageUrl: imageUrl,
      }),
    });
  
    if (response.ok) {
      return true;
    } else {
      console.error('Błąd podczas wysyłania do backendu');
      return false;
    }
  };
  

  const getMessageCountFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const countCookie = cookies.find((cookie) => cookie.startsWith('messageCount='));
    return countCookie ? parseInt(countCookie.split('=')[1], 10) : 0;
  };

  const setMessageCountToCookies = (count) => {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);  // Ciasteczko wygasa za rok
    document.cookie = `messageCount=${count}; expires=${expirationDate.toUTCString()}; path=/`;
  };

  return (
    <div className='my-44 relative'>
      {/* Obrazek Mikołaja */}
      <div className="absolute top-[-70px] md:left-[46%] left-1/2 transform -translate-x-1/2 z-30 md:top-[-115px]">
        <img 
          src="images/mikolaj.png" 
          alt="Święty Mikołaj" 
          className="w-[200px] md:w-[350px]" 
        />
      </div>
      {/* Formularz */}
      <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-auto relative z-20">
        <div>
          <label htmlFor="title" className="block text-xl font-semibold text-white font-[Dancing Script] italic text-center ">Nick na discordzie</label>
          <input
            type="text"
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 p-4 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting} 
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-xl font-semibold text-white font-[Dancing Script] italic text-center">Treść </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARACTERS) {
                setContent(e.target.value);
              }
            }}
            required
            className="mt-2 p-4 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
            disabled={isSubmitting} 
          />
          <div className="text-sm text-gray-400 mt-2">
            {content.length}/{MAX_CHARACTERS} znaków
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isSubmitting}
          >
            Wyślij
          </button>
        </div>
      </form>

      {/* Komunikat o wysłaniu */}
      {isSubmitted && (
        <div className="mt-6 text-center text-xl text-green-500">
          Twój list został pomyślnie wysłany! 🎅
        </div>
      )}

      {/* Ukryty canvas */}
      <canvas ref={canvasRef} width={1000} height={1414} style={{ display: 'none' }}>
        Your browser does not support the canvas element.
      </canvas>
    </div>
  );
};

export default Form;
