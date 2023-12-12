"use client"

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form"
import * as z from "zod"
import axios from "axios";
import qs from "query-string"
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps{
    id:string,
    content:string,
    member:Member & {
        profile: Profile
    },
    timeStamp: string,
    fileUrl:string|null,
    deleted:boolean,
    currentMember:Member,
    isUpdated:boolean,
    socketUrl:string,
    socketQuery:Record<string,string>
}
const roleIconMap={
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="w-4 h-4 ml-2 text-indigo-900"/>,
    "ADMIN":<ShieldAlert className="w-4 h-4 ml-2 text-rose-600"/>
}

const formSchema=z.object({
    content:z.string().min(1)
})

const ChatItem = ({id,content,member,timeStamp,fileUrl,deleted,currentMember,isUpdated,socketUrl,socketQuery}:ChatItemProps) => {
    const [isEditing,setIsEditing]=useState(false)
    const {onOpen}=useModal()
    
    const form=useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            content:content
        }
    })
    const isLoading=form.formState.isSubmitting
    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
        try{
            const url=qs.stringifyUrl({
                url:`${socketUrl}/${id}`,
                query:socketQuery,
            })
            await axios.patch(url,values)
            form.reset()
            setIsEditing(false)
        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        form.reset({
            content:content,

        })
    },[content])
    
    //useeffect 2
    useEffect(()=>{
        const handleKeyDown=(event:any)=>{
            if(event.key==="Escape" || event.keyCode===27){
                setIsEditing(false)
            }
        }
        window.addEventListener("keydown",handleKeyDown)
        return ()=>window.removeEventListener("keydown",handleKeyDown)
    },[])
    const fileType=fileUrl?.split(".").pop()
    
    const isAdmin=currentMember.role===MemberRole.ADMIN
    const isModerator=currentMember.role===MemberRole.MODERATOR
    const isOwner=currentMember.id===member.id
    const canDeleteMessage=!deleted && (isAdmin||isModerator||isOwner)
    const canEditMessage=!deleted && isOwner && !fileUrl
    const isPdf=fileType==="pdf" && fileUrl
    const isImage=!isPdf && fileUrl
    //const isGuest=currentMember.role===MemberRole.GUEST


    return ( 
        <div className="relative flex items-center w-full p-4 transition group hover:bg-black/5">
            <div className="flex items-start w-full group gap-x-2">
                <div className="transition cursor-pointer hover:drop-shadow-md">
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="text-sm font-semibold cursor-pointer hover:underline">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-800 dark:text-zinc-600">{timeStamp}</span>
                    </div>
                    {isImage &&(
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-square bg-secondary">
                            <Image src={fileUrl} alt={content} fill className="object-cover"/>
                        </a>
                    )}
                    {isPdf &&(
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="w-10 h-10 fill-indigo-800 stroke-slate-400"/>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer " className="ml-2 text-sm text-indigo-800 dark:text-indigo-300 hover:underline">PDF File</a>
        
                        </div>
                    )}
                    {!fileUrl && !isEditing &&(
                        <p className={cn(
                            "text-sm text-zinc-400 dark:text-zinc-200",
                            deleted && "italic text-zinc-400 dark:text-zinc-200 text-xs mt-1"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-600 dark:text-zinc-300">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing &&(
                        <Form {...form}>
                            <form className="flex items-center w-full pt-2 gap-x-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField 
                                    control={form.control}
                                    name="content"
                                    render={({field})=>(
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input disabled={isLoading}
                                                        className="p-2 border-0 border-none dark:text-white focus-visible:ring-0 bg-zinc-300/90 dark:bg-zinc-500/75 focus-visible:ring-offset-0 text-zinc-600 " 
                                                        placeholder="Edited message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                
                                />
                                <Button disabled={isLoading} size="sm" variant="primary" >Save</Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">Press Esc to cancel, enter to save</span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="absolute items-center hidden p-1 bg-white border rounded-none group-hover:flex gap-x-2 top-2 right-5 dark:bg-zinc-900">
                    {canEditMessage && (
                        <ActionTooltip label="Edit" >
                            <Edit onClick={()=>setIsEditing(true)}
                                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-200"/>
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete" >
                            <Trash onClick={()=>onOpen("deleteMessage",{
                                apiUrl: `${socketUrl}/${id}`,
                                query:socketQuery,
                            })}
                                className="w-4 h-4 ml-auto transition cursor-pointer text-zinc-500 hover:text-zinc-600 dark:text-zinc-200"/>
                        </ActionTooltip>
                    
                </div>
            )}
        </div>
     );
}
 
export default ChatItem;