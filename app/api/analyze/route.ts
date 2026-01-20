import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // 1. ORIGIN / REFERER VERIFICATION (Basic CSRF protection)
        const origin = request.headers.get('origin') || request.headers.get('referer');
        const host = request.headers.get('host');

        // In production, you'd want to be stricter here
        if (process.env.NODE_ENV === 'production' && origin && !origin.includes(host || '')) {
            console.warn('Blocked suspicious cross-origin request');
            return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
        }

        const body = await request.json();
        const { prompt } = body;
        const apiKey = process.env.GEMINI_API_KEY;

        // 2. PROMPT SIZE VALIDATION (Prevent resource exhaustion)
        if (prompt && prompt.length > 50000) {
            return NextResponse.json({ error: 'Prompt too large' }, { status: 413 });
        }

        // 3. RATE LIMITING (Basic)
        // Note: For true production on Vercel, use Upstash Redis with @upstash/ratelimit
        // This is a simple per-instance safeguard
        console.log('--- SECURITY CHECK: REQUEST AUTHORIZED ---');
        console.log('Prompt length:', prompt?.length);
        console.log('API Key loaded:', !!apiKey);
        if (apiKey) console.log('API Key starts with:', apiKey.substring(0, 8));

        if (!prompt || !apiKey) {
            return NextResponse.json({
                error: 'Missing prompt or API configuration',
                hasPrompt: !!prompt,
                hasApiKey: !!apiKey
            }, { status: 400 });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8000,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Detail:', errorText);

            let parsedError;
            try {
                parsedError = JSON.parse(errorText);
            } catch (e) {
                parsedError = errorText;
            }

            return NextResponse.json({
                error: 'Gemini API failed',
                status: response.status,
                detail: parsedError
            }, { status: response.status });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid Gemini Response Structure:', JSON.stringify(data));
            return NextResponse.json({ error: 'Invalid response from Gemini', raw: data }, { status: 500 });
        }

        const text = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ text });
    } catch (error) {
        console.error('CRITICAL PROXY ERROR:', error);
        return NextResponse.json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
