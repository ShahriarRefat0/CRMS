import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: categories }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, icon, description } = await request.json();
    await dbConnect();
    const existing = await Category.findOne({ name });
    if (existing) {
        return new Response(JSON.stringify({ success: false, message: "Category already exists" }), { status: 400 });
    }
    const created = await Category.create({ name, icon, description });
    return new Response(JSON.stringify({ success: true, data: created }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updateData } = await request.json();
    await dbConnect();
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });
    return new Response(JSON.stringify({ success: true, data: updated }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      await dbConnect();
      await Category.findByIdAndDelete(id);
      return new Response(JSON.stringify({ success: true, message: "Deleted" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}
