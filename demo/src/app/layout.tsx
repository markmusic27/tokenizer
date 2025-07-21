import "@/styles/globals.css";
import localFont from "next/font/local";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Tokenizer",
  description:
    "Minimal implementation of Byte Pair Encoding algorithm for LLM tokenization.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  themeColor: "#F8F8F8",
  openGraph: {
    title: "Visual Tokenizer",
    description:
      "Minimal implementation of Byte Pair Encoding algorithm for LLM tokenization.",
    url: "https://visual-tokenizer.vercel.app",
    siteName: "Visual Tokenizer",
    images: [
      {
        url: "/thumbnail.png",
        width: 1100,
        height: 630,
        alt: "Handwritten Digit Recognition Neural Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visual Tokenizer",
    description:
      "Minimal implementation of Byte Pair Encoding algorithm for LLM tokenization.",
    images: ["/thumbnail.png"],
  },
};

const helvetica = localFont({
  src: [
    {
      path: "../../public/fonts/helvetica-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});

const sf = localFont({
  src: [
    {
      path: "../../public/fonts/sf-mono.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sf",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${helvetica.variable} ${sf.variable}`}>
      <body className="bg-[#F8F8F8] text-black">{children}</body>
    </html>
  );
}
