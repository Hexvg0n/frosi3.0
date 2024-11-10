// ./pages/api/qcPhotos.js

import { convertUrlToPlatformAndID } from './convert';
import axios from 'axios';

export default async function handler(req, res) {
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

    // Pobierz wszystkie qcPhotos ze wszystkich elementów
    const allPhotosData = data.reduce((acc, item) => {
      if (item.qcPhotos && Array.isArray(item.qcPhotos)) {
        return acc.concat(item.qcPhotos);
      }
      return acc;
    }, []);

    if (allPhotosData.length === 0) {
      console.error("Nie znaleziono zdjęć w odpowiedzi API.");
      return res.status(404).json({ error: 'Nie znaleziono zdjęć dla tego produktu.' });
    }

    // Generowanie linków proxy dla zdjęć
    const photos = allPhotosData.map(photo => `${req.headers.origin}/api/proxy?url=${encodeURIComponent(photo.photoUrl)}`);
    console.log("Wygenerowane linki do zdjęć przez proxy:", photos);

    res.status(200).json({ photos });
  } catch (err) {
    console.error('Błąd podczas pobierania zdjęć z API finds.ly:', err.message);
    if (err.response) {
      console.error("Szczegóły błędu odpowiedzi:", err.response.status, err.response.data);
    }
    res.status(500).json({ error: 'Nie udało się pobrać zdjęć produktu.' });
  }
}
