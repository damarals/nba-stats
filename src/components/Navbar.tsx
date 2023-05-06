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
    <nav className="row-span-1 flex items-center justify-end space-x-3 p-4">
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost">
            <BellIcon size={25} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" sideOffset={10} align="end">
          <div className="text-center">Notificações</div>
          <Separator />
          <div className="mt-4 flex flex-col items-center space-y-3">
            <InboxIcon size={60} className="stroke-slate-600" strokeWidth={1.5} />
            <p className="text-sm font-light">
              Sem notificações no momento, você está livre para explorar a plataforma!
            </p>
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hover:bg-transparent p-0">
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
      </div>
    </nav>
  )
}
