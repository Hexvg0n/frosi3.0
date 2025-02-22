// pages/api/scraper.js

import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

// Konfiguracja Cache
const cache = new NodeCache({ stdTTL: 3600 }); // Cache na 1 godzinę

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Nieprawidłowy URL' });
  }

  try {
    // Sprawdzenie cache
    const cachedData = cache.get(url);
    if (cachedData) {
      console.log('Dane produktu pobrane z cache');
      return res.status(200).json(cachedData);
    }

    // Scrapowanie danych
    const productData = await scrapeKakobuyData(url);

    if (productData) {
      // Zapisz dane w cache
      cache.set(url, productData);
      return res.status(200).json(productData);
    } else {
      return res.status(404).json({ error: 'Nie udało się pobrać danych produktu.' });
    }

  } catch (error) {
    console.error('Błąd w API /api/scraper:', error.message);
    return res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
}

// Funkcja scrapująca dane z Kakobuy
async function scrapeKakobuyData(url) {
  try {
    const browser = await puppeteer.launch({
      headless: true, // Ustaw na true w produkcji
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Ustawienie realistycznego User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('span.item-title');

    const data = await page.content();
    console.log('Page Content Length:', data.length);

    if (!data) {
      console.error('Zawartość strony jest pusta.');
      await browser.close();
      throw new Error('Zawartość strony jest pusta.');
    }

    const $ = cheerio.load(data);
    console.log('Cheerio Loaded:', $ ? 'Yes' : 'No');

    // Wyciąganie danych za pomocą dostarczonych selektorów
    const productTitle = $('span.item-title').text().trim() || 'Title not found';
    const productPrice = $('span.sku-price').text().trim() || 'Price not found';
    const productImage = $('img[data-v-4b212a77]').attr('src') || 
      $('img[data-v-4b212a77]').attr('data-src') || 
      'Image URL not found';

    // Pobieranie dodatkowych szczegółów produktu
    const arrivalDays = $('div.past-item:contains("Average days of arrival") span').text().trim() || 'N/A';
    const weight = $('div.past-item:contains("Weight(g)") span').text().trim() || 'N/A';
    const volume = $('div.past-item:contains("Volume(cm³)") span').text().trim() || 'N/A';

    console.log('Scrapped Data:', { productTitle, productPrice, productImage, arrivalDays, weight, volume });

    await browser.close();

    const productData = { 
      productTitle, 
      productPrice, 
      productImage, 
      arrivalDays, 
      weight, 
      volume 
    };

    return productData;
  } catch (error) {
    console.error('Error fetching or scraping the product:', error);
    return null;
  }
}
