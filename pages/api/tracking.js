// pages/api/tracking.js
import axios from "axios";
import * as cheerio from "cheerio";

// Lista URL-i do sprawdzenia, z najprawdopodobniejszym URL-em na początku
const TRACKING_URLS = [
  "http://106.55.5.75:8082/en/trackIndex.htm",
  "http://114.132.51.252:8082/en/trackIndex.htm",
  "http://47.112.107.11:8082/en/trackIndex.htm",
  "http://39.101.71.24:8082/en/trackIndex.htm",
  "http://120.78.2.65:8082/en/trackIndex.htm",
  "http://www.hsd-ex.com:8082/trackIndex.htm",
  "http://www.gdasgyl.com:8082/en/trackIndex.htm"
];

// Mapa tłumaczeń statusów z angielskiego na polski
const STATUS_TRANSLATIONS = {
  "In Transit": "W tranzycie",
  "Delivered": "Dostarczono",
  "Out for Delivery": "W drodze do dostawy",
  "Exception": "Wyjątek",
  "Info Received": "Odebrano informacje",
  "Shipment Processed": "Przesyłka przetworzona",
  "At Local Facility": "W lokalnym centrum",
  "Customs Clearance": "Odprawa celna",
  "Delayed": "Opóźniono",
  "Returned to Sender": "Zwrócono nadawcy",
  // Dodaj więcej statusów w zależności od potrzeb
};

// Funkcja do tłumaczenia statusów
function translateStatus(status) {
  return STATUS_TRANSLATIONS[status] || status; // Zwróć oryginalny status, jeśli brak tłumaczenia
}

// Funkcja do wysyłania powiadomienia do Discorda
async function sendDiscordNotification(documentCode, trackingData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('Webhook URL nie jest ustawiony.');
    return;
  }

  const discordPayload = {
    content: `Nowy numer śledzenia: **${documentCode}**`,
    username: 'TrackingBot', // Opcjonalnie: zmień nazwę bota
    avatar_url: 'https://yourdomain.com/path-to-avatar.png', // Opcjonalnie: dodaj avatar
    embeds: [
      {
        title: "Informacje główne",
        color: 0x00FF00, // Zielony kolor embeda
        fields: Object.entries(trackingData["Informacje główne"]).map(([name, value]) => ({
          name,
          value: value.toString(),
          inline: true
        })),
        footer: {
          text: `Źródło: ${trackingData["Źródło"]}`
        }
      },
      {
        title: "Szczegóły przesyłki",
        color: 0x0000FF, // Niebieski kolor embeda
        fields: trackingData["Szczegóły przesyłki"].map((detail, index) => ({
          name: `Aktualizacja ${index + 1}`,
          value: `**Data:** ${detail.Data}\n**Lokalizacja:** ${detail.Lokalizacja}\n**Status:** ${detail.Status}`,
          inline: false
        }))
      }
    ]
  };

  try {
    const response = await axios.post(webhookUrl, discordPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.status.toString().startsWith('2')) {
      console.error('Błąd przy wysyłaniu do Discorda:', response.statusText);
    }
  } catch (error) {
    console.error('Błąd przy wysyłaniu do Discorda:', error.message);
  }
}

export default async function handler(req, res) {
  // Obsługa tylko metod POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { documentCode } = req.body;

  // Sprawdzenie czy documentCode jest dostarczony
  if (!documentCode) {
    return res.status(400).json({ error: "documentCode is required" });
  }

  try {
    let trackingData = null;

    // Iteracja przez każdy URL sekwencyjnie
    for (const url of TRACKING_URLS) {
      console.log(`Sprawdzanie URL: ${url}`);
      try {
        // Wysyłanie żądania POST z documentCode
        const response = await axios.post(
          url,
          new URLSearchParams({ documentCode }),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            timeout: 5000 // Ustawienie limitu czasu na 5 sekund
          }
        );

        // Sprawdzenie czy odpowiedź zawiera HTML
        if (response.data && typeof response.data === "string") {
          const $ = cheerio.load(response.data);

          // Pobieranie etykiet (pierwszy <ul>)
          const labels = [];
          $("div.menu_ > ul").first().find("li").each((_, element) => {
            const label = $(element).text().trim();
            labels.push(label);
          });

          // Pobieranie wartości (drugi <ul>)
          const values = [];
          $("div.menu_ > ul").eq(1).find("li").each((_, element) => {
            const value = $(element).text().trim();
            values.push(value);
          });

          // Mapowanie etykiet na wartości
          const dataMap = {};
          labels.forEach((label, index) => {
            dataMap[label] = values[index] || "";
          });

          // Sprawdzenie, czy numer śledzenia jest obecny
          const trackingNumber = dataMap["trackingNumber"];
          console.log(`Numer śledzenia znaleziony na ${url}: ${trackingNumber}`);

          if (trackingNumber && trackingNumber !== "") {
            // Tworzenie głównych informacji z polskimi kluczami
            const mainInfo = {
              "Numer referencyjny": dataMap["reference No."] || "N/A",
              "Numer śledzenia": dataMap["trackingNumber"] || "N/A",
              "Kraj": dataMap["country"] || "N/A",
              "Data": dataMap["date"] || "N/A",
              "Ostatni status": translateStatus(dataMap["the last record"] || "N/A"),
              "Odbiorca": dataMap["consigneeName"] || "N/A",
            };

            console.log(`Główne informacje znalezione na ${url}:`, mainInfo);

            // Wyciąganie szczegółów śledzenia z tabeli
            const traceDetails = [];
            $("table tr").each((_, row) => {
              const cells = $(row).find("td");
              if (cells.length === 3) {
                const detail = {
                  "Data": $(cells[0]).text().trim(),
                  "Lokalizacja": $(cells[1]).text().trim(),
                  "Status": translateStatus($(cells[2]).text().trim()),
                };
                traceDetails.push(detail);
              }
            });

            console.log(`Szczegóły śledzenia znalezione na ${url}:`, traceDetails);

            trackingData = { 
              "Informacje główne": mainInfo, 
              "Szczegóły przesyłki": traceDetails, 
              "Źródło": url 
            };

            // Wysyłanie powiadomienia do Discorda
            await sendDiscordNotification(documentCode, trackingData);

            break; // Zakończ iterację po znalezieniu danych
          } else {
            console.log(`Nie znaleziono numeru śledzenia na ${url}. Przechodzenie do następnego URL.`);
          }
        } else {
          console.log(`Odpowiedź z ${url} nie zawiera danych w formacie HTML.`);
        }
      } catch (error) {
        console.warn(`Błąd podczas pobierania danych z ${url}:`, error.message);
      }
    }

    // Jeśli nie znaleziono danych śledzenia na żadnym z URL-i
    if (!trackingData) {
      return res.status(404).json({ error: "Tracking data not found on any server." });
    }

    // Zwrot znalezionych danych śledzenia
    res.status(200).json(trackingData);
  } catch (error) {
    // Logowanie nieoczekiwanych błędów
    console.error("Error fetching tracking data:", error.message);
    res.status(500).json({ error: "Failed to fetch tracking data" });
  }
}
