// Backend: pages/api/send-to-discord.js

export default async function handler(req, res) {
  // Sprawdzamy, czy metoda to POST
  if (req.method === 'POST') {
    const { title, imageUrl } = req.body;

    // Sprawdzamy klucz autentykacji w nagłówkach
    const secretKey = req.headers['authorization'];
    const expectedSecretKey = process.env.NEXT_PUBLIC_DISCORD_SECRET_KEY;

    // Logowanie nagłówka Authorization dla debugowania
    console.log('Authorization header:', secretKey);

    // Jeśli nagłówek Authorization jest pusty lub nie pasuje do oczekiwanego klucza, zwróć 403
    if (!secretKey || secretKey !== `Bearer ${expectedSecretKey}`) {
      console.log('Invalid or missing secret key');
      return res.status(403).json({ message: 'Brak dostępu - nieautoryzowany' });
    }

    const webhookUrl = 'https://discord.com/api/webhooks/1315293442603089960/MsYrITLkEF1dH5dSxIDiDV0fTPQrYhvQwqN90_BPMM2P8v0i04Idr4mlzDKlzxOhUTgt';

    try {
      // Pobieranie obrazu
      const imageBlob = await fetch(imageUrl).then((response) => response.blob());
      const formData = new FormData();
      formData.append('file', imageBlob, 'image.jpg');
      formData.append('content', title);

      // Wysyłanie do webhooka Discorda
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      // Sprawdzamy odpowiedź
      if (response.ok) {
        res.status(200).json({ message: 'Wysłano do Discorda' });
      } else {
        res.status(response.status).json({ message: 'Błąd wysyłania do Discorda' });
      }
    } catch (error) {
      console.error('Błąd:', error);
      res.status(500).json({ message: 'Błąd serwera' });
    }
  } else {
    res.status(405).json({ message: 'Metoda nie dozwolona' });
  }
}
