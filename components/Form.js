import { useState, useRef } from 'react';

const Form = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // Stan do przechowywania informacji o wysłaniu
  const canvasRef = useRef(null); // Referencja do canvas
  const MAX_CHARACTERS = 1150; // Maksymalna liczba znaków

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await addTextToImage(content);
    const success = await sendToDiscord(imageUrl);
    
    if (success) {
      setIsSubmitted(true); // Ustawienie stanu na true, jeśli wysyłka zakończona powodzeniem
    }
  };

  // Funkcja, która dodaje tekst na obrazie w canvas
  const addTextToImage = (content) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    return new Promise((resolve) => {
      // Załaduj obrazek tła
      const img = new Image();
      img.src = '/images/pusty_list.png'; // Ścieżka do obrazka
      img.onload = () => {
        // Narysuj obrazek na canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        // Ustawienia dla tekstu (czarny tekst, większa czcionka)
        ctx.font = 'italic 24px "Dancing Script"';  // Większa czcionka
        ctx.fillStyle = 'black';  // Czarny kolor tekstu
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
  
        // Logika dzielenia treści na linie o maksymalnej długości 30 znaków
        const lines = wrapText(content, 68);  // 30 znaków na linię
        let lineHeight = 40;  // Zwiększony odstęp między linijkami
        let y = canvas.height / 2.3;  // Początek tekstu wyżej (1/4 wysokości)

        lines.forEach((line) => {
          ctx.fillText(line, canvas.width / 2, y);
          y += lineHeight;
        });
  
        // Konwertuj canvas na dane URL (obrazek w formacie base64)
        const imageUrl = canvas.toDataURL('image/jpeg');
        resolve(imageUrl);
      };
    });
  };

  // Funkcja dzieląca tekst na linie o maksymalnej długości
  const wrapText = (text, maxLineLength) => {
    const words = text.split(' ');  // Dzielimy tekst na słowa
    let lines = [];
    let currentLine = '';

    words.forEach((word) => {
      // Sprawdzamy, czy dodanie słowa przekroczy maksymalną długość linii
      if (currentLine.length + word.length + 1 <= maxLineLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);  // Zapisujemy aktualną linię
        currentLine = word;  // Zaczynamy nową linię od słowa
      }
    });

    if (currentLine) {
      lines.push(currentLine);  // Dodajemy ostatnią linię
    }

    return lines;
  };

  // Funkcja wysyłająca obrazek do webhooka Discorda
  const sendToDiscord = async (imageUrl) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1314887946561912922/voGc_4a54q6jLFYvECZ2X1ttLLv9tLDPZbb6ANrDv6zGqQH0X4NsCwUpLqsuH0gpgulh '; // Twój webhook URL

    // Przekształć dane obrazu w formacie base64 na Blob
    const imageBlob = await fetch(imageUrl).then((res) => res.blob());

    const formData = new FormData();
    formData.append('file', imageBlob, 'image.jpg');
    formData.append('content', title);

    // Wyślij zapytanie POST do webhooka Discorda
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      return true;  // Zwróć true, jeśli wysyłka zakończyła się powodzeniem
    } catch (error) {
      console.error('Błąd podczas wysyłania obrazu do Discorda:', error);
      return false;  // Zwróć false w przypadku błędu
    }
  };

  return (
    <div className='my-44 relative'>
      {/* Obrazek Mikołaja */}
      <div className="absolute md:top-[-115px] top-[-95px] left-1/2 transform -translate-x-1/2 z-40">
        <img src="images/mikolaj.png" alt="Święty Mikołaj" className="w-3/4 max-w-md h-auto" />
      </div>
      {/* Formularz */}
      <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-lg shadow-lg w-full max-w-lg mx-auto relative z-20">
        <div>
          <label htmlFor="title" className="block text-xl font-semibold text-white font-[Dancing Script] italic text-center">Nick na discordzie</label>
          <input
            type="text"
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 p-4 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          />
          <div className="text-sm text-gray-400 mt-2">
            {content.length}/{MAX_CHARACTERS} znaków
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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
