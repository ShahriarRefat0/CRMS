// src/middleware.js
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiRoute = nextUrl.pathname.startsWith("/api")
  const publicRoutes = ["/", "/complaint", "/success", "/vote-complaint", "/contact", "/howItWorks", "/reports", "/auth/verify-otp", "/auth/forgot-password", "/auth/reset-password"];
  const isPublicRoute = nextUrl.pathname === "/" || publicRoutes.some(route => route !== "/" && (nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)));
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname)

  if (isApiRoute) {
    return null
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl))
    }
    return null
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
