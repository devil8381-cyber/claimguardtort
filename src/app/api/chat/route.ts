import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are a helpful assistant for ClaimGuard Pro, a company that helps claimants with mass tort class action lawsuits. You help people track their claims, understand eligibility, navigate the claims process, and get assistance with denied or stuck claims. Be professional, empathetic, and informative. Keep responses concise (2-3 sentences). If asked about specific claim details, direct them to use the Track My Claim feature or call (800) 555-0199. Never fabricate specific compensation amounts or legal advice.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const messages: { role: string; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Append conversation history (last 10 messages for context)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-10);
      for (const entry of recentHistory) {
        if (
          entry &&
          typeof entry === 'object' &&
          typeof entry.role === 'string' &&
          typeof entry.content === 'string'
        ) {
          messages.push({ role: entry.role, content: entry.content });
        }
      }
    }

    // Append the current user message
    messages.push({ role: 'user', content: message.trim() });

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({ messages });
    const reply =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't process your request. Please call (800) 555-0199 for immediate assistance.";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Error in chat completion:', error);
    return NextResponse.json(
      {
        error:
          'I encountered an issue processing your message. Please try again or call (800) 555-0199 for immediate assistance.',
      },
      { status: 500 }
    );
  }
}
