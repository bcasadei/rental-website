// import { NextRequest, NextResponse } from 'next/server';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: NextRequest) {
//   const { name, email, message } = await req.json();

//   try {
//     await resend.emails.send({
//       from: 'your@email.com',
//       to: process.env.CONTACT_DEST_EMAIL as string,
//       subject: `Contact Form from ${name}`,
//       text: `Email: ${email}\n\nMessage:\n${message}`,
//     });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to send email' },
//       { status: 500 }
//     );
//   }
// }
