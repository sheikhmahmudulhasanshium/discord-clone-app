"use client"
import axios from 'axios'
import * as z from "zod"
import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem    
} from "@/components/ui/form"

import { Button } from "../ui/button"
import FileUpload from "../file-upload"
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'

const formSchema=z.object({
   
    fileUrl:z.string().min(1,
        {
            message: "Attachment is required"
        })
})
export const MessageFileModal=()=>{
    
    const {isOpen,onClose,type,data}=useModal()
    const router =useRouter()
    
    const isModalOpen=isOpen && type ==="messageFile"
    const {apiUrl,query}=data
    const form=useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            fileUrl:"",
        }
    })
    
    const handleClose=()=>{
        form.reset()
        onClose()
    }
    
const isLoading=form.formState.isSubmitting
const onSubmit = async (values:z.infer<typeof formSchema>)=>{
    try{
        //generate URL
        const url= qs.stringifyUrl({
            //there is a posibility that url does not have been passed
            url:apiUrl||"",
            query,
        })
        await axios.post(url,{...values,content:values.fileUrl})
        form.reset()
        router.refresh()
        handleClose()
    }
    catch(error){
        console.log(error)
 
    }
}
    return(
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="p-0 overflow-auto text-black bg-white">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-2xl text-center">Add an attachment</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500"> Send  a file as message</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="px-6 space-y-8">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                control={form.control}
                                name="fileUrl"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl><FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange}/></FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter className="px-6 py-4 bg-gray-100">
                            <Button variant={"primary"} disabled={isLoading}>Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}