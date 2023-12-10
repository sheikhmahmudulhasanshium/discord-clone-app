import { db } from "./db";
const getOrCreateConversation = async(memberOneId:string,memberTwoId:string) => {
    let conversation=await findConversation(memberOneId,memberTwoId)|| await findConversation(memberTwoId,memberOneId)
    //if there is no conversation a new conversation needs to be created
    if(!conversation){
        conversation=await createNewConversation(memberOneId,memberTwoId)
    }
    return conversation
}
 
export default getOrCreateConversation;

const findConversation=async (memberOneId:string,memberTwoId:string) => {
try{    return await db.conversation.findFirst({
        where:{
            AND:[
                {memberOneId:memberOneId},
                {memberTwoId:memberTwoId},

            ]
        },
        include:{
            memberOne:{
                include:{
                    profile:true
                }
            },
            memberTwo:{
                include:{
                    profile:true
                }
            }
        },
    })
}
catch{
    return null
}
}

const createNewConversation=async (memberOneId:string,memberTwoId:string)=>{
    try{
        return await db.conversation.create({
            data:{
                memberOneId,
                memberTwoId,
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }

        })
    }
    catch{
        return null
    }
}