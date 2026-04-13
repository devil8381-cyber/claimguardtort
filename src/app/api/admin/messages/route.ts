import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exportFormat = searchParams.get('export');

    if (exportFormat === 'csv') {
      const messages = await db.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Name', 'Email', 'Phone', 'Claim ID', 'Message', 'File', 'Read', 'Created At'];
      const rows = messages.map(m => [
        m.name,
        m.email,
        m.phone || '',
        m.claimId || '',
        m.message.replace(/"/g, '""'),
        m.fileName || '',
        m.read ? 'Yes' : 'No',
        new Date(m.createdAt).toLocaleDateString(),
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="messages-export.csv"',
        },
      });
    }

    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Admin messages list error:', error);
    return NextResponse.json(
      { error: 'Failed to load messages' },
      { status: 500 }
    );
  }
}
