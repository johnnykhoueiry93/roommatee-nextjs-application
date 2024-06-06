//  /api/logout

const logger = require("../../../utils/logger");
import { cookies } from 'next/headers';

export async function POST(request) {
    logger.info('Request to logout');

    const cookieStore = cookies();
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('next-auth.csrf-token');

    return new Response('Cookie deleted', { status: 200 });
}

