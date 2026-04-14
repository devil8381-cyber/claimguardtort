import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const SYSTEM_PROMPT = `You are a knowledgeable assistant for ClaimGuard Pro, a completely free mass tort claims assistance service. You help claimants understand mass tort processes, case types, documentation requirements, and settlement information.

Key information:
- ClaimGuard Pro is 100% FREE — all services at no cost, ever
- Case types we handle: Camp Lejeune, Roundup, Talc/Baby Powder, Hernia Mesh, Paraquat, Firefighting Foam (AFFF), Zantac, Hair Relaxer, CPAP Machines, Social Media Lawsuits, Rideshare Assault, NEC Baby Formula, Depo Provera, Roblox/Gaming, IL Detention, 3M Earplugs, Exactech Implants, Bard PowerPort, Elmiron, Taxotere, Uber/Lyft Safety, Talcum Powder Cancer, AFFF/PFAS Exposure, Talc Ovarian Cancer
- Filing requirements: government ID, proof of residence, medical records, proof of exposure, physician's opinion letter
- Claim statuses: Submitted, Validated, Under Review, Decision, Completed
- Services: claim tracking, document correction, eligibility assessment, personalized support, legal strategy consultation, settlement maximization
- Important: Filing deadlines are STRICT and vary by case type. Encourage users to check deadlines urgently.

Always be empathetic, helpful, and accurate. Never promise specific outcomes. Encourage users to use Track My Claim or contact a specialist at (484) 968-1529.`;

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 10);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

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
          typeof entry.content === 'string' &&
          (entry.role === 'user' || entry.role === 'assistant')
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
      "I'm sorry, I couldn't process your request. Please call (484) 968-1529 for immediate assistance.";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Error in chat completion:', error);
    return NextResponse.json(
      {
        error:
          'I encountered an issue processing your message. Please try again or call (484) 968-1529 for immediate assistance.',
      },
      { status: 500 }
    );
  }
}
