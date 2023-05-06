import { useEffect, useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"

import BallLoader from "@/components/BallLoader"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

const Home: NextPage = () => {
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false)
  //   }, 6000)
  //   return () => clearTimeout(timer)
  // }, [])

  if (true) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BallLoader />
      </div>
    )
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
          {/* Main section */}
          <section className="row-span-14"></section>
        </div>
      </div>
    </>
  )
}

export default Home
