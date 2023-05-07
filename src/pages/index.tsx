import { useEffect, useState } from "react"
import { type NextPage } from "next"
import Head from "next/head"
import Rive from "@rive-app/react-canvas"

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"

function Dashboard() {
  return (
    <section className="row-span-14 grid grid-rows-6 gap-4 p-4 bg-slate-100">
      <div className="grid gap-4 grid-cols-10 row-span-2">
        <div className="flex items-center justify-center rounded-md bg-white px-6 py-4 shadow-lg col-span-5 md:col-span-3"></div>
        <div className="flex flex-col space-y-2 rounded-md bg-white p-6 shadow-lg col-span-5 md:col-span-7"></div>
      </div>
      <div className="grid gap-4 grid-cols-12 row-span-4">
        <div className="flex flex-col rounded-md bg-white px-6 py-4 shadow-lg col-span-full lg:col-span-8 2xl:col-span-9"></div>
        <div className="hidden lg:flex flex-col justify-between space-y-6 rounded-md bg-white p-8 shadow-lg lg:col-span-4 2xl:col-span-3"></div>
      </div>
    </section>
  )
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Rive src="basketball-bounce.riv" className="w-48 h-48" />
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
          <Dashboard />
        </div>
      </div>
      <TailwindIndicator />
    </>
  )
}

export default Home
