// 测试 Missav 功能的脚本
import { transformPath } from './src/config/platforms.js';

console.log('=== 测试路径转换 ===');

// 测试 missav 路径转换
const testPaths = [
  { input: '/missav/cn/sone-815', platform: 'missav', expected: '/cn/sone-815' },
  { input: '/missav-cdn/video/123.mp4', platform: 'missav-cdn', expected: '/video/123.mp4' },
  { input: '/missav/search?q=test', platform: 'missav', expected: '/search?q=test' }
];

testPaths.forEach(test => {
  const result = transformPath(test.input, test.platform);
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${test.platform}: ${test.input} -> ${result} (expected: ${test.expected})`);
});

console.log('\n=== 测试 URL 构建 ===');

// 模拟 URL 构建过程
const PLATFORMS = {
  missav: 'https://missav.ai',
  'missav-cdn': 'https://surrit.com'
};

testPaths.forEach(test => {
  const transformedPath = transformPath(test.input, test.platform);
  const targetUrl = `${PLATFORMS[test.platform]}${transformedPath}`;
  console.log(`${test.platform}: ${test.input} -> ${targetUrl}`);
});