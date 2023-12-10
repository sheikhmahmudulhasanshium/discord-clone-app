import { Hash, Menu } from "lucide-react";
import MobileToggle from "../mobile-toggle";
interface ChatHeaderProps{
    serverId:string,
    name:string,
    type:"channel"|"conversation",
    imageUrl?:string,
}
const ChatHeader = ({serverId,name,type,imageUrl}:ChatHeaderProps) => {
    return ( 
        <div className="flex items-center h-12 px-3 font-semibold border-b-2 border-neutral-200 text-md dark:border-slate-800">
            <MobileToggle serverId={serverId}/>
            {type==="channel" && (
                <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-200"/>
                
            )}
            <p className="font-semibold text-black text-md dark:text-white">{name}</p>
        </div>
        
     );
}
 
export default ChatHeader;