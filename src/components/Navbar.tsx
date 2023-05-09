import Link from "next/link"
import { BellIcon, InboxIcon, LogOut, MenuIcon, SearchIcon, Settings } from "lucide-react"

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

function Notification() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="px-3">
          <BellIcon size={25} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" sideOffset={18} align="end">
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
  )
}

function User() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent px-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" sideOffset={18} align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">daniels</p>
            <p className="text-xs leading-none text-muted-foreground">daniels@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <Link href="#" passHref>
              Configurações
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <Link href="#" passHref>
            Sair
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Navbar() {
  return (
    <nav className="row-span-1 flex items-center p-1 lg:justify-end lg:p-2 shadow-sm z-50">
      <Button variant="ghost" className="px-3 lg:hidden">
        <MenuIcon size={25} />
      </Button>
      <Button variant="ghost" className="px-3 mr-auto">
        <SearchIcon size={25} />
      </Button>
      <Notification />
      <User />
    </nav>
  )
}
