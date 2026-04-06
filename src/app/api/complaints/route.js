import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Complaint from '@/models/Complaint';

export const dynamic = 'force-dynamic';

const complaintSchema = z
  .object({
    anonymous: z.boolean().optional().default(false),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((v) => !v || /^01[3-9]\d{8}$/.test(v), {
        message: 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)',
      }),
    category: z.string().min(1, 'সমস্যার ধরন বেছে নিন'),
    severity: z.string().min(1, 'সমস্যার মাত্রা বেছে নিন'),
    district: z.string().optional(),
    upazila: z.string().optional(),
    address: z.string().optional(),
    lat: z.number().nullable().optional(),
    lng: z.number().nullable().optional(),
    gpsGranted: z.boolean().optional().default(false),
    title: z.string().min(3, 'শিরোনাম কমপক্ষে ৩ অক্ষর'),
    description: z.string().min(20, 'কমপক্ষে ২০ অক্ষর লিখুন').max(2000, 'সর্বোচ্চ ২০০০ অক্ষর'),
    photos: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymous) {
      const hasIdentity = (data.name && data.name.trim().length >= 2) || (data.phone && data.phone.trim()) || (data.email && data.email.trim());
      if (!hasIdentity) {
        ctx.addIssue({
          path: ['name'],
          code: z.ZodIssueCode.custom,
          message: 'পরিচয় প্রকাশ করলে নাম/মোবাইল/ইমেইলের মধ্যে অন্তত একটি দিন',
        });
      }

      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({ path: ['email'], code: z.ZodIssueCode.custom, message: 'সঠিক ইমেইল ঠিকানা দিন' });
      }
    }
  });

export async function GET() {
  try {
    await dbConnect();
    const complaints = await Complaint.find().sort({ createdAt: -1 }).lean();

    return new Response(
      JSON.stringify({ success: true, data: complaints }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Complaints GET error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Unable to fetch complaints' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (parseError) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid JSON payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const parsed = complaintSchema.parse(body);

    await dbConnect();

    const complaint = new Complaint({
      ...parsed,
      userId: body.userId || null,
      email: parsed.email || "",
    });
    
    const ticketId = `NB-${complaint._id.toString().slice(-8).toUpperCase()}`;
    complaint.ticketId = ticketId;

    await complaint.save();

    if (process.env.NODE_ENV !== 'production') {
      console.log('Complaint saved:', complaint._id.toString(), 'ticketId:', ticketId);
    }

    return new Response(JSON.stringify({ success: true, ticketId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: error.errors[0]?.message || 'Validation error' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (error.name === 'MongoServerError' || error.name === 'CastError') {
      return new Response(JSON.stringify({ success: false, message: 'Invalid ID provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.error('Complaints API error:', error);

    return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body || {};

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Report ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await dbConnect();

    const deleted = await Complaint.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(JSON.stringify({ success: false, message: 'Report not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Report deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Complaints DELETE error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Unable to delete report' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
