// /pages/api/qcPhotos.js

import { convertUrlToPlatformAndID } from './convert';
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    console.error("Brak wymaganego parametru URL");
    return res.status(400).json({ error: 'Brak wymaganego parametru URL' });
  }

  // Pobierz platformę i itemID
  let { platform, itemID, error } = convertUrlToPlatformAndID(url);
  if (error) {
    console.error("Błąd konwersji URL:", error);
    return res.status(400).json({ error });
  }

  // Zmiana platformy "1688" na "ONE_SIX_EIGHT_EIGHT" dla zapytania do finds.ly
  if (platform === "1688") {
    platform = "ONE_SIX_EIGHT_EIGHT";
  }

  console.log("Platforma:", platform); // Logowanie
  console.log("Item ID:", itemID); // Logowanie

  try {
    // Pobieranie danych zdjęć z finds.ly
    const photosResponse = await axios.get(`https://api.finds.ly/products/${platform}/${itemID}/qcPhotos`);
    const data = photosResponse.data;

    if (!Array.isArray(data) || data.length === 0) {
      console.error("Nie znaleziono danych w odpowiedzi API.");
      return res.status(404).json({ error: 'Nie znaleziono zdjęć dla tego produktu.' });
    }

    // Przetwarzanie danych grup
    const groupsData = data.map(item => {
      // Zakładamy, że każdy `item` reprezentuje wariant i zawiera `qcPhotos`
      const variant = item.variant || "Default Variant";
      const photos = item.qcPhotos 
        ? item.qcPhotos.map(photo => `${req.headers.origin}/api/proxy?url=${encodeURIComponent(photo.photoUrl)}`)
        : [];
      return { variant, photos };
    });

    console.log("Wygenerowane grupy ze zdjęciami:", groupsData);

    res.status(200).json({ groups: groupsData });
  } catch (err) {
    console.error('Błąd podczas pobierania zdjęć z API finds.ly:', err.message);
    if (err.response) {
      console.error("Szczegóły błędu odpowiedzi:", err.response.status, err.response.data);
    }
    res.status(500).json({ error: 'Nie udało się pobrać zdjęć produktu.' });
  }
}
