import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!prompt || !apiKey) {
            return NextResponse.json({ error: 'Missing prompt or API configuration' }, { status: 400 });
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
            console.error('Gemini API Error:', errorText);
            return NextResponse.json({ error: 'Gemini API failed' }, { status: response.status });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            return NextResponse.json({ error: 'Invalid response from Gemini' }, { status: 500 });
        }

        const text = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
