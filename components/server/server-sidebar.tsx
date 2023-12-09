import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import {ServerHeader} from "./server-header"
import { ScrollArea } from "../ui/scroll-area"
import ServerSearch from "./server-search"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"

interface ServerSidebarProps{
    serverId : string,
}
const iconMap={
  [ChannelType.TEXT]:<Hash className="w-4 h-4 mr-2"/>,
  [ChannelType.AUDIO]:<Mic className="w-4 h-4 mr-2"/>,
  [ChannelType.VIDEO]:<Video className="w-4 h-4 mr-2"/>

}
const roleIconMap={
  [MemberRole.GUEST]:null,
  [MemberRole.MODERATOR]:<ShieldCheck className="w-4 h-4 mr-2 text-indigo-400"/>,
  [MemberRole.ADMIN]:<ShieldAlert className="w-4 h-4 mr-2 text-rose-700"/>
}
export const ServerSidebar= async(
    {
        serverId
    }:ServerSidebarProps)=>{
const profile =await currentProfile()
if(!profile){
    return redirect("/")
}

const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });
const textChannels=server?.channels.filter((channel)=>channel.type===ChannelType.TEXT)
const audioChannels=server?.channels.filter((channel)=>channel.type===ChannelType.AUDIO)
const videoChannels=server?.channels.filter((channel)=>channel.type===ChannelType.VIDEO)
const members =server?.members.filter((member)=> member.profileId !== profile.id)
if(!server){
    return redirect("/")
}
const role =server.members.find((member)=>member.profileId===profile.id)?.role
    return(
        <div className="flex flex-col w-full h-full text-primary dark:bg-[#282031] bg-[#A2F3F1]">
            <ServerHeader server={server} role={role}/>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                  <ServerSearch 
                  data={[
                    {
                      label:"Text Channels",
                      type: "channel",
                      data: textChannels?.map((channel)=>({
                        id: channel.id,
                        name: channel.name,
                        icon: iconMap[channel.type],
                        
                      }))
                    },
                    
                    {
                      label:"Voice Channels",
                      type: "channel",
                      data: audioChannels?.map((channel)=>({
                        id: channel.id,
                        name:channel.name,
                        icon:iconMap[channel.type],
                        
                      }))
                    },
                    {
                      label:"Video Channels",
                      type: "channel",
                      data: videoChannels?.map((channel)=>({
                        id: channel.id,
                        name:channel.name,
                        icon:iconMap[channel.type],
                        
                      }))
                    },
                    {
                      label:"Members",
                      type: "member",
                      data: members?.map((member)=>({
                        id: member.id,
                        name:member.profile.name,
                        icon:roleIconMap[member.role],
                        
                      }))
                    }
                  ]}
                  />
                </div>
            </ScrollArea>
        </div>
    )
}