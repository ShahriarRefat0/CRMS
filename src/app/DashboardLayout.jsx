"use client";
import Footer from "@/shared/Footer";
import Navbar from "@/shared/Navbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.toLowerCase().startsWith("/dashboard");

  return (
    <>
      {!isDashboard && (
        <header>
          <Navbar />
        </header>
      )}

      {/* isDashboard না হলে (অর্থাৎ হোম/অন্যান্য পেজ) টপ প্যাডিং ১৬ যোগ হবে। 
          ড্যাশবোর্ড পেজ হলে কোনো এক্সট্রা প্যাডিং হবে না।
      */}
      <div className={!isDashboard ? "pt-16 min-h-screen" : ""}>
        {children}
      </div>

      {!isDashboard && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}