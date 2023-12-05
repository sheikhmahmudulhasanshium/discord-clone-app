import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./navigation-action";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
    const profile =await currentProfile()
    if(!profile){
        return redirect("/")
    }
const servers =await db.server.findMany({
    where: {
        members:{
            some:{
                profileId:profile.id
            }
        }
    }
})
    return ( 
        <div className="flex flex-col items-center w-full h-full space-y-4 text-primary dark:bg-[#1E1F22] py-3">
            <NavigationAction/>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700"></Separator>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server)=>(                    
                <div key={server.id} className="mb-4">
                    <NavigationItem
                    id={server.id}
                    name={server.name}
                    imageUrl={server.imageUrl}
                    />
                </div>
                )
                )}
            </ScrollArea>
            <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
                <ModeToggle/>
                <UserButton afterSignOutUrl="/" appearance={{
                    elements:{
                    avatarBox: "h-[48px] w-[48px]"
                    
                }}}
                />
                
            </div>
        </div>
     );
}
 
export default NavigationSidebar;