"use client"
import qs from 'query-string'
import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { ServerWithMembersWithProfiles } from "@/types"
import { ScrollArea } from "../ui/scroll-area"
import { UserAvatar } from "../user-avatar"
import { Check, Gavel,  Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"
import { useState } from "react"
import {DropdownMenu, DropdownMenuContent,DropdownMenuItem,DropdownMenuPortal,DropdownMenuTrigger,DropdownMenuSeparator,DropdownMenuSubContent,DropdownMenuSubTrigger, DropdownMenuSub} from "../ui/dropdown-menu"
import { MemberRole } from "@prisma/client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
const roleIconMap={
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="w-4 h-4 ml-2 text-indigo-600"/>,
    "ADMIN":<ShieldAlert className="w-4 h-4 ml-2 text-rose-600"/>
    
}

export const MembersModal=()=>{
    const router =useRouter()
    const {onOpen,isOpen,onClose,type,data}=useModal()
    const [loadingId,setLoadingId]=useState("")
    const isModalOpen = isOpen && type==="members"
    const {server} = data as {server: ServerWithMembersWithProfiles}
    
    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
          setLoadingId(memberId);
          const url = qs.stringifyUrl({
            url: `/api/members/${memberId}`,
            query: {
              serverId: server?.id,
            }
          });
    
          const response = await axios.patch(url, { role });
    
          router.refresh();
          onOpen("members", { server: response.data });
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingId("");
        }
      }
    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-auto text-black bg-white ">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} Members
                    </DialogDescription>                
                
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member)=>
                        <div key={member.id} className="flex items-center mb-6 gap-x-2">
                            <UserAvatar src={member.profile.imageUrl}/>
                            <div className="flex flex-col gap-y-1">
                                <div className="flex items-center text-xs font-semibold gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-700">
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !==member.profileId && loadingId !==member.id &&(
                                <div className="ml-auto">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="w-4 h-4 text-zinc-600"/>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestion className="w-4 h-4 mr-2"/>
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={()=>onRoleChange(member.id,"GUEST")}>
                                                                <Shield className="w-4 h-4 mr-2"/>
                                                                Guest
                                                                {member.role==="GUEST" && <Check className="w-4 h-4 ml-auto"/>}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={()=>onRoleChange(member.id,"MODERATOR")}>
                                                                <ShieldCheck className="w-4 h-4 mr-2"/>
                                                                Moderator
                                                                {member.role==="MODERATOR" && <Check className="w-4 h-4 ml-auto"/>}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem>
                                                    <Gavel className="w-4 h-4 mr-2"/>
                                                    Kick
                                                </DropdownMenuItem>
                                                
                                            </DropdownMenuContent>
                                        </DropdownMenuTrigger>
                                     </DropdownMenu>
                                     
                                </div>
                            )}
                            {loadingId===member.id &&
                                <Loader2 className="w-4 h-4 ml-auto animate-spin text-zinc-500"/>
                            }
                        </div>
                    )}
                </ScrollArea>    
            </DialogContent>
        </Dialog>
    )
}