import { createAnalyticsRouteHandler } from '@vacer/analytics/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = createAnalyticsRouteHandler();
