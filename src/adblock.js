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
  'bit.ly'
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
  
  // 只移除明确的广告脚本，避免误删功能脚本
  
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
  
  // 移除所有eval脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>\s*eval\([\s\S]*?<\/script>/gi,
    '<!-- eval script removed -->'
  );
  
  // 移除包含跳转的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:window\.location|document\.location|location\.href|location\.replace|location\.assign|missav\.ai)[\s\S]*?<\/script>/gi,
    '<!-- redirect script removed -->'
  );
  
  // 移除包含setTimeout/setInterval跳转的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:setTimeout|setInterval)[\s\S]*?(?:location|missav\.ai)[\s\S]*?<\/script>/gi,
    '<!-- timer redirect script removed -->'
  );
  
  return filteredHtml;
}

/**
 * 生成广告屏蔽的JavaScript代码
 * @returns {string} 客户端广告屏蔽脚本
 */
export function getAdBlockScript() {
  return `
<script>
(function() {
  'use strict';
  
  // 立即阻止所有跳转，不等待任何初始化
  try {
    // 阻止 location.href 设置
    Object.defineProperty(window.location, 'href', {
      set: function() { console.log('Blocked href redirect'); },
      get: function() { return window.location.href; }
    });
  } catch(e) {}
  
  try {
    // 阻止 location 方法
    window.location.replace = function() { console.log('Blocked replace'); };
    window.location.assign = function() { console.log('Blocked assign'); };
    window.open = function() { console.log('Blocked open'); return null; };
  } catch(e) {}
  
  // 阻止 eval 执行
  const originalEval = window.eval;
  window.eval = function(code) {
    if (typeof code === 'string' && 
        (code.includes('location') || code.includes('missav.ai') || 
         code.includes('window.location') || code.includes('document.location'))) {
      console.log('Blocked eval with redirect code');
      return;
    }
    return originalEval.call(this, code);
  };
  
  // 阻止 setTimeout/setInterval 中的跳转代码
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function(func, delay) {
    if (typeof func === 'string' && 
        (func.includes('location') || func.includes('missav.ai'))) {
      console.log('Blocked setTimeout redirect');
      return;
    }
    return originalSetTimeout.apply(this, arguments);
  };
  
  const originalSetInterval = window.setInterval;
  window.setInterval = function(func, delay) {
    if (typeof func === 'string' && 
        (func.includes('location') || func.includes('missav.ai'))) {
      console.log('Blocked setInterval redirect');
      return;
    }
    return originalSetInterval.apply(this, arguments);
  };
  
  console.log('Redirect blocker activated immediately');
})();
</script>`;
}