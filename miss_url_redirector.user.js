// ==UserScript==
// @name         Multi-Domain URL Redirector (missav & surrit)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Redirects missav.ai to xget-adult.uni-kui.shop/missav/ AND surrit.com to xget-adult.uni-kui.shop/missav-cdn/
// @author       Your Name
// @match        https://missav.ai/*
// @match        https://surrit.com/*
// @match        https://xget-adult.uni-kui.shop/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // --- 规则一：改写 missav.ai ---
    if (currentUrl.startsWith('https://missav.ai/')) {
        const newUrl = currentUrl.replace('https://missav.ai/', 'https://xget-adult.uni-kui.shop/missav/');
        window.location.replace(newUrl);
        return; // 执行跳转后，停止脚本
    }

    // --- 规则二：改写 surrit.com ---
    if (currentUrl.startsWith('https://surrit.com/')) {
        const newUrl = currentUrl.replace('https://surrit.com/', 'https://xget-adult.uni-kui.shop/missav-cdn/');
        window.location.replace(newUrl);
        return; // 执行跳转后，停止脚本
    }

})();