import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-sans: ${inter.variable};
          }
        `}
      </style>
      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
        <Analytics />
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
