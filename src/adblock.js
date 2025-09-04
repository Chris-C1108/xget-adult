/**
 * 广告屏蔽模块
 * 用于识别和过滤Missav平台的广告内容
 */

// 广告域名黑名单
const AD_DOMAINS = [
  'trackwilltrk.com',
  'r.trackwilltrk.com',
  'rmhfrtnd.com',
  'go.rmhfrtnd.com',
  'twinrdengine.com',
  'ad.twinrdengine.com',
  'diffusedpassionquaking.com',
  'tsyndicate.com',
  'cdn.tsyndicate.com',
  'pxl-eu.tsyndicate.com',
  'sunnycloudstone.com',
  'myavlive.com',
  'go.myavlive.com',
  'googletagmanager.com',
  'google-analytics.com',
  'www.google-analytics.com',
  'google.com/recaptcha',
  'bit.ly',
  // 添加跳转相关域名
  'missav.live',
  '123av.org', 
  'thisav2.com',
  'missav.ws',
  'missav01.com',
  'm.this.av',
  'missav888.com',
  'njavtv.com',
  'missav123.com',
  'kiddew.com',
  'mqav.com',
  'missav789.com'
];

// 广告URL模式
const AD_URL_PATTERNS = [
  /trackwilltrk\.com/i,
  /rmhfrtnd\.com/i,
  /twinrdengine\.com/i,
  /diffusedpassionquaking\.com/i,
  /tsyndicate\.com/i,
  /sunnycloudstone\.com/i,
  /myavlive\.com/i,
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /google\.com\/recaptcha/i,
  /bit\.ly/i,
  /adraw\?zone=/i,
  /smartpop\//i,
  /direct\//i,
  /\/g\/collect\?v=2&tid=/i,
  /outstream\.video/i,
  /\/api\/v1\/p\/p\.gif/i,
  /\/sdk\/v1\//i
];

// 广告相关的HTML元素选择器
const AD_SELECTORS = [
  'iframe[src*="trackwilltrk.com"]',
  'iframe[src*="rmhfrtnd.com"]',
  'iframe[src*="twinrdengine.com"]',
  'iframe[src*="diffusedpassionquaking.com"]',
  'iframe[src*="tsyndicate.com"]',
  'iframe[src*="sunnycloudstone.com"]',
  'iframe[src*="myavlive.com"]',
  'iframe[data-link*="trackwilltrk.com"]',
  'script[src*="googletagmanager.com"]',
  'script[src*="google-analytics.com"]',
  'script[src*="tsyndicate.com"]',
  'script[src*="sunnycloudstone.com"]',
  'script[src*="outstream.video"]',
  'script[src*="google.com/recaptcha"]',
  'link[href*="tsyndicate.com"]',
  'img[src*="pxl-eu.tsyndicate.com"]',
  'a[href*="bit.ly"]',
  'a[rel*="sponsored"]'
];

/**
 * 检查URL是否为广告
 * @param {string} url - 要检查的URL
 * @returns {boolean} 如果是广告URL返回true
 */
export function isAdUrl(url) {
  if (!url) return false;
  
  // 检查域名黑名单
  for (const domain of AD_DOMAINS) {
    if (url.includes(domain)) {
      return true;
    }
  }
  
  // 检查URL模式
  for (const pattern of AD_URL_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 过滤HTML内容中的广告
 * @param {string} html - 原始HTML内容
 * @returns {string} 过滤后的HTML内容
 */
export function filterAds(html) {
  if (!html) return html;
  
  let filteredHtml = html;
  
  // 移除外部广告脚本（通过src属性识别）
  filteredHtml = filteredHtml.replace(
    /<script[^>]*src="[^"]*(?:googletagmanager\.com|google-analytics\.com|tsyndicate\.com|sunnycloudstone\.com|trackwilltrk\.com|rmhfrtnd\.com|twinrdengine\.com|outstream\.video)[^"]*"[^>]*><\/script>/gi,
    ''
  );
  
  // 移除广告相关的CSS文件
  filteredHtml = filteredHtml.replace(
    /<link[^>]*href="[^"]*(?:tsyndicate\.com|sunnycloudstone\.com)[^"]*"[^>]*>/gi,
    ''
  );
  
  // 移除Google Analytics iframe
  filteredHtml = filteredHtml.replace(
    /<noscript><iframe[^>]*googletagmanager\.com[^>]*>[\s\S]*?<\/iframe><\/noscript>/gi,
    ''
  );
  
  // 移除像素追踪图片
  filteredHtml = filteredHtml.replace(
    /<img[^>]*src="[^"]*(?:pxl-eu\.tsyndicate\.com|google-analytics\.com)[^"]*"[^>]*>/gi,
    ''
  );
  
  // 移除广告iframe（只移除明确的广告域名）
  filteredHtml = filteredHtml.replace(
    /<iframe[^>]*(?:trackwilltrk\.com|rmhfrtnd\.com|twinrdengine\.com|tsyndicate\.com|sunnycloudstone\.com)[^>]*>[\s\S]*?<\/iframe>/gi,
    ''
  );
  
  // 移除sponsored链接
  filteredHtml = filteredHtml.replace(
    /<a[^>]*rel="[^"]*sponsored[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    ''
  );
  
  // 移除bit.ly重定向链接
  filteredHtml = filteredHtml.replace(
    /<a[^>]*href="[^"]*bit\.ly[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    ''
  );
  
  // === 增强的跳转代码过滤 ===
  
  // 1. 移除所有包含eval的脚本（包括混淆的eval）
  filteredHtml = filteredHtml.replace(
    /<script[^>]*type="text\/javascript"[^>]*>[\s\S]*?eval\([\s\S]*?<\/script>/gi,
    '<!-- eval redirect script removed -->'
  );
  
  // 2. 移除包含多层function混淆的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?function\(p,a,c,k,e,d\)[\s\S]*?<\/script>/gi,
    '<!-- obfuscated script removed -->'
  );
  
  // 3. 移除包含特定混淆模式的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?\|\|\|\|\|[\s\S]*?\.split\([\s\S]*?<\/script>/gi,
    '<!-- packed script removed -->'
  );
  
  // 4. 移除包含域名检查和跳转的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:missav\.live|123av\.org|thisav2\.com|missav\.ws|missav01\.com|m\.this\.av|missav888\.com|njavtv\.com|missav123\.com|kiddew\.com|missav\.ai|mqav\.com|missav789\.com)[\s\S]*?<\/script>/gi,
    '<!-- domain redirect script removed -->'
  );
  
  // 5. 移除包含includes方法的域名检查脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?\.includes\([\s\S]*?location[\s\S]*?<\/script>/gi,
    '<!-- domain check script removed -->'
  );
  
  // 6. 移除包含window.location的所有脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:window\.location|document\.location|location\.href|location\.replace|location\.assign)[\s\S]*?<\/script>/gi,
    '<!-- location redirect script removed -->'
  );
  
  // 7. 移除包含setTimeout/setInterval跳转的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:setTimeout|setInterval)[\s\S]*?(?:location|missav)[\s\S]*?<\/script>/gi,
    '<!-- timer redirect script removed -->'
  );
  
  // 8. 移除包含特定字符串模式的混淆脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:fromCharCode|toString\(36\)|parseInt)[\s\S]*?<\/script>/gi,
    '<!-- encoded script removed -->'
  );
  
  // 9. 移除包含特定变量名的混淆脚本（如1t, 1f等）
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?\b1[a-z]\([\s\S]*?<\/script>/gi,
    '<!-- variable obfuscated script removed -->'
  );
  
  return filteredHtml;
}

/**
 * 生成轻量级客户端屏蔽脚本（仅处理服务端无法过滤的情况）
 * @returns {string} 客户端屏蔽脚本
 */
export function getAdBlockScript() {
  return `
<script>
(function() {
  // 立即阻止所有跳转方式
  try {
    // 阻止location相关操作
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      get: function() { return originalLocation; },
      set: function() { console.log('Blocked location set'); }
    });
    
    if (window.location.replace) {
      window.location.replace = function() { console.log('Blocked replace'); };
    }
    if (window.location.assign) {
      window.location.assign = function() { console.log('Blocked assign'); };
    }
    
    // 阻止window.open
    window.open = function() { console.log('Blocked window.open'); return null; };
    
    // 阻止document.location
    if (document.location) {
      Object.defineProperty(document, 'location', {
        get: function() { return originalLocation; },
        set: function() { console.log('Blocked document.location set'); }
      });
    }
  } catch(e) { console.log('Location protection error:', e); }
  
  // 增强的eval阻止
  const originalEval = window.eval;
  window.eval = function(code) {
    if (typeof code === 'string') {
      // 检查是否包含跳转相关代码
      const suspiciousPatterns = [
        'location', 'href', 'replace', 'assign', 'missav.ai', 
        'missav.live', '123av.org', 'thisav2.com', 'includes'
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (code.includes(pattern)) {
          console.log('Blocked suspicious eval:', pattern);
          return;
        }
      }
    }
    return originalEval.call(this, code);
  };
  
  // 阻止setTimeout/setInterval中的跳转
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;
  
  window.setTimeout = function(func, delay) {
    if (typeof func === 'string' && func.includes('location')) {
      console.log('Blocked setTimeout redirect');
      return;
    }
    return originalSetTimeout.apply(this, arguments);
  };
  
  window.setInterval = function(func, delay) {
    if (typeof func === 'string' && func.includes('location')) {
      console.log('Blocked setInterval redirect');
      return;
    }
    return originalSetInterval.apply(this, arguments);
  };
  
  console.log('Anti-redirect protection activated');
})();
</script>`;
}