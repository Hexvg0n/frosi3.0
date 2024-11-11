// ./pages/api/proxy.js

import axios from "axios";
import { Agent } from "http";
import { Agent as HttpsAgent } from "https";

// Konfiguracja agentów HTTP i HTTPS z opcją keep-alive
const httpAgent = new Agent({ keepAlive: true });
const httpsAgent = new HttpsAgent({ keepAlive: true });

// Tworzenie instancji Axios z agentami i limitem czasowym
const axiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 10000, // 10 sekund
});

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    console.error("Brak wymaganego parametru URL w proxy.");
    return res.status(400).json({ error: "Brak wymaganego parametru URL." });
  }

  try {
    // Dekodowanie URL
    const decodedUrl = decodeURIComponent(url);
    console.log("Pobieranie obrazu przez proxy z URL:", decodedUrl);

    // Pobieranie obrazu jako strumień
    const response = await axiosInstance.get(decodedUrl, {
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        // Możesz dodać dodatkowe nagłówki, jeśli są potrzebne
      },
    });

    // Ustawienie nagłówków odpowiedzi
    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    // Strumieniowe przesyłanie danych do klienta
    response.data.pipe(res);

    // Obsługa błędów podczas strumieniowania
    response.data.on("error", (err) => {
      console.error("Błąd podczas strumieniowania obrazu:", err.message);
      res.status(500).json({ error: "Błąd podczas strumieniowania obrazu." });
    });
  } catch (error) {
    console.error("Błąd podczas pobierania obrazu przez proxy:", error.message);
    if (error.response) {
      console.error(
        "Szczegóły błędu odpowiedzi:",
        error.response.status,
        error.response.data
      );
    }
    res.status(500).json({ error: "Nie udało się pobrać obrazu." });
  }
}
