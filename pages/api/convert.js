// pages/api/convert.js

const platforms = {
  taobao: { 
    regex: /(?:https?:\/\/)?(?:\w+\.)?taobao\.com/, 
    urlPattern: "https://item.taobao.com/item.htm?id={{itemID}}" 
  },
  tmall: { 
    regex: /(?:https?:\/\/)?(?:www\.)?detail\.tmall\.com/, 
    urlPattern: "https://detail.tmall.com/item.htm?id={{itemID}}" 
  },
  "1688": { 
    regex: /(?:https?:\/\/)?(?:\w+\.)?1688\.com/, 
    urlPattern: "https://detail.1688.com/offer/{{itemID}}.html" 
  },
  weidian: { 
    regex: /(?:https?:\/\/)?(?:www\.)?weidian\.com/, 
    urlPattern: "https://weidian.com/item.html?itemID={{itemID}}" 
  },
  hoobuy: { 
    regex: /(?:https?:\/\/)?(?:www\.)?hoobuy\.com/, 
    urlPattern: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}", 
    itemIDPattern: [
      /product\/(\d+)\/(\d+)/,
      /product\/(\d+)-(\d+)/,
      /product\/platform\/(\d+)\/(\d+)/,
      /product\/(\d+)\/item\/(\d+)/
    ],
    requiresDecoding: false,
    platformMapping: { 
      '0': 'detail.1688.com', 
      '1': 'item.taobao.com', 
      '2': 'weidian.com' 
    },
    aliases: []
  },
};

// Definicje pośredników
const middlemen = {
  kakobuy: {
    template: "https://www.kakobuy.com/item/details?url={{encodedUrl}}&affcode=frosireps",
    aliases: ["allchinabuy"],
    platformMapping: { 
      taobao: "item.taobao.com", 
      "1688": "detail.1688.com", 
      weidian: "weidian.com", 
      tmall: "detail.tmall.com" 
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  superbuy: {
    template: "https://www.superbuy.com/en/page/buy/?url={{encodedUrl}}&partnercode=EEr5wI",
    aliases: ["allchinabuy"],
    platformMapping: { 
      taobao: "item.taobao.com", 
      "1688": "detail.1688.com", 
      weidian: "weidian.com", 
      tmall: "detail.tmall.com" 
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: true
  },
  cssbuy: {
    template: "https://cssbuy.com/item{{cssPlatform}}{{itemID}}.html",
    platformMapping: { 
      taobao: "-", 
      "1688": "-1688-", 
      weidian: "-micro-", 
      tmall: "-tmall-" 
    },
    itemIDPattern: [/id=(\d+)/, /\/offer\/(\d+)\.html/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  allchinabuy: {
    template: "https://www.allchinabuy.com/en/page/buy/?url={{encodedUrl}}?partnercode=wf5ZpA",
    platformMapping: { 
      taobao: "item.taobao.com", 
      "1688": "detail.1688.com", 
      weidian: "weidian.com", 
      tmall: "detail.tmall.com" 
    },
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
    platformMapping: { 
      taobao: "taobao", 
      "1688": "1688", 
      weidian: "weidian" 
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  cnfans: {
    template: "https://cnfans.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=234625",
    platformMapping: { 
      taobao: "taobao", 
      "1688": "ali_1688", 
      weidian: "weidian" 
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  joyabuy: {
    template: "https://joyabuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}",
    platformMapping: { 
      taobao: "taobao", 
      "1688": "ali_1688", 
      weidian: "weidian" 
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  mulebuy: {
    template: "https://mulebuy.com/product/?shop_type={{platformDomain}}&id={{itemID}}&ref=200216970",
    platformMapping: { 
      taobao: "taobao", 
      "1688": "ali_1688", 
      weidian: "weidian" 
    },
    itemIDPattern: [/id=(\d+)/, /itemID=(\d+)/],
    requiresDecoding: false
  },
  hoobuy: {
    template: "https://hoobuy.com/product/{{platformCode}}/{{itemID}}",
    aliases: [], // Dodaj ewentualne aliasy, jeśli istnieją
    platformMapping: { 
      '0': 'detail.1688.com', 
      '1': 'item.taobao.com', 
      '2': 'weidian.com' 
    },
    itemIDPattern: [/product\/(\d+)\/(\d+)/], // Captures platformCode and itemID
    requiresDecoding: false
  },
};

// Funkcje pomocnicze

function extractItemID(url, patterns, middlemanName) {
  console.log(`Extracting itemID from URL: ${url} for middleman: ${middlemanName}`);

  const decodedUrl = decodeURIComponent(url);

  for (const pattern of patterns) {
    const match = decodedUrl.match(pattern);
    if (match && match[1]) {
      if (middlemanName === 'hoobuy' && match.length >= 3) {
        console.log(`Matched hoobuy pattern: PlatformCode=${match[1]}, ItemID=${match[2]}`);
        return { platformCode: match[1], itemID: match[2] };
      } else {
        console.log(`Matched pattern: ItemID=${match[1]}`);
        return match[1];
      }
    }
  }
  console.log(`No matching pattern found for URL: ${url}`);
  return null;
}

function identifyPlatform(url) {
  for (const [name, platform] of Object.entries(platforms)) {
    if (platform.regex.test(url)) {
      return name;
    }
  }
  return null;
}

function decodeUrlIfNeeded(url, middleman) {
  if (middleman.requiresDecoding) {
    const decodedUrlPart = url.split("url=")[1];
    const decodedUrl = decodedUrlPart ? decodeURIComponent(decodedUrlPart) : url;
    return decodedUrl;
  }
  return url;
}

function convertUrlToMiddleman(url, targetMiddleman) {
  console.log(`Converting URL to middleman: ${url} using ${targetMiddleman}`);
  
  const platformName = identifyPlatform(url);
  if (!platformName) {
    console.log(`Platform not identified for URL: ${url}`);
    return null;
  }

  const middleman = middlemen[targetMiddleman];
  if (!middleman) {
    console.log(`Middleman not found: ${targetMiddleman}`);
    return null;
  }

  const itemIDResult = extractItemID(url, middleman.itemIDPattern, targetMiddleman);
  if (!itemIDResult) {
    console.log(`ItemID extraction failed for URL: ${url}`);
    return null;
  }

  let platformCode = null;
  let itemID = null;

  if (targetMiddleman === 'hoobuy') {
    platformCode = itemIDResult.platformCode;
    itemID = itemIDResult.itemID;
    console.log(`Hoobuy - PlatformCode: ${platformCode}, ItemID: ${itemID}`);
  } else {
    itemID = itemIDResult;
    console.log(`ItemID: ${itemID}`);
  }

  const platformDomain = middleman.platformMapping[platformName] || "";
  const encodedUrl = encodeURIComponent(url);

  let convertedUrl = middleman.template
    .replace("{{encodedUrl}}", encodedUrl)
    .replace("{{platformDomain}}", platformDomain)
    .replace("{{itemID}}", itemID)
    .replace("{{cssPlatform}}", platformDomain);

  if (targetMiddleman === 'hoobuy') {
    convertedUrl = middleman.template
      .replace("{{platformCode}}", platformCode)
      .replace("{{itemID}}", itemID);
  }

  console.log(`Converted URL for ${targetMiddleman}: ${convertedUrl}`);
  return convertedUrl;
}

function convertMiddlemanToOriginal(url) {
  for (const [middlemanName, middleman] of Object.entries(middlemen)) {
    const aliases = [middlemanName, ...(middleman.aliases || [])];
    
    if (aliases.some(alias => url.includes(alias))) {
      const processedUrl = decodeUrlIfNeeded(url, middleman);
      const itemIDResult = extractItemID(processedUrl, middleman.itemIDPattern, middlemanName);
      
      if (itemIDResult) {
        let platformName = null;
        let itemID = null;

        if (middlemanName === 'hoobuy') {
          const { platformCode, itemID: extractedItemID } = itemIDResult;
          platformName = Object.keys(platforms).find(
            key => platforms[key].regex.test(`https://${middleman.platformMapping[platformCode]}`)
          );
          itemID = extractedItemID;
          console.log(`Hoobuy - Original Platform: ${platformName}, ItemID: ${itemID}`);
        } else {
          itemID = itemIDResult;
          platformName = identifyPlatform(url);
          console.log(`Original Platform: ${platformName}, ItemID: ${itemID}`);
        }
        
        if (platformName && platforms[platformName]) {
          const originalUrl = platforms[platformName].urlPattern.replace("{{itemID}}", itemID);
          console.log(`Converted to original URL: ${originalUrl}`);
          return originalUrl;
        }
      }
    }
  }
  return null;
}

// Main API handler
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  let convertedUrls = {};
  const originalUrl = convertMiddlemanToOriginal(url);

  if (originalUrl) {
    convertedUrls['original'] = originalUrl;
    for (const middleman in middlemen) {
      const convertedUrl = convertUrlToMiddleman(originalUrl, middleman);
      if (convertedUrl) {
        convertedUrls[middleman] = convertedUrl;
      }
    }
  } else {
    for (const middleman in middlemen) {
      const convertedUrl = convertUrlToMiddleman(url, middleman);
      if (convertedUrl) {
        convertedUrls[middleman] = convertedUrl;
      }
    }
  }

  if (Object.keys(convertedUrls).length === 0) {
    return res.status(404).json({ error: 'No results found for the given link.' });
  }

  res.status(200).json(convertedUrls);
}

// Optional: Function to extract platform and ID if needed elsewhere
export function convertUrlToPlatformAndID(url) {
  const platformName = identifyPlatform(url);
  if (!platformName) return { error: 'Unknown platform' };

  const itemID = extractItemID(url, middlemen['kakobuy'].itemIDPattern, 'kakobuy');
  if (!itemID) return { error: 'Item ID not found' };

  return {
    platform: platformName.toUpperCase(),
    itemID
  };
}