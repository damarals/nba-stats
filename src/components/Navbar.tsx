import Link from "next/link"
import { BellIcon, InboxIcon, LogOut, Settings } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/primitives/avatar"
import { Button } from "@/components/ui/primitives/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/primitives/popover"
import { Separator } from "@/components/ui/primitives/separator"

export default function Navbar() {
  return (
    <nav className="row-span-1 flex items-center justify-end p-2">
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost" className="px-3">
            <BellIcon size={25} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" sideOffset={10} align="end">
          <div className="text-center font-medium text-sm">Notificações</div>
          <Separator />
          <div className="mt-4 flex flex-col items-center space-y-3">
            <InboxIcon size={40} className="stroke-slate-600" strokeWidth={1.5} />
            <p className="text-xs font-light text-center">
              Sem notificações no momento, você está livre para explorar a plataforma!
            </p>
          </div>
        </PopoverContent>
      </Popover>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="hover:bg-transparent px-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44" sideOffset={10} align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">daniels</p>
              <p className="text-xs leading-none text-muted-foreground">daniels@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <Link href="#" passHref>
                Configurações
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <Link href="#" passHref>
              Sair
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
