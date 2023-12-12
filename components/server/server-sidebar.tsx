import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelType, MemberRole } from "@prisma/client"
import { redirect } from "next/navigation"
import {ServerHeader} from "./server-header"
import { ScrollArea } from "../ui/scroll-area"
import ServerSearch from "./server-search"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { Separator } from "../ui/separator"
import ServerSection from "./server-section"
import SeverChannel from "./server-channel"
import ServerChannel from "./server-channel"
import ServerMember from "./server-member"

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
                {/**Searchbar */}
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
                <Separator className="my-2 rounded-md bg-zinc-400 dark:bg-zinc-700"/>
                {!!textChannels?.length && (
                  <div className="mb-2">
                    <ServerSection 
                    sectionType="channels"
                    channelType={ChannelType.TEXT}
                    role={role}
                    label="Text Channels"
                    />
                    {textChannels.map((channel)=>(
                      <div className="space-y-[2px]" key={channel.id}>
                        <ServerChannel key={channel.id} channel={channel} role={role}  server={server}/>
                      </div>
                    ))}
                  </div>
                )}
                {!!audioChannels?.length && (
                  <div className="mb-2">
                    <ServerSection 
                    sectionType="channels"
                    channelType={ChannelType.AUDIO}
                    role={role}
                    label="Voice Channels"
                    />
                    {audioChannels.map((channel)=>(
                      <div className="space-y-[2px]" key={channel.id}>
                        <ServerChannel key={channel.id} channel={channel} role={role}  server={server}/>
                      </div>
                    ))}
                  </div>
                )}
                {!!videoChannels?.length && (
                  <div className="mb-2">
                    <ServerSection 
                    sectionType="channels"
                    channelType={ChannelType.VIDEO}
                    role={role}
                    label="Video Channels"
                    />
                    {videoChannels.map((channel)=>(
                      <div className="space-y-[2px]" key={channel.id}>

                        <ServerChannel key={channel.id} channel={channel} role={role}  server={server}/>
                      </div>
                    ))}
                  </div>
                )}
                {!!members?.length && (
                  <div className="mb-2">
                    <ServerSection 
                    sectionType="members"
                    role={role}
                    label="Members"
                    server={server}
                    />
                    {members.map((member)=>(
                      <div className="space-y-[2px]" key={member.id}>
                        <ServerMember key={member.id} 
                        member={member} server={server} />
                      </div>
                    ))}
                  </div>
                )}
            </ScrollArea>
        </div>
    )
}