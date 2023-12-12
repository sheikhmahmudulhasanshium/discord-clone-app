"use client"

import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"
import {  useRouter } from "next/navigation"

import qs from "query-string";

export const DeleteMessageModal=()=>{
    
    const {isOpen,onClose,type,data}=useModal()
    const isModalOpen = isOpen && type==="deleteMessage"
    const {apiUrl,query} = data
    const [isLoading,setIsLoading]=useState(false)
    const onClick = async () => {
        try {
          setIsLoading(true);
          const url = qs.stringifyUrl({
            url: apiUrl||"",
            query,
          })
    //open an object `${object}`
          await axios.delete(url);
    
          onClose();
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    
    return(
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 overflow-auto text-black bg-white">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-2xl font-bold text-center">Delete Message</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br/> 
                        This message will be permanently deleted.
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