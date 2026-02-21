import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // For now: log to console. In production, integrate with:
    // - Supabase (store in contact_submissions table)
    // - Resend/SendGrid (email to hello@maltaverse.com)
    // - Webhook to CRM
    console.log('[CONTACT FORM]', {
      name,
      email,
      company: company || '(not provided)',
      subject,
      message: message.slice(0, 100) + '...',
      timestamp: new Date().toISOString(),
    });

    // Store in Supabase if configured and table exists
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('contact_submissions').insert({
          name,
          email,
          company: company || null,
          subject,
          message,
        });
      } catch (err) {
        console.error('[CONTACT] Supabase:', err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[CONTACT]', e);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
