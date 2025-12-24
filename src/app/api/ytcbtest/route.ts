import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: Request) => {
    console.log('Test callback hit!');
    return NextResponse.json({ status: 'Test route works!' });
};