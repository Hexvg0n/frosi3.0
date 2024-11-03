import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    console.error("Brak wymaganego parametru URL w proxy.");
    return res.status(400).json({ error: "Brak wymaganego parametru URL." });
  }

  try {
    // Dekoduj URL, aby upewnić się, że jest poprawnie przetworzony
    const decodedUrl = decodeURIComponent(url);
    console.log("Pobieranie obrazu przez proxy z URL:", decodedUrl);

    const response = await axios.get(decodedUrl, {
      responseType: "arraybuffer", // Pobieranie obrazu jako dane binarne
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        // Dodatkowe nagłówki mogą być potrzebne, aby ominąć zabezpieczenia Cloudflare
      },
    });

    // Przekazywanie nagłówków i danych obrazu do przeglądarki
    res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // CORP nagłówek

    res.send(response.data); // Wysyłanie danych obrazu
  } catch (error) {
    console.error("Błąd podczas pobierania obrazu przez proxy:", error.message);
    if (error.response) {
      console.error("Szczegóły błędu odpowiedzi:", error.response.status, error.response.data);
    }
    res.status(500).json({ error: "Nie udało się pobrać obrazu." });
  }
}
