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
  'myavlive.com',
  'go.myavlive.com',
  'googletagmanager.com',
  'google-analytics.com',
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
  /myavlive\.com/i,
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /google\.com\/recaptcha/i,
  /bit\.ly/i,
  /adraw\?zone=/i,
  /smartpop\//i,
  /direct\//i,
  /\/g\/collect\?v=2&tid=/i,
  /outstream\.video/i
];

// 广告相关的HTML元素选择器
const AD_SELECTORS = [
  'iframe[src*="trackwilltrk.com"]',
  'iframe[src*="rmhfrtnd.com"]',
  'iframe[src*="twinrdengine.com"]',
  'iframe[src*="diffusedpassionquaking.com"]',
  'iframe[src*="tsyndicate.com"]',
  'iframe[src*="myavlive.com"]',
  'iframe[data-link*="trackwilltrk.com"]',
  'script[src*="googletagmanager.com"]',
  'script[src*="google.com/recaptcha"]',
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
  
  // 移除Google Tag Manager
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>[\s\S]*?googletagmanager\.com[\s\S]*?<\/script>/gi,
    ''
  );
  
  // 移除Google Analytics iframe
  filteredHtml = filteredHtml.replace(
    /<noscript><iframe[^>]*googletagmanager\.com[^>]*>[\s\S]*?<\/iframe><\/noscript>/gi,
    ''
  );
  
  // 移除广告iframe
  AD_DOMAINS.forEach(domain => {
    const iframeRegex = new RegExp(
      `<iframe[^>]*${domain.replace('.', '\\.')}[^>]*>[\\s\\S]*?<\\/iframe>`,
      'gi'
    );
    filteredHtml = filteredHtml.replace(iframeRegex, '');
  });
  
  // 移除带有data-link属性的广告iframe
  filteredHtml = filteredHtml.replace(
    /<iframe[^>]*data-link[^>]*trackwilltrk\.com[^>]*>[^<]*<\/iframe>/gi,
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
  
  // 移除混淆的eval跳转代码
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>\s*eval\(function\(p,a,c,k,e,d\)[\s\S]*?includes[\s\S]*?window\.location[\s\S]*?<\/script>/gi,
    ''
  );
  
  // 移除所有包含eval和location的可疑脚本
  filteredHtml = filteredHtml.replace(
    /<script[^>]*>\s*eval\([\s\S]*?location[\s\S]*?<\/script>/gi,
    ''
  );
  
  // 移除特定的混淆模式（多层eval嵌套）
  filteredHtml = filteredHtml.replace(
    /<script[^>]*type="text\/javascript">\s*eval\(function\(p,a,c,k,e,d\)[\s\S]*?split\('\|'\)[\s\S]*?<\/script>/gi,
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
  
  // 阻止广告请求
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string') {
      for (const domain of adDomains) {
        if (url.includes(domain)) {
          console.log('Blocked ad request:', url);
          return Promise.reject(new Error('Ad blocked'));
        }
      }
    }
    return originalFetch.apply(this, arguments);
  };
  
  // 阻止XMLHttpRequest广告请求
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string') {
      for (const domain of adDomains) {
        if (url.includes(domain)) {
          console.log('Blocked XHR ad request:', url);
          return;
        }
      }
    }
    return originalXHROpen.apply(this, arguments);
  };
  
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
  
  // 拦截域名检查跳转
  const originalLocationSetter = Object.getOwnPropertyDescriptor(Location.prototype, 'href').set;
  Object.defineProperty(Location.prototype, 'href', {
    set: function(value) {
      // 检查是否为跳转到 missav.ai
      if (typeof value === 'string' && value.includes('missav.ai') && !window.location.href.includes('missav.ai')) {
        console.log('Blocked redirect to:', value);
        return; // 阻止跳转
      }
      return originalLocationSetter.call(this, value);
    },
    get: function() {
      return window.location.href;
    }
  });
  
  // 拦截 location.replace
  const originalReplace = Location.prototype.replace;
  Location.prototype.replace = function(url) {
    if (typeof url === 'string' && url.includes('missav.ai') && !window.location.href.includes('missav.ai')) {
      console.log('Blocked location.replace to:', url);
      return;
    }
    return originalReplace.call(this, url);
  };
  
  console.log('Ad blocker and redirect blocker initialized');
})();
</script>`;
}