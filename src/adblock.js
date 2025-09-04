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
  
  // 移除所有eval脚本（更安全）
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>\s*eval\([\s\S]*?<\/script>/gi,
    ''
  );
  
  // 移除包含特定关键词的脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?(?:window\.location|document\.location|location\.href|location\.replace)[\s\S]*?<\/script>/gi,
    ''
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
  
  // 广告域名黑名单
  const adDomains = ${JSON.stringify(AD_DOMAINS)};
  
  // 完全阻止广告域名请求
  try {
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string') {
        const blockedDomains = [
          'trackwilltrk.com', 'rmhfrtnd.com', 'twinrdengine.com',
          'tsyndicate.com', 'sunnycloudstone.com', 'myavlive.com',
          'googletagmanager.com', 'google-analytics.com'
        ];
        
        for (const domain of blockedDomains) {
          if (url.includes(domain)) {
            console.log('Blocked fetch:', url);
            return Promise.reject(new Error('Blocked'));
          }
        }
      }
      return originalFetch.apply(this, arguments);
    };
  } catch(e) { console.log('Fetch override failed:', e); }
  
  // 阻止XMLHttpRequest到广告域名
  try {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string') {
        const blockedDomains = [
          'trackwilltrk.com', 'rmhfrtnd.com', 'twinrdengine.com',
          'tsyndicate.com', 'sunnycloudstone.com', 'myavlive.com'
        ];
        
        for (const domain of blockedDomains) {
          if (url.includes(domain)) {
            console.log('Blocked XHR:', url);
            throw new Error('Blocked XHR');
          }
        }
      }
      return originalXHROpen.apply(this, arguments);
    };
  } catch(e) { console.log('XHR override failed:', e); }
  
  // 移除现有广告元素
  function removeAdElements() {
    const selectors = ${JSON.stringify(AD_SELECTORS)};
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        console.log('Removed ad element:', el);
        el.remove();
      });
    });
  }
  
  // 页面加载完成后移除广告
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeAdElements);
  } else {
    removeAdElements();
  }
  
  // 监听动态添加的广告元素
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          const selectors = ${JSON.stringify(AD_SELECTORS)};
          selectors.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              console.log('Blocked dynamically added ad:', node);
              node.remove();
            }
            node.querySelectorAll && node.querySelectorAll(selector).forEach(el => {
              console.log('Blocked nested ad element:', el);
              el.remove();
            });
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 完全阻止页面跳转
  try {
    const originalLocationSetter = Object.getOwnPropertyDescriptor(Location.prototype, 'href').set;
    Object.defineProperty(Location.prototype, 'href', {
      set: function(value) {
        console.log('Blocked redirect to:', value);
        return; // 完全阻止跳转
      },
      get: function() {
        return window.location.href;
      }
    });
  } catch(e) { console.log('Location.href override failed:', e); }
  
  // 阻止所有location方法
  try {
    Location.prototype.replace = function(url) {
      console.log('Blocked location.replace:', url);
      return;
    };
    Location.prototype.assign = function(url) {
      console.log('Blocked location.assign:', url);
      return;
    };
    window.open = function() {
      console.log('Blocked window.open');
      return null;
    };
  } catch(e) { console.log('Location methods override failed:', e); }
  
  console.log('Ad blocker and redirect blocker initialized');
})();
</script>`;
}