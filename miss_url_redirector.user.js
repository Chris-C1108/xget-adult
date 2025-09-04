// ==UserScript==
// @name         Missav URL Redirector
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Redirects missav.ai and surrit.com URLs to xget proxy
// @author       Your Name
// @match        https://missav.ai/*
// @match        https://surrit.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // 只在原始域名上执行重定向
    if (currentUrl.startsWith('https://missav.ai/')) {
        window.location.replace(currentUrl.replace('https://missav.ai/', 'https://xget-adult.uni-kui.shop/missav/'));
    } else if (currentUrl.startsWith('https://surrit.com/')) {
        window.location.replace(currentUrl.replace('https://surrit.com/', 'https://xget-adult.uni-kui.shop/missav-cdn/'));
    }

})();