import { Inter } from "next/font/google";
import "./globals.css";
import ChatModal from "./chatboxmodal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chat Bot",
  description: "Created by Sean Lai Sheng Hong",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      
      </body>
    </html>
  );
}
