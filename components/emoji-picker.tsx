"use client"
import {Popover, PopoverContent,PopoverTrigger} from "./ui/popover"
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from "next-themes";

interface EmojiPickerProps{
    onChange:(value:string)=>void
}
const EmojiPicker = ({onChange,}:EmojiPickerProps) => {
    const {resolvedTheme}=useTheme()
    return (  
        <Popover>
            <PopoverTrigger>
                <Smile className="transition text-zinc-50 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-200"/>
            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={40} 
                className="mb-16 bg-transparent border-none shadow-none drop-shadow-none"
            >
              <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji:any)=> onChange(emoji.native)}/> 
            </PopoverContent>
        </Popover>
    );
}
 
export default EmojiPicker;