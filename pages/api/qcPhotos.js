// pages/api/qcPhotos.js
import axios from 'axios';

// Konfiguracja
const API_TIMEOUT = 10000; // 10 sekund
const FALLBACK_ERROR_MESSAGE = 'System error, please try again later';

const validateApiResponse = (data) => {
  // Sprawdzamy podstawową strukturę odpowiedzi
  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      error: 'Invalid API response structure'
    };
  }

  // Obsługa błędów z API Kakobuy
  if (data.status === 'error') {
    return {
      valid: false,
      error: data.message || FALLBACK_ERROR_MESSAGE,
      isApiError: true
    };
  }

  // Sprawdzamy poprawną strukturę danych
  if (!data.data || !Array.isArray(data.data)) {
    return {
      valid: false,
      error: 'Missing or invalid data array in response'
    };
  }

  return { valid: true };
};

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
        console.error('Error processing item:', error);
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      code: 'method_not_allowed',
      message: 'Only POST requests are allowed'
    });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({
      status: 'error',
      code: 'missing_url',
      message: 'Missing URL parameter'
    });
  }

  try {
    const apiUrl = `https://open.kakobuy.com/open/pic/qcImage?goodsUrl=${encodeURIComponent(url)}&token=aa38e63a04c292faba780abef3db2cee`;
    
    const response = await axios.get(apiUrl, {
      timeout: API_TIMEOUT,
      validateStatus: (status) => status < 500
    });

    const validation = validateApiResponse(response.data);
    
    if (!validation.valid) {
      console.error('API Validation Failed:', {
        url,
        status: response.status,
        data: response.data,
        validation
      });

      return res.status(validation.isApiError ? 400 : 502).json({
        status: 'error',
        code: validation.isApiError ? 'external_api_error' : 'invalid_response',
        message: validation.error || 'Invalid response from external API',
        externalResponse: validation.isApiError ? response.data : undefined
      });
    }

    const groupsData = processPhotos(response.data);
    
    if (!groupsData.length) {
      return res.status(404).json({
        status: 'error',
        code: 'no_photos_found',
        message: 'No valid QC photos found',
        debug: {
          originalUrl: url,
          receivedItems: response.data.data?.length || 0
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        count: groupsData.length,
        groups: groupsData
      },
      meta: {
        source: 'kakobuy',
        requestedUrl: url,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('API Error:', {
      url,
      error: error.response?.data || error.message,
      stack: error.stack
    });

    let statusCode = 500;
    let errorCode = 'internal_error';
    let message = FALLBACK_ERROR_MESSAGE;

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 503;
      errorCode = error.code || 'network_error';
      message = error.response?.data?.message || error.message;
    }

    return res.status(statusCode).json({
      status: 'error',
      code: errorCode,
      message: message,
      details: axios.isAxiosError(error) ? {
        responseStatus: error.response?.status,
        responseData: error.response?.data
      } : undefined
    });
  }
}