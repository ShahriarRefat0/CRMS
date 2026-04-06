import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import DashboardLayout from "./DashboardLayout";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import SessionWrapper from "@/components/provider/SessionWrapper";
import { Toaster } from 'react-hot-toast';

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "citizen",
  description: "An online platform to prevent ragging, report incidents, and ensure student safety nationwide.",
};

export default function RootLayout({ children }) {
  return (
   <html lang="bn">
      <body className={`${hindSiliguri.variable} antialiased font-hind`}>
        <SessionWrapper>
          <ReactQueryProvider>
            <DashboardLayout>
              {children}
            </DashboardLayout>
            <Toaster position="top-center" />
          </ReactQueryProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}





