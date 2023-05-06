import { cn } from "@/utils/cn"

export default function BallLoader() {
  return (
    <div className="relative">
      {/* ball bounce */}
      <div className="h-14 w-14 animate-ball-bounce">
        {/* ball spin */}
        <div
          className={cn(
            "absolute z-10 h-14 w-14 animate-ball-spin overflow-hidden rounded-[50%] border-2 border-black bg-orange-500",
            "before:content-[''] before:absolute before:bg-black before:w-14 before:-left-0.5 before:h-0.5 before:top-[25px] before:rotate-45",
            "after:content-[''] after:absolute after:bg-black after:w-14 after:-left-0.5 after:h-0.5 after:top-[25px] after:-rotate-45"
          )}
        >
          <div
            className={cn(
              "absolute rounded-[50%] border-2 border-black w-[50px] h-[50px] -left-5 -top-5",
              "before:content-[''] before:absolute before:rounded-[50%] before:border-2 before:border-black before:w-[50px] before:h-[50px] before:top-10 before:left-10"
            )}
          />
        </div>
      </div>
      <div className="absolute top-14 h-2 w-14 animate-shadow-scale rounded-[50%] bg-black/20" />
    </div>
  )
}
