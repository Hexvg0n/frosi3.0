// Backend: pages/api/send-to-discord.js

import LRU from 'lru-cache';

const rateLimit = new LRU({
  max: 100, // maksymalna liczba unikalnych kluczy (np. IP)
  ttl: 60 * 60 * 1000, // czas życia w ms (np. 1 godzina)
});

const verifyCaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await response.json();
  return data.success;
};

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (req.method === 'POST') {
    // Rate Limiting
    const current = rateLimit.get(ip) || 0;
    if (current >= 5) { // Limiting to 5 requests per hour
      return res.status(429).json({ message: 'Zbyt wiele żądań. Spróbuj ponownie później.' });
    }
    rateLimit.set(ip, current + 1);

    const { title, imageUrl, captchaToken } = req.body;

    // Weryfikacja tokenu CAPTCHA
    if (!captchaToken) {
      return res.status(400).json({ message: 'Brak tokenu CAPTCHA' });
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ message: 'Nieprawidłowy token CAPTCHA' });
    }

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

    const webhookUrl = 'https://discord.com/api/webhooks/1315292183133290558/Bf12MBPeptNHZxcwTqB77irjgjW12l0xFRbcD9hfhWua3dWiFvY99FJ9m4G5SWuedAbf';

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
