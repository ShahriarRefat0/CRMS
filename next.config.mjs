/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Next.js Compiler configuration
  reactCompiler: {
    compilationMode: "infer",
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', // Postimg এর জন্য
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ImgBB এর জন্য (খুবই জরুরি)
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // গুগল প্রোফাইল ছবির জন্য (খুবই জরুরি)
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash এর জন্য
      },
    ],
  },
};

export default nextConfig;