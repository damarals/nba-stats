import { type NextPage } from "next"
import Head from "next/head"

import Dashboard from "@/components/Dashboard"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex h-screen">
        <Sidebar />
        <div className="grid flex-grow grid-rows-15 bg-white">
          <Navbar />
          <Dashboard />
        </div>
      </div>
      <TailwindIndicator />
    </>
  )
}

export default Home
