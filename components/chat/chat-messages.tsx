"use client"

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import ChatItem from "./chat-item";
import {format}  from "date-fns"

const DATE_FORMAT="d-MMM-yyyy,HH:mm"
//extending MessageWiithMemberWithProfile with '&'
type MessageWiithMemberWithProfile=Message & {
    member:Member &{
        profile:Profile
    }
}
interface ChatMessagesProps{
    name:string,
    member:Member,
    chatId:string,
    apiUrl:string,
    socketUrl:string,
    socketQuery:Record<string,string>,
    paramKey:"channelId"|"conversationId",
    paramValue:string,
    type:"channel"|"conversation",

}
const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
  }: ChatMessagesProps) => {
    const queryKey=`chat:${chatId}`
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
      } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
      });
    if(status==="pending"){
        return(
            <div className="flex flex-col items-center justify-center flex-1">
                <Loader2 className="my-4 h-7 w-7 text-zinc-500 animate-spin"/>
                <p className="text-xs text-zinc-400 dark:text-zinc-300">
                    Loading messages.......
                </p>
            </div>
        )
    }
    if(status==="error"){
        return(
            <div className="flex flex-col items-center justify-center flex-1">
                <ServerCrash className="my-4 h-7 w-7 text-zinc-500 "/>
                <p className="text-xs text-zinc-400 dark:text-zinc-300">
                    Something Went Wrong!
                </p>
            </div>
        )
    }
    return ( 
        //flex-1 takes all the spaces
        <div className="flex flex-col flex-1 py-4 overflow-y-auto">
            <div className="flex-1">
                <ChatWelcome
                type={type}
                name={name}
                />
            </div>
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group,i)=>(
                    <Fragment key={i}>
                        {group.items.map((message:MessageWiithMemberWithProfile)=>(
                            <ChatItem 
                            currentMember={member}
                            member={message.member}
                            key={message.id}
                            id={message.id}
                            content={message.content}
                            fileUrl={message.fileUrl}
                            deleted={message.deleted}
                            timeStamp={format(new Date(message.createdAt),DATE_FORMAT)}
                            isUpdated={message.updatedAt!==message.createdAt}
                            socketUrl={socketUrl}
                            socketQuery={socketQuery}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
     );
}
 
export default ChatMessages;