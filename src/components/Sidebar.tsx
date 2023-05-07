import Link from "next/link"
import { cn } from "@/utils/cn"
import { GhostIcon, LineChartIcon } from "lucide-react"

// import { Button } from "@/components/ui/primitives/button"
import { Separator } from "@/components/ui/primitives/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/primitives/tooltip"

const itemList = [
  {
    name: "Painel de Dados",
    icon: LineChartIcon,
    active: true,
  },
  {
    name: "Outro Link",
    icon: GhostIcon,
    active: false,
  },
]

export default function Sidebar() {
  return (
    <aside className="bg-neutral-800 lg:block lg:w-20 xl:w-[17.5rem] hidden">
      <div className="p-6 space-y-3 h-56" />
      <Separator className="h-[1px] bg-slate-300/20" />
      <div className="py-5 px-2 xl:px-5 space-y-2">
        {itemList.map((item) => (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Link
                  href="#"
                  className={cn(
                    "flex items-center justify-center xl:justify-normal xl:space-x-4 rounded-lg py-2 px-3 hover:bg-slate-400/10 transition-colors",
                    item.active && "bg-slate-400/10"
                  )}
                >
                  <item.icon
                    className={cn("h-6 w-6 stroke-gray-400", item.active && "stroke-orange-400")}
                    strokeWidth={2.5}
                  />
                  <p className={cn("text-sm font-semibold text-gray-400 hidden xl:block", item.active && "text-white")}>
                    {item.name}
                  </p>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="xl:hidden -top-6 absolute whitespace-nowrap" side="left" sideOffset={14}>
                <span className="text-orange-400 font-semibold">{item.name}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </aside>
  )
}
