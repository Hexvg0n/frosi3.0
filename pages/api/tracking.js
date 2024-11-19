// pages/api/tracking.js
import axios from "axios";
import * as cheerio from "cheerio";
import validator from 'validator';
import fs from 'fs/promises';
import path from 'path';

// Ścieżka do pliku cache tłumaczeń
const TRANSLATION_CACHE_PATH = path.join(process.cwd(), 'translations.json');

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

// Mapa normalizacji etykiet
const LABEL_NORMALIZATION = {
  "trackingNumber": ["trackingNumber", "Numer śledzenia", "跟踪号码", "رقم التتبع", "Tracking Number"],
  "referenceNo": ["reference No.", "Numer referencyjny", "参考编号", "رقم المرجع", "Reference Number"],
  "country": ["country", "Kraj", "国家", "البلد", "Country"],
  "date": ["date", "Data", "日期", "التاريخ", "Date"],
  "theLastRecord": ["the last record", "Ostatni status", "最后记录", "آخر سجل", "Last Record"],
  "consigneeName": ["consigneeName", "Odbiorca", "收货人姓名", "اسم المستلم", "Consignee Name"],
  // Dodaj więcej etykiet w zależności od potrzeb
};

// Funkcja do normalizacji etykiet
function normalizeLabel(label) {
  for (const [key, variants] of Object.entries(LABEL_NORMALIZATION)) {
    if (variants.includes(label)) {
      return key;
    }
  }
  return label; // Zwróć oryginalny label, jeśli nie znaleziono normalizacji
}

// Funkcja do wczytywania cache tłumaczeń
async function loadTranslationCache() {
  try {
    const data = await fs.readFile(TRANSLATION_CACHE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Plik nie istnieje, utwórz pusty cache
      await fs.writeFile(TRANSLATION_CACHE_PATH, JSON.stringify({}), 'utf-8');
      return {};
    } else {
      console.error('Błąd podczas wczytywania cache tłumaczeń:', error.message);
      return {};
    }
  }
}

// Funkcja do zapisywania cache tłumaczeń
async function saveTranslationCache(cache) {
  try {
    await fs.writeFile(TRANSLATION_CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error('Błąd podczas zapisywania cache tłumaczeń:', error.message);
  }
}

// Funkcja do tłumaczenia statusów z cache i API DeepL
async function translateStatus(status, cache) {
  if (cache[status]) {
    return cache[status];
  }

  const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

  if (!DEEPL_API_KEY) {
    console.error('DEEPL_API_KEY nie jest ustawiony.');
    return status; // Zwróć oryginalny status w przypadku braku klucza API
  }

  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', new URLSearchParams({
      auth_key: DEEPL_API_KEY,
      text: status,
      target_lang: 'PL'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const translated = response.data.translations[0].text;
    cache[status] = translated;
    await saveTranslationCache(cache);
    return translated;
  } catch (error) {
    console.error('Błąd tłumaczenia statusu:', error.response?.data || error.message);
    return status; // Zwróć oryginalny status w przypadku błędu
  }
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
    username: 'TrackingBot',
    avatar_url: 'https://yourdomain.com/path-to-avatar.png', // Opcjonalnie: zmień na własny URL avatar
    embeds: [
      {
        title: "Informacje główne",
        color: 0x00FF00,
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
        color: 0x0000FF,
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

  // Sprawdzenie czy documentCode jest dostarczony i jest alfanumeryczny
  if (!documentCode || !validator.isAlphanumeric(documentCode)) {
    return res.status(400).json({ error: "Invalid or missing documentCode" });
  }

  try {
    let trackingData = null;

    // Wczytaj cache tłumaczeń
    const translationCache = await loadTranslationCache();

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

          // Mapowanie etykiet na wartości z normalizacją
          const dataMap = {};
          labels.forEach((label, index) => {
            const normalizedLabel = normalizeLabel(label);
            dataMap[normalizedLabel] = values[index] || "";
          });

          // Logowanie dla diagnozy
          console.log('Parsed Labels:', labels);
          console.log('Parsed Values:', values);
          console.log('Data Map:', dataMap);

          // Sprawdzenie, czy numer śledzenia jest obecny
          const trackingNumber = dataMap["trackingNumber"];
          console.log(`Numer śledzenia znaleziony na ${url}: ${trackingNumber}`);

          if (trackingNumber && trackingNumber !== "") {
            // Tworzenie głównych informacji z polskimi kluczami
            const mainInfo = {
              "Numer referencyjny": dataMap["referenceNo"] || "N/A",
              "Numer śledzenia": dataMap["trackingNumber"] || "N/A",
              "Kraj": dataMap["country"] || "N/A",
              "Data": dataMap["date"] || "N/A",
              "Ostatni status": await translateStatus(dataMap["theLastRecord"] || "N/A", translationCache),
              "Odbiorca": dataMap["consigneeName"] || "N/A",
            };

            console.log(`Główne informacje znalezione na ${url}:`, mainInfo);

            // Wyciąganie szczegółów śledzenia z tabeli
            const traceDetails = [];
            $("table tr").each((_, row) => {
              const cells = $(row).find("td");
              if (cells.length === 3) {
                traceDetails.push({
                  "Data": $(cells[0]).text().trim(),
                  "Lokalizacja": $(cells[1]).text().trim(),
                  "Status": $(cells[2]).text().trim(),
                });
              }
            });

            console.log(`Szczegóły śledzenia znalezione na ${url}:`, traceDetails);

            // Tłumaczenie szczegółów śledzenia
            const translatedDetails = await Promise.all(traceDetails.map(async (detail) => ({
              "Data": detail.Data,
              "Lokalizacja": detail.Lokalizacja,
              "Status": await translateStatus(detail.Status, translationCache),
            })));

            trackingData = { 
              "Informacje główne": mainInfo, 
              "Szczegóły przesyłki": translatedDetails, 
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
