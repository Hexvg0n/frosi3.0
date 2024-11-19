// ./pages/api/proxy.js

import axios from "axios";
import { Agent } from "http";
import { Agent as HttpsAgent } from "https";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

const httpAgent = new Agent({ keepAlive: true });
const httpsAgent = new HttpsAgent({ keepAlive: true });

const axiosInstance = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 10000, // 10 sekund
});

const generateFileName = (imageUrl) => {
  const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
  return hash;
};

const getContentTypeFromExtension = (ext) => {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.bmp':
      return 'image/bmp';
    case '.svg':
      return 'image/svg+xml';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
};

const imagesDir = path.join(process.cwd(), 'public', 'images', 'qcPhotos');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    console.error("Brak wymaganego parametru URL w proxy.");
    return res.status(400).json({ error: "Brak wymaganego parametru URL." });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    console.log("Przetwarzanie obrazu przez proxy z URL:", decodedUrl);

    const baseFileName = generateFileName(decodedUrl);
    const webpFileName = `${baseFileName}.webp`;
    const webpFilePath = path.join(imagesDir, webpFileName);
    const urlObj = new URL(decodedUrl);
    const originalExtension = path.extname(urlObj.pathname) || '.jpg';
    const originalFileName = `${baseFileName}${originalExtension}`;
    const originalFilePath = path.join(imagesDir, originalFileName);

    // Sprawdź, czy WebP plik już istnieje
    if (fs.existsSync(webpFilePath)) {
      console.log(`Obraz WebP już istnieje: ${webpFilePath}`);
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      const readStream = fs.createReadStream(webpFilePath);
      readStream.pipe(res);
      readStream.on('error', (err) => {
        console.error("Błąd podczas czytania pliku WebP:", err.message);
        res.status(500).json({ error: "Błąd podczas serwowania obrazu." });
      });
      return;
    }

    // Sprawdź, czy oryginalny obraz istnieje
    if (fs.existsSync(originalFilePath)) {
      console.log(`Oryginalny obraz już istnieje: ${originalFilePath}`);
      const contentType = getContentTypeFromExtension(originalExtension);
      res.setHeader("Content-Type", contentType || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      const readStream = fs.createReadStream(originalFilePath);
      readStream.pipe(res);
      readStream.on('error', (err) => {
        console.error("Błąd podczas czytania oryginalnego pliku:", err.message);
        res.status(500).json({ error: "Błąd podczas serwowania obrazu." });
      });
      return;
    }

    // Pobierz obraz jako buffer
    const response = await axiosInstance.get(decodedUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      },
    });

    const imageBuffer = Buffer.from(response.data, 'binary');

    // Próba konwersji do WebP
    try {
      const webpBuffer = await sharp(imageBuffer)
        .webp({ quality: 80 })
        .toBuffer();

      fs.writeFileSync(webpFilePath, webpBuffer);
      console.log(`Obraz WebP zapisany: ${webpFilePath}`);

      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      const readStream = fs.createReadStream(webpFilePath);
      readStream.pipe(res);
      readStream.on('error', (err) => {
        console.error("Błąd podczas czytania pliku WebP:", err.message);
        res.status(500).json({ error: "Błąd podczas serwowania obrazu." });
      });
    } catch (conversionError) {
      console.error(`Błąd podczas konwertowania obrazu do WebP: ${decodedUrl}`, conversionError.message);

      fs.writeFileSync(originalFilePath, imageBuffer);
      console.log(`Oryginalny obraz zapisany: ${originalFilePath}`);

      const contentType = getContentTypeFromExtension(originalExtension);
      res.setHeader("Content-Type", contentType || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      const readStream = fs.createReadStream(originalFilePath);
      readStream.pipe(res);
      readStream.on('error', (err) => {
        console.error("Błąd podczas czytania oryginalnego pliku:", err.message);
        res.status(500).json({ error: "Błąd podczas serwowania obrazu." });
      });
    }
  } catch (error) {
    console.error("Błąd podczas przetwarzania obrazu przez proxy:", error.message);
    if (error.response) {
      console.error(
        "Szczegóły błędu odpowiedzi:",
        error.response.status,
        error.response.data
      );
    }
    res.status(500).json({ error: "Nie udało się przetworzyć obrazu." });
  }
}
