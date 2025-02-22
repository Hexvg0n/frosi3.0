// pages/api/convert.js

// Definicje platform
const platforms = {
  taobao: { 
    regex: /(?:https?:\/\/)?(?:\w+\.)?taobao\.com/, 
    urlPattern: "https://item.taobao.com/item.htm?id={{itemID}}",
    itemIDPattern: [/id=(\d+)/]
  },
  tmall: { 
    regex: /(?:https?:\/\/)?(?:www\.)?detail\.tmall\.com/, 
    urlPattern: "https://detail.tmall.com/item.htm?id={{itemID}}",
    itemIDPattern: [/id=(\d+)/]
  },
  "1688": { 
    regex: /(?:https?:\/\/)?(?:\w+\.)?1688\.com/, 
    urlPattern: "https://detail.1688.com/offer/{{itemID}}.html",
    itemIDPattern: [/\/offer\/(\d+)\.html/]
  },
  weidian: { 
    regex: /(?:https?:\/\/)?(?:www\.)?weidian\.com/, 
    urlPattern: "https://weidian.com/item.html?itemID={{itemID}}",
    itemIDPattern: [/itemID=(\d+)/, /itemI[dD]=(\d+)/]
  },
};

// Definicje pośredników
const middlemen = {
  kakobuy: {
    template: "https://www.kakobuy.com/item/details?url={{encodedUrl}}&affcode=frosireps",
    aliases: ["allchinabuy"],
    platformMapping: { taobao: "item.taobao.com", "1688": "detail.1688.com", weidian: "weidian.com", tmall: "detail.tmall.com" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: true
  },
  superbuy: {
    template: "https://www.superbuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=EEr5wI",
    aliases: ["allchinabuy"],
    platformMapping: { taobao: "item.taobao.com", "1688": "detail.1688.com", weidian: "weidian.com", tmall: "detail.tmall.com" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: true
  },
  cssbuy: {
    template: "https://cssbuy.com/item{{cssPlatform}}{{itemID}}.html",
    platformMapping: { 
      taobao: "-taobao-", 
      "1688": "-1688-", 
      weidian: "-micro-", 
      tmall: "-tmall-" 
    },
    itemIDPattern: [
      /id=(\d+)/, 
      /\/offer\/(\d+)\.html/, 
      /itemID=(\d+)/,
      /item-(taobao|1688|micro|tmall)-(\d+)\.html$/,
      /itemI[dD]=(\d+)/ // Dodano
    ],
    requiresDecoding: false
  },
  allchinabuy: {
    template: "https://www.allchinabuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=wf5ZpA",
    platformMapping: { taobao: "item.taobao.com", "1688": "detail.1688.com", weidian: "weidian.com", tmall: "detail.tmall.com" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: true
  },
  basetao: {
    template: "https://www.basetao.com/best-taobao-agent-service/products/agent/{{platformDomain}}/{{itemID}}.html",
    platformMapping: { 
      taobao: "taobao", 
      tmall: "tmall", 
      "1688": "1688", 
      weidian: "weidian" 
    },
    itemIDPattern: [
      /agent\/(?:taobao|tmall|1688|weidian)\/(\d+)\.html/,  
      /itemID=(\d+)/,                                      
      /id=(\d+)/,                                           
      /itemI[dD]=(\d+)/ // Dodano
    ],
    requiresDecoding: false
  },
  lovegobuy: {
    template: "https://www.lovegobuy.com/product?id={{itemID}}&shop_type={{platformDomain}}&invite_code=AF8PNG",
    platformMapping: { taobao: "taobao", "1688": "1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: false
  },
  cnfans: {
    template: "https://cnfans.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=234625",
    platformMapping: { taobao: "taobao", "1688": "ali_1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: false
  },
  joyabuy: {
    template: "https://joyabuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}",
    platformMapping: { taobao: "taobao", "1688": "ali_1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: false
  },
  mulebuy: {
    template: "https://mulebuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=200216970",
    platformMapping: { taobao: "taobao", "1688": "ali_1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: false
  },
  hoobuy: {
    template: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}&inviteCode=GQX1dBRO",
    aliases: [], // Dodaj ewentualne aliasy, jeśli istnieją
    platformMapping: { 
      '0': 'detail.1688.com', 
      '1': 'item.taobao.com', 
      '2': 'weidian.com' 
    },
    itemIDPattern: [/product\/(\d+)\/(\d+)/, /itemI[dD]=(\d+)/], // Dodano
    requiresDecoding: false
  },
};

// Mapowanie platformName na platformCode dla hoobuy
const platformNameToCode = {
  '1688': '0',
  'taobao': '1',
  'weidian': '2',
  'tmall': '3', // Dodaj inne platformy w razie potrzeby
};

// Mapowanie platformCode na platformName dla hoobuy
const codeToPlatformName = {
  '0': '1688',
  '1': 'taobao',
  '2': 'weidian',
  '3': 'tmall', // Dodaj inne platformy w razie potrzeby
};

// Funkcje pomocnicze

function extractItemID(url, patterns) {
  const decodedUrl = decodeURIComponent(url);  // Dekodowanie URL, aby wzorce mogły działać na pełnym linku
  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match && match[1]) {
      // Obsługujemy przypadek, gdy wzorzec zwraca platformCode i itemID
      if (match.length > 2) {
        return { platformCode: match[1], itemID: match[2] };
      }
      return { itemID: match[1] };
    }
  }
  return null;
}

function identifyPlatform(url) {
  for (const [name, platform] of Object.entries(platforms)) {
    if (platform.regex.test(url)) return name;
  }
  return null;
}

function decodeUrlIfNeeded(url, middleman) {
  if (middleman.requiresDecoding) {
    try {
      const urlObj = new URL(url);
      const urlParam = urlObj.searchParams.get('url');
      return urlParam ? decodeURIComponent(urlParam) : url;
    } catch (error) {
      console.error('Nieprawidłowy URL podczas dekodowania:', error.message);
      return url;
    }
  }
  return url;
}

function convertUrlToMiddleman(url, targetMiddleman) {
  console.log(`Konwersja URL na link pośrednika dla: ${targetMiddleman}`);

  const middleman = middlemen[targetMiddleman];
  if (!middleman) {
    console.log(`Nieznany pośrednik: ${targetMiddleman}, konwersja anulowana.`);
    return null;
  }

  // Specjalna logika dla hoobuy
  if (targetMiddleman === 'hoobuy') {
    const platformName = identifyPlatform(url);
    if (!platformName) {
      console.log(`Platforma nieznana dla ${targetMiddleman}, konwersja anulowana.`);
      return null;
    }

    const extracted = extractItemID(url, platforms[platformName].itemIDPattern);
    if (!extracted || !extracted.itemID) {
      console.log(`Nie udało się pobrać itemID dla ${targetMiddleman}, konwersja anulowana.`);
      return null;
    }

    // Mapowanie platformName na platformCode
    const platformCode = platformNameToCode[platformName]; // Używamy platformNameToCode, aby uzyskać platformCode
    if (!platformCode) {
      console.log(`Nie można znaleźć platformCode dla platformy: ${platformName}`);
      return null;
    }

    const convertedUrl = middleman.template
      .replace("{{platformCode}}", platformCode)
      .replace("{{itemID}}", extracted.itemID);

    console.log(`Skonwertowany URL dla pośrednika ${targetMiddleman}: ${convertedUrl}`);
    return convertedUrl;
  }

  // Dla innych middlemen
  const processedUrl = decodeUrlIfNeeded(url, middleman);
  const platformName = identifyPlatform(processedUrl);
  if (!platformName) {
    console.log(`Platforma nieznana dla ${targetMiddleman}, konwersja anulowana.`);
    return null;
  }

  const extracted = extractItemID(processedUrl, middleman.itemIDPattern);
  if (!extracted || !extracted.itemID) {
    console.log(`Nie udało się pobrać itemID dla ${targetMiddleman}, konwersja anulowana.`);
    return null;
  }

  let platformDomain = middleman.platformMapping[platformName] || "";
  let itemID = extracted.itemID;
  let convertedUrl = middleman.template;

  if (middleman.requiresDecoding) {
    const encodedUrl = encodeURIComponent(url);
    convertedUrl = convertedUrl
      .replace("{{encodedUrl}}", encodedUrl)
      .replace("{{platformDomain}}", platformDomain)
      .replace("{{itemID}}", itemID)
      .replace("{{cssPlatform}}", platformDomain);
  } else {
    convertedUrl = convertedUrl
      .replace("{{platformDomain}}", platformDomain)
      .replace("{{cssPlatform}}", platformDomain)
      .replace("{{itemID}}", itemID);
  }

  console.log(`Skonwertowany URL dla pośrednika ${targetMiddleman}: ${convertedUrl}`);
  return convertedUrl;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda niedozwolona' });
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Nieprawidłowy URL' });
  }

  try {
    let convertedUrls = {};
    const originalUrl = convertMiddlemanToOriginal(url);

    if (originalUrl) {
      convertedUrls['original'] = originalUrl;
    } else {
      // Jeśli nie udało się przekształcić z middleman, użyj oryginalnego URL
      convertedUrls['original'] = url;
    }

    // Przetwarzanie URL dla innych pośredników
    for (const middleman in middlemen) {
      const convertedUrl = convertUrlToMiddleman(originalUrl || url, middleman);
      if (convertedUrl) {
        convertedUrls[middleman] = convertedUrl;
      }
    }

    if (Object.keys(convertedUrls).length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono wyników dla podanego linku.' });
    }

    res.status(200).json(convertedUrls);

  } catch (error) {
    console.error('Błąd w API /api/convert:', error.message);
    return res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
}

function convertMiddlemanToOriginal(url) {
  for (const [middlemanName, middleman] of Object.entries(middlemen)) {
    const aliases = [middlemanName, ...(middleman.aliases || [])];

    if (aliases.some(alias => url.includes(alias))) {
      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const extracted = extractItemID(processedUrl, middleman.itemIDPattern);

      if (extracted) {
        let platformName = null;
        let itemID = "";

        // Specjalna logika dla hoobuy
        if (middlemanName === 'hoobuy') {
          if (extracted.platformCode && extracted.itemID) {
            platformName = codeToPlatformName[extracted.platformCode];
            itemID = extracted.itemID;
          }
        } else if (middlemanName === 'cssbuy') {
          const cssPlatformMatch = processedUrl.match(/item-(taobao|1688|micro|tmall)-(\d+)\.html$/);
          if (cssPlatformMatch) {
            platformName = {
              taobao: 'taobao',
              '1688': '1688',
              micro: 'weidian',
              tmall: 'tmall'
            }[cssPlatformMatch[1]];
            itemID = cssPlatformMatch[2];
          }
        } else {
          // Standardowa logika dla innych middlemen
          for (const [platformKey, platformValue] of Object.entries(middleman.platformMapping)) {
            if (processedUrl.includes(platformValue)) {
              platformName = platformKey;
              break;
            }
          }
          itemID = extracted.itemID;
        }

        if (platformName && platforms[platformName]) {
          return platforms[platformName].urlPattern.replace("{{itemID}}", itemID);
        }
      }
    }
  }
  return null;
}
export function convertUrlToPlatformAndID(url) {
  const platformName = identifyPlatform(url);
  if (!platformName) return { error: 'Platforma nieznana' };

  const extracted = extractItemID(url, middlemen['kakobuy'].itemIDPattern);
  if (!extracted || !extracted.itemID) return { error: 'Nie udało się znaleźć itemID' };

  return {
    platform: platformName.toUpperCase(),
    itemID: extracted.itemID
  };
}