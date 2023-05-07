import { type AppType } from "next/app"
import { Inter } from "next/font/google"
import { api } from "@/utils/api"
import { Analytics } from "@vercel/analytics/react"

import "@/styles/globals.css"
import { Provider } from "jotai"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

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
        <Provider>
          <Component {...pageProps} />
        </Provider>
        <Analytics />
      </main>
    </>
  )
}

export default api.withTRPC(MyApp)
