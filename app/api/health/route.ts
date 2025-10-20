import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // 检查数据库连接
    const supabase = createServerClient();
    const { error: dbError } = await supabase
      .from('brokers')
      .select('id')
      .limit(1)
      .single();

    const dbStatus = !dbError ? 'healthy' : 'unhealthy';

    // 获取应用信息
    const appInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus,
        cache: 'healthy',
        cdn: 'healthy',
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    };

    // 如果数据库不健康，返回503
    if (dbStatus === 'unhealthy') {
      return NextResponse.json(
        { ...appInfo, status: 'degraded' },
        { status: 503 }
      );
    }

    return NextResponse.json(appInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}