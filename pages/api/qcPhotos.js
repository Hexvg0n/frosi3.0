// pages/api/qcPhotos.js
import axios from 'axios';

// Konfiguracja bezpieczeństwa
const ALLOWED_ORIGINS = [
  'https://frosireps.eu',
  'https://www.frosireps.eu',
  'http://localhost:3000'
];

const API_SECRET = process.env.API_SECRET;
const API_TIMEOUT = 10000;
const FALLBACK_ERROR_MESSAGE = 'System error, please try again later';

// Nagłówki bezpieczeństwa
const securityHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
});

// Walidacja struktury odpowiedzi
const validateApiResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid API structure' };
  }

  if (data.status === 'error') {
    return {
      valid: false,
      error: data.message || FALLBACK_ERROR_MESSAGE,
      isApiError: true
    };
  }

  if (!data.data || !Array.isArray(data.data)) {
    return { valid: false, error: 'Invalid data format' };
  }

  return { valid: true };
};

// Przetwarzanie zdjęć
const processPhotos = (apiData) => {
  try {
    const groupedPhotos = apiData.data.reduce((acc, item) => {
      try {
        const imageUrl = item?.image_url?.trim();
        if (!imageUrl?.startsWith('http')) return acc;

        const qcDate = item?.qc_date?.split(' ')[0] || 'no-date';
        const batch = item?.batch ? `Batch: ${item.batch} | ` : '';
        const variant = `${batch}QC ${qcDate}`;

        acc[qcDate] = acc[qcDate] || {
          variant,
          photos: [],
          timestamp: new Date(qcDate).getTime() || Date.now()
        };

        acc[qcDate].photos.push(imageUrl);
        return acc;
      } catch (error) {
        console.error('Item processing error:', error);
        return acc;
      }
    }, {});

    return Object.values(groupedPhotos)
      .filter(group => group.photos?.length > 0)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Processing error:', error);
    return [];
  }
};

// Główny handler API
export default async function handler(req, res) {
  // Obsługa CORS dla preflight
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
      Object.entries(securityHeaders(origin)).forEach(([key, value]) => {
        res.setHeader(key, value);
      });
    }
    return res.status(204).end();
  }

  // Weryfikacja żądania
  const origin = req.headers.origin;
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Sprawdzenie Origin
  if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`Blocked request from invalid origin: ${origin} (IP: ${clientIP})`);
    return res.status(403).json({
      status: 'error',
      code: 'origin_blocked',
      message: 'Access denied'
    });
  }

  // Sprawdzenie klucza API
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_SECRET) {
    console.warn(`Invalid API key attempt from: ${origin} (IP: ${clientIP})`);
    return res.status(401).json({
      status: 'error',
      code: 'invalid_key',
      message: 'Unauthorized'
    });
  }

  // Ustawienie nagłówków bezpieczeństwa
  Object.entries(securityHeaders(origin)).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Obsługa metod HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      code: 'invalid_method',
      message: 'Method not allowed'
    });
  }

  // Walidacja parametrów
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({
      status: 'error',
      code: 'missing_url',
      message: 'URL parameter required'
    });
  }

  try {
    // Wywołanie zewnętrznego API
    const apiUrl = `https://open.kakobuy.com/open/pic/qcImage`;
    
    const response = await axios.get(apiUrl, {
      timeout: API_TIMEOUT,
      validateStatus: (status) => status < 500
    });

    // Walidacja odpowiedzi
    const validation = validateApiResponse(response.data);
    if (!validation.valid) {
      console.error('API validation failed:', {
        url,
        status: response.status,
        validationError: validation.error
      });
      
      return res.status(400).json({
        status: 'error',
        code: 'invalid_response',
        message: validation.error
      });
    }

    // Przetwarzanie danych
    const groupsData = processPhotos(response.data);
    
    if (!groupsData.length) {
      return res.status(404).json({
        status: 'error',
        code: 'no_data',
        message: 'No QC photos found'
      });
    }

    // Sukces
    return res.status(200).json({
      status: 'success',
      data: {
        count: groupsData.length,
        groups: groupsData
      },
      meta: {
        source: 'kakobuy',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    // Obsługa błędów
    console.error('API error:', {
      url,
      error: error.message,
      stack: error.stack
    });

    const statusCode = axios.isAxiosError(error) 
      ? error.response?.status || 503 
      : 500;

    return res.status(statusCode).json({
      status: 'error',
      code: 'server_error',
      message: FALLBACK_ERROR_MESSAGE
    });
  }
}