import { useEffect, useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"

import BallLoader from "@/components/BallLoader"
import Dashboard from "@/components/Dashboard"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <BallLoader />
  }

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
