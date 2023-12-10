import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//editing code as such the general page will be loaded at first as conversation
interface ServerIdPageProps{
    params:{
        serverId:string
    }
}
const ServerIdPage =async ({params}:ServerIdPageProps) => {
    const profile=await currentProfile()
    if(!profile){
        return redirectToSignIn()
    }
    const server = await db.server.findUnique({
        where:{
            id:params.serverId,
            members:{
                some:{
                    profileId:profile.id,
                }
            }
        },
        include:{
            channels:{
                where:{
                    name:"general"
                },
                orderBy:{
                    createdAt:"asc"
                }
            }
        }
    })

    const initialChannel=server?.channels[0]
    if(initialChannel?.name!=="general"){
        return null
    }
    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
    return ( 
        <div>Server Id Page</div>
     );
}

export default ServerIdPage;
