
'use server'

import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { auth } from "@/auth"

export async function updateProfile(formData) {
  const session = await auth()

  if (!session?.user) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    await dbConnect()

    const { name, email, phone, area, nid, bio, image } = formData

    // Update user in database
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: {
          name,
          email, // User can change email too if needed, but it might mess with session
          phone,
          area,
          nid,
          bio,
          image
        }
      },
      { new: true }
    )

    if (!updatedUser) {
      return { success: false, message: "User not found" }
    }

    return { 
      success: true, 
      message: "Profile updated successfully!",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        area: updatedUser.area,
        nid: updatedUser.nid,
        bio: updatedUser.bio,
        image: updatedUser.image,
      }
    }

  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, message: "Failed to update profile." }
  }
}
