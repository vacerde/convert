import { createAnalyticsRouteHandler } from '@ascr/analytics/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = createAnalyticsRouteHandler();
