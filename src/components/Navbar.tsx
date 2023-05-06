import { BellIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives/avatar"
import { Button } from "@/components/ui/primitives/button"

export default function Navbar() {
  return (
    <nav className="row-span-1 flex items-center justify-end space-x-3 px-4">
      <Button variant="ghost">
        <BellIcon size={24} />
      </Button>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </nav>
  )
}
