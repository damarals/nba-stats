export default function Dashboard() {
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
