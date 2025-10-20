# Supabase Webhook 配置指南

## 1. Webhook 设置步骤

### 在 Supabase Dashboard 中配置

1. 登录 Supabase Dashboard
2. 进入项目 -> Database -> Webhooks
3. 点击 "Create a new webhook"
4. 配置以下设置：

```yaml
名称: broker-updates
URL: https://your-domain.com/api/revalidate
Method: POST
Headers:
  Content-Type: application/json
  x-supabase-signature: [自动生成]
```

### 2. 创建数据库触发器

在 Supabase SQL Editor 中运行以下 SQL：

```sql
-- 创建 Webhook 触发器函数
CREATE OR REPLACE FUNCTION trigger_webhook()
RETURNS trigger AS $$
DECLARE
  payload json;
  url text := 'https://your-domain.com/api/revalidate';
  secret text := 'your-webhook-secret';
BEGIN
  -- 构建 payload
  payload := json_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD),
    'timestamp', NOW()
  );

  -- 发送 Webhook
  PERFORM net.http_post(
    url := url,
    body := payload::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-supabase-signature', encode(
        hmac(payload::text, secret, 'sha256'),
        'hex'
      )
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 brokers 表创建触发器
CREATE TRIGGER webhook_brokers
AFTER INSERT OR UPDATE OR DELETE ON brokers
FOR EACH ROW
EXECUTE FUNCTION trigger_webhook();

-- 为其他表创建触发器
CREATE TRIGGER webhook_broker_regulations
AFTER INSERT OR UPDATE OR DELETE ON broker_regulations
FOR EACH ROW
EXECUTE FUNCTION trigger_webhook();

CREATE TRIGGER webhook_broker_accounts
AFTER INSERT OR UPDATE OR DELETE ON broker_accounts
FOR EACH ROW
EXECUTE FUNCTION trigger_webhook();

CREATE TRIGGER webhook_broker_faqs
AFTER INSERT OR UPDATE OR DELETE ON broker_faqs
FOR EACH ROW
EXECUTE FUNCTION trigger_webhook();

CREATE TRIGGER webhook_broker_pros_cons
AFTER INSERT OR UPDATE OR DELETE ON broker_pros_cons
FOR EACH ROW
EXECUTE FUNCTION trigger_webhook();

-- 启用 pg_net 扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## 3. 环境变量配置

在 `.env.local` 文件中添加：

```env
# Webhook Secret（用于验证请求来源）
SUPABASE_WEBHOOK_SECRET=your-webhook-secret-here

# API Key（用于手动触发重新验证）
REVALIDATE_API_KEY=your-api-key-here
```

## 4. 测试 Webhook

### 手动测试重新验证

```bash
# 重新验证特定页面
curl -H "x-api-key: your-api-key" \
  "https://your-domain.com/api/revalidate?path=/brokers/xm-trading"

# 重新验证标签
curl -H "x-api-key: your-api-key" \
  "https://your-domain.com/api/revalidate?tag=broker-123"

# 重新验证所有页面
curl -H "x-api-key: your-api-key" \
  "https://your-domain.com/api/revalidate"
```

### 测试数据更新触发

1. 在 Supabase Dashboard 中更新一条经纪商记录
2. 检查 Vercel Functions 日志查看 Webhook 是否触发
3. 访问对应页面检查内容是否更新

## 5. ISR (Incremental Static Regeneration) 配置

### 页面级别的 ISR

在 `app/brokers/[slug]/page.tsx` 中已配置：

```typescript
export const revalidate = 3600; // 每小时重新验证
```

### On-Demand Revalidation

通过 Webhook 触发的即时重新验证：
- 数据更新后立即重新生成页面
- 无需等待 revalidate 时间间隔
- 确保内容始终是最新的

## 6. 性能优化建议

### 批量更新处理

如果需要批量更新多个经纪商：

```typescript
// 使用批量重新验证
const slugs = ['xm-trading', 'ic-markets', 'pepperstone'];
await Promise.all(
  slugs.map(slug => revalidatePath(`/brokers/${slug}`))
);
```

### 缓存策略

- **静态生成**：构建时生成所有已发布的页面
- **ISR**：每小时自动重新验证
- **On-Demand**：数据更新时立即重新验证
- **Edge Caching**：使用 CDN 缓存静态资源

## 7. 监控和日志

### Vercel 日志监控

```typescript
// 在 route.ts 中添加详细日志
console.log({
  event: 'webhook_received',
  table,
  type,
  slug: record?.slug,
  timestamp: new Date().toISOString()
});
```

### 设置告警

在 Vercel Dashboard 中设置以下告警：
- Webhook 失败率 > 1%
- 重新验证延迟 > 5秒
- 404 错误率上升

## 8. 安全考虑

- **签名验证**：始终验证 Webhook 签名
- **IP 白名单**：限制 Webhook 来源 IP
- **速率限制**：防止 Webhook 攻击
- **错误处理**：优雅处理失败情况

## 9. 故障排查

### 常见问题

1. **Webhook 未触发**
   - 检查 Supabase Webhook 配置
   - 验证 URL 是否正确
   - 检查网络连接

2. **页面未更新**
   - 检查 revalidatePath 是否成功
   - 清除 CDN 缓存
   - 检查构建日志

3. **签名验证失败**
   - 确认 SUPABASE_WEBHOOK_SECRET 正确
   - 检查签名算法是否匹配