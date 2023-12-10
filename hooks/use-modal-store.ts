import { ChannelType, Server,Channel } from "@prisma/client"
import {create} from "zustand"
export type ModalType ="createServer"|"invite"|"editServer"|"members"|"createChannel"|"leaveServer"|"deleteServer"|"deleteChannel"
interface ModalData{
    //'?' means optional, if it is found the type will be
    server?: Server
    channel?:Channel
    channelType?:ChannelType
}
interface ModalStore{
    type: ModalType|null
    data: ModalData
    isOpen: boolean
    onOpen: (type: ModalType, data?:ModalData)=> void
    onClose: ()=> void
}

export const useModal= create<ModalStore>((set)=>({
    type:null,
    data:{},
    isOpen:false,
    onOpen:(type,data={}) =>set({isOpen:true,type,data}),
    onClose: ()=> set({type:null,isOpen:false})
}))