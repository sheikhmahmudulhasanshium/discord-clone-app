import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,
    {params}:{params:{serverId:string}}) {
    try{
        const profile=await currentProfile()
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!params.serverId){
            return new NextResponse("Sever ID Missing",{status:400})
        }

        const server =await db.server.update({
            //updating the server that are matching serverId, if the admin is not leaving the server,make sure the person who is trying to leave is a part of the members and deleting the member by using the profile list 
            where:{
                id:params.serverId,
                profileId:{
                    not:profile.id
                },
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            data:{
                members:{
                   deleteMany:{
                    profileId:profile.id
                   }
                }
            }
        })
        return NextResponse.json(server)
    }
    catch(error){
        console.log("[Sever_ID_LEAVE]",error)
        return new NextResponse("Internal Error",{status:500})
    }
}