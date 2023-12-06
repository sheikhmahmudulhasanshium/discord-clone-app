"use client"

import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check, Copy, RefreshCw } from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"
import { useState } from "react"
import axios from "axios"



export const InviteModal=()=>{
    
    const {onOpen,isOpen,onClose,type,data}=useModal()
    const origin=useOrigin()
    
    const isModalOpen = isOpen && type==="invite"
    const {server} = data
    const [copied,setCopied]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    const onCopy=()=>{
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        
        setTimeout(()=>{
            setCopied(false)
        },1000)
    }
    const inviteUrl=`${origin}/invite/${server?.inviteCode}`
    // Generate new invitation link
    const onNew= async ()=>{
        try{
            setIsLoading(true)
            const response=await axios.patch(`/api/servers/${server?.id}/invite-code`)
            onOpen("invite",{server:response.data})
        }
        catch(error){
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }

    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 overflow-auto text-black bg-white">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-2xl font-bold text-center">Invite Friends</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/75 " >Server Invite Link</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} className="text-black border-0 bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0" value={inviteUrl}/>
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied?<Check className="w-4 h-4"/>:<Copy className="w-4 h-4"/>}
                            
                        </Button>
                    </div>
                    <Button disabled={isLoading} onClick={onNew} variant="link" size="sm" className="mt-4 text-xs text-zinc-500">Generate a new link <RefreshCw className="w-4 h-4 ml-2"/></Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}