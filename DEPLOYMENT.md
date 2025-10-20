# 部署指南

## 目录
1. [前置要求](#前置要求)
2. [环境准备](#环境准备)
3. [Vercel 部署](#vercel-部署)
4. [Docker 部署](#docker-部署)
5. [性能优化](#性能优化)
6. [监控与维护](#监控与维护)

## 前置要求

### 必需服务
- **Supabase 账号**: 数据库服务
- **Vercel 账号**: 托管服务（可选）
- **域名**: 用于生产环境
- **SSL 证书**: HTTPS 支持

### 开发工具
- Node.js 18+
- npm 或 yarn
- Git
- Docker（可选）

## 环境准备

### 1. 克隆项目
```bash
git clone https://github.com/your-username/seo-broker-page.git
cd seo-broker-page
npm install
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Webhook
SUPABASE_WEBHOOK_SECRET=your-webhook-secret
REVALIDATE_API_KEY=your-api-key

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. 数据库初始化

```bash
# 登录 Supabase Dashboard
# 运行 supabase/schema.sql 中的所有 SQL

# 或使用 Supabase CLI
npx supabase db push
```

### 4. 导入初始数据

```bash
npm run import:brokers
```

## Vercel 部署

### 快速部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/seo-broker-page)

### 手动部署

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel --prod
```

4. **配置环境变量**

在 Vercel Dashboard 中设置：
- Project Settings → Environment Variables
- 添加所有 `.env.local` 中的变量

5. **配置域名**
- Project Settings → Domains
- 添加自定义域名
- 配置 DNS 记录

### Webhook 配置

1. 获取部署 URL
2. 在 Supabase 中配置 Webhook：
   - URL: `https://your-domain.com/api/revalidate`
   - 触发事件: INSERT, UPDATE, DELETE

## Docker 部署

### 1. 构建镜像

```bash
docker build -t broker-seo:latest .
```

### 2. 运行容器

```bash
docker run -d \
  --name broker-seo \
  -p 3000:3000 \
  --env-file .env.local \
  broker-seo:latest
```

### 3. Docker Compose 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 4. 配置 Nginx

如果使用 Nginx 反向代理：

```bash
# 复制 SSL 证书
cp /path/to/cert.pem ssl/
cp /path/to/key.pem ssl/

# 更新 nginx.conf 中的域名
sed -i 's/your-domain.com/actual-domain.com/g' nginx.conf
```

## 性能优化

### 1. 构建优化

```json
// next.config.js 优化配置
{
  "swcMinify": true,
  "compiler": {
    "removeConsole": {
      "exclude": ["error"]
    }
  },
  "experimental": {
    "optimizeCss": true
  }
}
```

### 2. 图片优化

```bash
# 安装图片优化工具
npm install --save-dev @next/bundle-analyzer

# 分析包大小
npm run analyze
```

### 3. 数据库优化

```sql
-- 创建必要的索引
CREATE INDEX idx_brokers_status ON brokers(status);
CREATE INDEX idx_brokers_slug ON brokers(slug);
CREATE INDEX idx_brokers_overall_rating ON brokers(overall_rating DESC);

-- 分析查询性能
EXPLAIN ANALYZE SELECT * FROM brokers WHERE status = 'published';
```

### 4. CDN 配置

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['cdn.your-domain.com'],
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud/image/upload/',
  },
  assetPrefix: 'https://cdn.your-domain.com',
};
```

## 监控与维护

### 1. 性能监控

**Vercel Analytics**
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Google Analytics**
```javascript
// 添加到 app/layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

### 2. 错误监控

**Sentry 集成**
```bash
npm install @sentry/nextjs

npx @sentry/wizard -i nextjs
```

### 3. SEO 监控

**定期检查**
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# SEO 检查脚本
npm run seo:check
```

### 4. 备份策略

**数据库备份**
```bash
# Supabase 自动备份
# Dashboard → Settings → Database → Backups

# 手动备份
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

**代码备份**
```bash
# Git 标签管理
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

## 故障排查

### 常见问题

#### 1. 页面未更新
```bash
# 清除缓存
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-api-key: your-api-key" \
  -d '{"path": "/brokers/xm-trading"}'
```

#### 2. 数据库连接失败
```bash
# 检查连接
npx supabase db remote status

# 重置连接池
npx supabase db reset
```

#### 3. 构建失败
```bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

#### 4. SSL 证书问题
```bash
# 更新证书
certbot renew --nginx

# 验证证书
openssl s_client -connect your-domain.com:443
```

### 日志查看

**Vercel 日志**
```bash
vercel logs --follow
```

**Docker 日志**
```bash
docker logs -f broker-seo
```

**Nginx 日志**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 扩展部署

### 多区域部署

1. **Vercel Edge Network**
   - 自动全球 CDN 分发
   - Edge Functions 支持

2. **Cloudflare Workers**
```javascript
// workers/index.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'your-vercel-app.vercel.app';
    return fetch(url, request);
  }
}
```

### 负载均衡

```nginx
# nginx.conf
upstream backend {
    least_conn;
    server app1:3000 weight=5;
    server app2:3000 weight=3;
    server app3:3000 backup;
}
```

### 自动扩缩容

**Kubernetes 配置**
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: broker-seo-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: broker-seo
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## 最佳实践

### 安全建议

1. **环境变量管理**
   - 使用密钥管理服务（AWS Secrets Manager, Vercel Env）
   - 定期轮换密钥
   - 不同环境使用不同密钥

2. **API 限流**
```javascript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

3. **内容安全策略**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### 性能建议

1. **预渲染策略**
   - 热门页面: 构建时生成
   - 长尾页面: ISR 或按需生成
   - 实时数据: CSR 或 SSR

2. **缓存策略**
   - 静态资源: 1年
   - HTML: 1小时
   - API: 根据业务需求

3. **数据库查询优化**
   - 使用连接池
   - 批量查询
   - 适当的索引

## 支持与资源

- **文档**: [项目 Wiki](https://github.com/your-username/seo-broker-page/wiki)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/seo-broker-page/issues)
- **社区讨论**: [Discussions](https://github.com/your-username/seo-broker-page/discussions)
- **更新日志**: [CHANGELOG.md](./CHANGELOG.md)

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件