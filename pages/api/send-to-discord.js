// Backend: pages/api/send-to-discord.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, imageUrl } = req.body;

    const webhookUrl = 'https://discord.com/api/webhooks/1314985848810246337/YeZrfBMmv8IXyJ96N9AozaVpBSbaO3fwsd3WC4YXx_ca2sG4F18k6FCaFkAhFopCxUsa';

    try {
      const imageBlob = await fetch(imageUrl).then((response) => response.blob());
      const formData = new FormData();
      formData.append('file', imageBlob, 'image.jpg');
      formData.append('content', title);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

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
