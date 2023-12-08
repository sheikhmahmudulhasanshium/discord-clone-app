"use client"

import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"



export const LeaveServerModal=()=>{
    
    const {isOpen,onClose,type,data}=useModal()
    const router=useRouter()
    
    const isModalOpen = isOpen && type==="leaveServer"
    const {server} = data
    const [isLoading,setIsLoading]=useState(false)
    const onClick=async ()=>{
        try{
            setIsLoading(true)
            //open an object `${object}`
            await axios.patch(`/api/servers/${server?.id}/leave`)
            onClose()
            router.refresh()
            router.push("/")
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
                    <DialogTitle className="text-2xl font-bold text-center">Leave Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="text-indigo-600 font-semi-bold">{server?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-gray-200">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost" className="">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onClick} variant="primary" className="">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}