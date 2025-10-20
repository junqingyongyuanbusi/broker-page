import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 验证 Webhook 签名
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // 获取 Webhook secret
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing SUPABASE_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    // 验证签名
    const signature = request.headers.get('x-supabase-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const body = await request.text();
    const payload = JSON.parse(body);

    // 验证 Webhook 签名
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 处理不同的数据库事件
    const { type, table, record, old_record } = payload;

    console.log(`Webhook received: ${type} on ${table}`);

    switch (table) {
      case 'brokers':
        // 经纪商表更新
        if (type === 'UPDATE' || type === 'INSERT') {
          // 重新验证特定经纪商页面
          const slug = record.slug;
          await revalidatePath(`/brokers/${slug}`);
          console.log(`Revalidated: /brokers/${slug}`);

          // 如果状态改变，也重新验证列表页
          if (old_record?.status !== record.status) {
            await revalidatePath('/brokers');
            console.log('Revalidated: /brokers');
          }
        } else if (type === 'DELETE' && old_record) {
          // 删除时重新验证列表页
          await revalidatePath('/brokers');
          console.log('Revalidated: /brokers');
        }
        break;

      case 'broker_regulations':
      case 'broker_accounts':
      case 'broker_products':
      case 'broker_payment_methods':
      case 'broker_faqs':
      case 'broker_pros_cons':
      case 'broker_content_blocks':
        // 关联数据表更新
        if (record?.broker_id || old_record?.broker_id) {
          const brokerId = record?.broker_id || old_record?.broker_id;

          // 通过 broker_id 查找对应的 slug
          // 注意：实际应用中可能需要查询数据库获取 slug
          // 这里使用 revalidateTag 来处理
          await revalidateTag(`broker-${brokerId}`);
          console.log(`Revalidated tag: broker-${brokerId}`);
        }
        break;

      default:
        console.log(`Unhandled table: ${table}`);
    }

    // 可选：重新生成站点地图
    if (table === 'brokers' && (type === 'INSERT' || type === 'DELETE')) {
      await revalidatePath('/sitemap.xml');
      console.log('Revalidated: /sitemap.xml');
    }

    return NextResponse.json({
      success: true,
      message: `Revalidation triggered for ${table}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 手动重新验证端点（用于测试或手动触发）
export async function GET(request: NextRequest) {
  try {
    // 验证 API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.REVALIDATE_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const tag = searchParams.get('tag');

    if (path) {
      await revalidatePath(path);
      return NextResponse.json({
        success: true,
        revalidated: { path },
        timestamp: new Date().toISOString(),
      });
    }

    if (tag) {
      await revalidateTag(tag);
      return NextResponse.json({
        success: true,
        revalidated: { tag },
        timestamp: new Date().toISOString(),
      });
    }

    // 默认重新验证所有经纪商页面
    await revalidatePath('/brokers', 'layout');
    return NextResponse.json({
      success: true,
      revalidated: 'all broker pages',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Manual revalidation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}