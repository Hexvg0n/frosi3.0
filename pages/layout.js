import { Inter } from "next/font/google";
//import "../public/css/globals.css"; 
import Head from "next/head";
import {metadata} from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FrosiReps",
  description: "Strona internetowa Frosi3.0",
  icons: {
    icon:[
      '/favicon.ico'
    ],
    apple:[
      '/apple-touch-icon.png'
    ],
    shortcuts:[
      '/apple-touch-icon.png'
    ]
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
