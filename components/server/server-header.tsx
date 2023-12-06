"use client"

import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole} from "@prisma/client"
import { DropdownMenu,DropdownMenuContent, DropdownMenuTrigger,DropdownMenuItem } from "../ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { DropdownMenuSeparator } from "../ui/dropdown-menu"

interface ServerHeaderProps{
    server: ServerWithMembersWithProfiles
    role?: MemberRole
}
export const ServerHeader = ({
    server,
    role,
}:ServerHeaderProps) => {
    const isAdmin=role===MemberRole.ADMIN
    const isModerator=isAdmin||role===MemberRole.MODERATOR

    
    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="flex items-center w-full h-12 px-3 font-semibold transition border-b-2 border-neutral-200 text-md dark:border-neutral-900 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
                    {server.name}
                    <ChevronDown className="w-5 h-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-300 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem 
                    className="px-3 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-800">
                        
                        Invite People
                        <UserPlus className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                    className="px-3 py-2 text-sm cursor-pointer dark:text-indigo-800">
                        
                        Server Settings
                        <Settings className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem 
                    className="px-3 py-2 text-sm cursor-pointer dark:text-indigo-800">
                        
                        Manage Members
                        <Users className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem 
                    className="px-3 py-2 text-sm cursor-pointer dark:text-indigo-800">
                        
                        Create Channel
                        <PlusCircle className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator &&(
                    <DropdownMenuSeparator/>
                )}
                {isAdmin&&(
                    <DropdownMenuItem 
                    className="px-3 py-2 text-sm cursor-pointer text-rose-500">
                        
                        Delete Server
                        <Trash className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                    
                )}
                {!isAdmin&&(
                    <DropdownMenuItem 
                    className="px-3 py-2 text-sm cursor-pointer text-rose-500">
                        
                        Leave Server
                        <LogOut className="w-4 h-4 ml-auto"/>
                    </DropdownMenuItem>
                    
                )}
            </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
