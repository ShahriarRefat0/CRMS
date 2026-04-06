import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import ContactMessage from '@/models/ContactMessage';

// Same schema as the client-side form validation.
const contactSchema = z
  .object({
    anonymous: z.boolean(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || /^01[3-9]\d{8}$/.test(v), {
        message: 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)',
      }),
    type: z.string().min(1, 'বিষয়ের ধরন বেছে নিন'),
    subject: z.string().min(3, 'শিরোনাম কমপক্ষে ৩ অক্ষর'),
    message: z.string().min(20, 'কমপক্ষে ২০ অক্ষর লিখুন').max(1000, 'সর্বোচ্চ ১০০০ অক্ষর'),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymous) {
      if (!data.name || data.name.trim().length < 2) {
        ctx.addIssue({ path: ['name'], code: z.ZodIssueCode.custom, message: 'নাম প্রয়োজন (কমপক্ষে ২ অক্ষর)' });
      }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({ path: ['email'], code: z.ZodIssueCode.custom, message: 'সঠিক ইমেইল ঠিকানা দিন' });
      }
    }
  });

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (parseError) {
    // This happens when the request body is not valid JSON (e.g., empty or malformed).
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid JSON payload' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const parsed = contactSchema.parse(body);

    // Persist message to MongoDB
    await dbConnect();
    const messageDoc = await ContactMessage.create(parsed);

    const ticketId = `NB-${messageDoc._id.toString().slice(-8).toUpperCase()}`;

    if (process.env.NODE_ENV !== 'production') {
      console.log('Contact message saved:', messageDoc._id.toString());
    }

    return new Response(JSON.stringify({ success: true, ticketId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || 'Invalid request data';
      return new Response(JSON.stringify({ success: false, message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log unexpected errors for debugging in dev
    console.error('Contact API error:', error);

    return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
