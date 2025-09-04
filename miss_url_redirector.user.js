// ==UserScript==
// @name         Multi-Domain URL Redirector & Link Modifier
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Redirects missav.ai/surrit.com URLs and modifies page links
// @author       Your Name
// @match        https://missav.ai/*
// @match        https://surrit.com/*
// @match        https://xget-adult.uni-kui.shop/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        targetDomain: 'https://xget-adult.uni-kui.shop',
        urlMappings: {
            'https://missav.ai/': '/missav/',
            'https://surrit.com/': '/missav-cdn/'
        }
    };
    
    const currentUrl = window.location.href;

    // 避免在目标域名上执行重定向
    if (currentUrl.startsWith(CONFIG.targetDomain)) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', modifyPageLinks);
        } else {
            modifyPageLinks();
        }
        return;
    }

    // URL重定向规则
    for (const [sourceUrl, targetPath] of Object.entries(CONFIG.urlMappings)) {
        if (currentUrl.startsWith(sourceUrl)) {
            window.location.replace(currentUrl.replace(sourceUrl, CONFIG.targetDomain + targetPath));
            return;
        }
    }

    function replaceUrl(url) {
        for (const [sourceUrl, targetPath] of Object.entries(CONFIG.urlMappings)) {
            if (url.startsWith(sourceUrl)) {
                return url.replace(sourceUrl, CONFIG.targetDomain + targetPath);
            }
        }
        return url;
    }

    function modifyPageLinks() {
        // 修改所有链接
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            const newHref = replaceUrl(href);
            if (newHref !== href) {
                link.setAttribute('href', newHref);
            }
        });

        // 修改视频源
        document.querySelectorAll('video source[src], video[src]').forEach(video => {
            const src = video.getAttribute('src');
            if (src) {
                const newSrc = replaceUrl(src);
                if (newSrc !== src) {
                    video.setAttribute('src', newSrc);
                }
            }
        });

        // 监听动态添加的元素
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 检查单个节点
                        if (node.tagName === 'A' && node.hasAttribute('href')) {
                            const href = node.getAttribute('href');
                            const newHref = replaceUrl(href);
                            if (newHref !== href) {
                                node.setAttribute('href', newHref);
                            }
                        }
                        if ((node.tagName === 'VIDEO' || node.tagName === 'SOURCE') && node.hasAttribute('src')) {
                            const src = node.getAttribute('src');
                            if (src) {
                                const newSrc = replaceUrl(src);
                                if (newSrc !== src) {
                                    node.setAttribute('src', newSrc);
                                }
                            }
                        }
                        // 检查子元素
                        if (node.querySelectorAll) {
                            node.querySelectorAll('a[href], video[src], source[src]').forEach(child => {
                                const attr = child.tagName === 'A' ? 'href' : 'src';
                                const url = child.getAttribute(attr);
                                if (url) {
                                    const newUrl = replaceUrl(url);
                                    if (newUrl !== url) {
                                        child.setAttribute(attr, newUrl);
                                    }
                                }
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();