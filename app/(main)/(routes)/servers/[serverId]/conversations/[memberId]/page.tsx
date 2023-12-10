import ChatHeader from "@/components/chat/chat-header";
import getOrCreateConversation from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface memberIdPageProps{
    params:{
        memberId: string,
        serverId: string,
    }
}
const memberIdPage = async ({params}:memberIdPageProps) => {
    const profile=await currentProfile()
    
    if(!profile){
        return redirectToSignIn
    }

    const currentMember= await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id
        },
        include:{
            profile:true
        }
    })
    if(!currentMember){
        return redirect("/")
    }
    const conversation=await getOrCreateConversation(currentMember.id,params.memberId)
    if(!conversation){
        return redirect(`/servers/${params.serverId}`)
    }

    //if we managed to find conversation let extract member1 then member2 
    const {memberOne,memberTwo}=conversation
    const otherMember=memberOne.profileId===profile.id?memberTwo:memberOne
    return ( 
        <div className="bg-white dark:bg-[#324323] flex flex-col h-full">
            <ChatHeader
            imageUrl={otherMember.profile.imageUrl}
            name={otherMember.profile.name}
            serverId={params.serverId}
            type="conversation"
            />
        </div>
     );
}
 
export default memberIdPage;