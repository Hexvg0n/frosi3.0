//.pages/api/convert.js

const platforms = {
  taobao: { regex: /(?:https?:\/\/)?(?:\w+\.)?taobao\.com/, urlPattern: "https://item.taobao.com/item.htm?id={{itemID}}" },
  tmall: { regex: /(?:https?:\/\/)?(?:www\.)?detail\.tmall\.com/, urlPattern: "https://detail.tmall.com/item.htm?id={{itemID}}" },
  "1688": { regex: /(?:https?:\/\/)?(?:\w+\.)?1688\.com/, urlPattern: "https://detail.1688.com/offer/{{itemID}}.html" },
  weidian: { regex: /(?:https?:\/\/)?(?:www\.)?weidian\.com/, urlPattern: "https://weidian.com/item.html?itemID={{itemID}}" },
};


// Definicje pośredników
const middlemen = {
  kakobuy: {
    template: "https://www.kakobuy.com/item/details?url={{encodedUrl}}&affcode=frosireps",
    aliases: ["allchinabuy"],
    platformMapping: { taobao: "item.taobao.com", "1688": "detail.1688.com", weidian: "weidian.com", tmall: "detail.tmall.com" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  superbuy: {
    template: "https://www.superbuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=EEr5wI",
    aliases: ["allchinabuy"],
    platformMapping: { taobao: "item.taobao.com", "1688": "detail.1688.com", weidian: "weidian.com", tmall: "detail.tmall.com" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  cssbuy: {
    template: "https://cssbuy.com/item{{cssPlatform}}{{itemID}}.html",
    platformMapping: { taobao: "-", "1688": "-1688-", weidian: "-micro-", tmall: "-tmall-" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  allchinabuy: {
    template: "https://www.allchinabuy.com/en/page/buy/?url={{encodedUrl}}?partnercode=wf5ZpA",
    platformMapping: { taobao: "item.taobao.com", "1688": "detail.1688.com", weidian: "weidian.com", tmall: "detail.tmall.com" },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
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
      /id=(\d+)/                                           
    ],
    requiresDecoding: false
  },
  lovegobuy: {
    template: "https://www.lovegobuy.com/product?id={{itemID}}&shop_type={{platformDomain}}&invite_code=AF8PNG",
    platformMapping: { taobao: "taobao", "1688": "1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  cnfans: {
    template: "https://cnfans.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=234625",
    platformMapping: { taobao: "taobao", "1688": "ali_1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  joyabuy: {
    template: "https://joyabuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}",
    platformMapping: { taobao: "taobao", "1688": "ali_1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  mulebuy: {
    template: "https://mulebuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=200216970",
    platformMapping: { taobao: "taobao", "1688": "ali_1688", weidian: "weidian" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  hoobuy:{
    template: "https://hoobuy.com/product/{{platformDomain}}/{{itemID}}",
    platformMapping: { taobao: "1", "1688": "0", weidian: "2" },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  }
};



// Funkcje pomocnicze

function extractItemID(url, patterns) {
  console.log("Extracting itemID from URL:", url);

  // Dekoduj URL, aby wzorce mogły działać na pełnym linku
  const decodedUrl = decodeURIComponent(url);

  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match && match[1]) {
      console.log(`Znaleziono itemID: ${match[1]} dla wzorca: ${pattern}`);
      return match[1];
    }
  }
  console.log("Nie udało się znaleźć itemID dla URL:", url);
  return null;
}


function identifyPlatform(url) {
  console.log("Identifying platform for URL:", url);
  for (const [name, platform] of Object.entries(platforms)) {
    if (platform.regex.test(url)) {
      console.log(`Rozpoznano platformę: ${name}`);
      return name;
    }
  }
  console.log("Nie udało się rozpoznać platformy dla URL:", url);
  return null;
}

function decodeUrlIfNeeded(url, middleman) {
  if (middleman.requiresDecoding) {
    const decodedUrlPart = url.split("url=")[1];
    const decodedUrl = decodedUrlPart ? decodeURIComponent(decodedUrlPart) : url;
    console.log(`Dekodowany URL: ${decodedUrl}`);
    return decodedUrl;
  }
  console.log("Dekodowanie nie jest wymagane dla URL:", url);
  return url;
}

function convertUrlToMiddleman(url, targetMiddleman) {
  console.log(`Konwersja URL na link pośrednika dla: ${targetMiddleman}`);

  const platformName = identifyPlatform(url);
  if (!platformName) {
    console.log(`Platforma nieznana dla ${targetMiddleman}, konwersja anulowana.`);
    return null;
  }

  const middleman = middlemen[targetMiddleman];
  if (!middleman) {
    console.log(`Nieznany pośrednik: ${targetMiddleman}, konwersja anulowana.`);
    return null;
  }

  const itemID = extractItemID(url, middleman.itemIDPattern);
  if (!itemID) {
    console.log(`Nie udało się pobrać itemID dla ${targetMiddleman}, konwersja anulowana.`);
    return null;
  }

  const platformDomain = middleman.platformMapping[platformName] || "";
  const encodedUrl = encodeURIComponent(url);

  const convertedUrl = middleman.template
    .replace("{{encodedUrl}}", encodedUrl)
    .replace("{{platformDomain}}", platformDomain)
    .replace("{{itemID}}", itemID)
    .replace("{{cssPlatform}}", platformDomain);

  console.log(`Skonwertowany URL dla pośrednika ${targetMiddleman}: ${convertedUrl}`);
  return convertedUrl;
}

function convertMiddlemanToOriginal(url) {
  console.log("Attempting to convert middleman URL to original:", url);

  for (const [middlemanName, middleman] of Object.entries(middlemen)) {
    const aliases = [middlemanName, ...(middleman.aliases || [])];
    
    if (aliases.some(alias => url.includes(alias))) {
      console.log(`Found middleman match: ${middlemanName}`);

      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const itemID = extractItemID(processedUrl, middleman.itemIDPattern);
      
      if (itemID) {
        let platformName = null;
        
        for (const [platformKey, platformValue] of Object.entries(middleman.platformMapping)) {
          if (processedUrl.includes(platformValue)) {
            platformName = platformKey;
            break;
          }
        }
        
        if (platformName && platforms[platformName]) {
          const originalUrl = platforms[platformName].urlPattern.replace("{{itemID}}", itemID);
          console.log(`Converted to original URL: ${originalUrl}`);
          return originalUrl;
        } else {
          console.log("Platform name not found or not supported:", platformName);
        }
      } else {
        console.log("ItemID not found for middleman URL:", processedUrl);
      }
    }
  }

  console.log("No middleman match found. Returning null.");
  return null;
}

// Główna funkcja API
export default function handler(req, res) {
  const { url } = req.body;

  if (!url) {
    console.log("Niepoprawne dane wejściowe.");
    return res.status(400).json({ error: 'Niepoprawne dane wejściowe' });
  }

  let convertedUrls = {};
  const originalUrl = convertMiddlemanToOriginal(url);

  if (originalUrl) {
    convertedUrls['original'] = originalUrl;
    for (const middleman in middlemen) {
      console.log(`Przetwarzanie konwersji dla ${middleman}`);
      const convertedUrl = convertUrlToMiddleman(originalUrl, middleman);
      if (convertedUrl) {
        convertedUrls[middleman] = convertedUrl;
      } else {
        console.log(`Nie udało się wygenerować URL dla ${middleman}`);
      }
    }
  } else {
    console.log("Original URL could not be derived, processing as middleman URLs only.");
    for (const middleman in middlemen) {
      console.log(`Przetwarzanie konwersji dla ${middleman}`);
      const convertedUrl = convertUrlToMiddleman(url, middleman);
      if (convertedUrl) {
        convertedUrls[middleman] = convertedUrl;
      } else {
        console.log(`Nie udało się wygenerować URL dla ${middleman}`);
      }
    }
  }

  if (Object.keys(convertedUrls).length === 0) {
    console.log("Nie znaleziono wyników dla podanego linku.");
    return res.status(404).json({ error: 'Nie znaleziono wyników dla podanego linku.' });
  }

  console.log("Zwracanie przekształconych URL-ów:", convertedUrls);
  res.status(200).json(convertedUrls);
}
export function convertUrlToPlatformAndID(url) {
  const platformName = identifyPlatform(url);
  if (!platformName) return { error: 'Platforma nieznana' };

  const itemID = extractItemID(url, middlemen['kakobuy'].itemIDPattern);
  if (!itemID) return { error: 'Nie udało się znaleźć itemID' };

  return {
    platform: platformName.toUpperCase(),
    itemID
  };
}