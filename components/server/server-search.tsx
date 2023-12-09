"use client"

import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command"
import { CommandInput } from "../ui/command"
import { useParams, useRouter } from "next/navigation"

interface ServerSearchProps{

    data: {
        label:string,
        type:"channel"|"member",
        data:{
            icon: React.ReactNode,
            name:string,
            id:string,
        }[]| undefined
    }[] 
}
const ServerSearch = (
    {data}: ServerSearchProps
) => {
    const [open,setOpen]=useState(false)
    const router=useRouter()
    const params=useParams()
    
    
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
          if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
          }
        }
    
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down)
      }, []);
    const onClick=({id,type}:{id:string,type:"channel"|"member"})=>{
        setOpen(false)
        if(type==="member"){
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }
        if(type==="channel"){
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }
    }  
    return ( 
        
        <>
            <button className="flex items-center w-full p-2 transition rounded-md group gap-x-2 hover:bg-zinc-900 dark:hover:bg-slate-600/50"
            onClick={()=>setOpen(true)}> 
                <SearchIcon className="w-4 h-4 text-zinc-600 dark:text-slate-300"/>
                <p className="text-sm transition hover:font-semibold text-zinc-500 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-slate-200">
                    Search...
                </p>
                <kbd className="inline-flex items-center h-5 gap-1 border rounded pointer-events-none select-none bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    {/**Shortcut */}
                    <span className="text-xs ">CTRL</span> i
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
               <CommandInput placeholder="Search all channels and members"/> 
               <CommandList>
                <CommandEmpty>No Results Found</CommandEmpty>
                {data.map(({label,type,data})=>{
                    if(!data?.length)return null
                    return (
                        <CommandGroup key={label} heading={label}>{data?.map(({id,icon,name})=> {
                            return(
                                <CommandItem key={id} onSelect={()=>onClick({id,type})}>
                                    {icon}
                                    <span>{name}</span>
                                </CommandItem>
                            )
                        })}
                        </CommandGroup>
                    )
                })}
               </CommandList>
            </CommandDialog>
        </>
    );
}
 
export default ServerSearch;