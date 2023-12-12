"use client"

import { Hash } from "lucide-react";

interface ChatWelcomeProps{
    name:string,
    type:"channel"|"conversation"
}
const ChatWelcome = ({name,type}:ChatWelcomeProps) => {
    return ( 
        <div className="px-4 mb-4 space-y-2">
            {type==="channel"&&(
            <div className="h-[75px] w-[75px] rounded-full bg-emerald-400 dark:bg-emerald-800 flex items-center justify-center">
                <Hash className="w-12 h-12 text-white"/>
            </div>
        )}
        <p className="text-xl font-bold md:text-3xl">
            {type==="channel" ?"Welcome to #":""}{name}
            
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {type==="channel" ? `This is the start of the #${name} channel.`:`This the start of your coonversatio with ${name}.`}
        </p>
        </div>
     );
}
 
export default ChatWelcome;