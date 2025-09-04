import { describe, it, expect } from 'vitest';
import { isAdUrl, filterAds, getAdBlockScript } from '../src/adblock.js';

describe('广告屏蔽模块', () => {
  describe('isAdUrl', () => {
    it('应该识别广告域名', () => {
      expect(isAdUrl('https://trackwilltrk.com/test')).toBe(true);
      expect(isAdUrl('https://r.trackwilltrk.com/s1/test')).toBe(true);
      expect(isAdUrl('https://go.rmhfrtnd.com/smartpop/test')).toBe(true);
      expect(isAdUrl('https://ad.twinrdengine.com/adraw?zone=test')).toBe(true);
      expect(isAdUrl('https://diffusedpassionquaking.com/test')).toBe(true);
      expect(isAdUrl('https://tsyndicate.com/api/v1/direct/test')).toBe(true);
    });

    it('应该允许正常URL', () => {
      expect(isAdUrl('https://missav.ai/cn/sone-815')).toBe(false);
      expect(isAdUrl('https://surrit.com/video.mp4')).toBe(false);
      expect(isAdUrl('https://fourhoi.com/cover.jpg')).toBe(false);
    });
  });

  describe('filterAds', () => {
    it('应该移除Google Tag Manager', () => {
      const html = `
        <head>
          <script>
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WLS867RZ');
          </script>
        </head>
      `;
      const filtered = filterAds(html);
      expect(filtered).not.toContain('googletagmanager.com');
    });

    it('应该移除广告iframe', () => {
      const html = `
        <div>
          <iframe data-link="https://r.trackwilltrk.com/s1/test" src="javascript:window.location.replace(this.frameElement.dataset.link)" width="300" height="250"></iframe>
          <iframe src="https://go.rmhfrtnd.com/smartpop/test" width="300" height="250"></iframe>
        </div>
      `;
      const filtered = filterAds(html);
      expect(filtered).not.toContain('trackwilltrk.com');
      expect(filtered).not.toContain('rmhfrtnd.com');
    });

    it('应该移除sponsored链接', () => {
      const html = `
        <a href="https://bit.ly/test" rel="sponsored nofollow noopener noreferrer" target="_blank">广告链接</a>
      `;
      const filtered = filterAds(html);
      expect(filtered).not.toContain('sponsored');
      expect(filtered).not.toContain('bit.ly');
    });
  });

  describe('getAdBlockScript', () => {
    it('应该生成有效的JavaScript代码', () => {
      const script = getAdBlockScript();
      expect(script).toContain('<script>');
      expect(script).toContain('</script>');
      expect(script).toContain('adDomains');
      expect(script).toContain('originalFetch');
    });
  });
});