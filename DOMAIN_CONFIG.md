# 域名配置指南

## 配置自定义域名

### 1. 修改 wrangler.toml

```toml
# 取消注释并修改为你的域名
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" },
  { pattern = "*.your-domain.com/*", zone_name = "your-domain.com" }
]
```

### 2. 域名示例

```toml
# 示例 1: 使用主域名
routes = [
  { pattern = "xget.example.com/*", zone_name = "example.com" }
]

# 示例 2: 使用子域名
routes = [
  { pattern = "cdn.example.com/*", zone_name = "example.com" },
  { pattern = "api.example.com/*", zone_name = "example.com" }
]
```

### 3. DNS 配置

在你的 DNS 提供商处添加 CNAME 记录：
```
xget.your-domain.com CNAME your-worker-name.your-subdomain.workers.dev
```

### 4. 部署

```bash
# 部署到 Cloudflare Workers
npx wrangler deploy

# 验证部署
curl https://your-domain.com/gh/microsoft/vscode/archive/main.zip
```

## 使用方式

配置完成后，将所有示例中的 `xget.xi-xu.me` 替换为你的域名：

```bash
# 原示例
curl https://xget.xi-xu.me/missav/dm27/cn/ssni-156-uncensored-leak

# 使用你的域名
curl https://your-domain.com/missav/dm27/cn/ssni-156-uncensored-leak
```