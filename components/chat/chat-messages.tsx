"use client"

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment,useRef,ElementRef } from "react";
import ChatItem from "./chat-item";
import {format}  from "date-fns"
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
const DATE_FORMAT="d-MMM-yyyy,HH:mm"
//extending MessageWiithMemberWithProfile with '&'
type MessageWithMemberWithProfile=Message & {
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
const ChatMessages = ({name,member,chatId,apiUrl,socketUrl,socketQuery,paramKey,paramValue,type,}: ChatMessagesProps) => {
    const queryKey=`chat:${chatId}`
    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status,} = useChatQuery({queryKey,apiUrl,paramKey,paramValue,});
    const addKey=`chat:${chatId}:messages`
    const updateKey=`chat:${chatId}:messages:update`
    //default value of chatRef null
     const chatRef=useRef<ElementRef<"div">>(null)
     const bottomRef=useRef<ElementRef<"div">>(null)
    useChatSocket({queryKey,addKey,updateKey})
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore:fetchNextPage,
        shouldLoadMore:!isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
        
    })
    if(status==="loading"){
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
    <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && (
        <ChatWelcome
          type={type}
          name={name}
        />
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 my-4 text-zinc-500 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-xs transition text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-200"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
 
export default ChatMessages;