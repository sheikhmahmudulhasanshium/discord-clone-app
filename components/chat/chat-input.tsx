"use client"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form"
import { Plus, Smile } from "lucide-react"
import { Input } from "../ui/input"
import axios from "axios"
import qs from "query-string"

interface ChatInputProps{
    apiUrl:string,
    query: Record<string, any>,
    name: string,
    type: "conversation"|"channel"
}

const formSchema = z.object({
    content: z.string().min(1),
  });
const ChatInput = ({apiUrl,query,name,type}:ChatInputProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          content: "",
        }
      });

    const isLoading =form.formState.isSubmitting
    const onSubmit =async (values:z.infer<typeof formSchema>)=>{
        try{
            const url=qs.stringifyUrl({
                url: apiUrl,
                query,
            })
            await axios.post(url,values)
        }
        catch(error){
            console.log(error)
        }
    }
    return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                    control={form.control} 
                    name="content"
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button type="button" onClick={()=>{}}
                                    className="absolute top-7 left-8  h-[24px] w-[24px] bg-zinc-500 dark:zinc-300 hover:bg-zinc-600 dark:hover:bg-zinc-500 transition rounded-full p-1 flex items-center justify-center"
                                    >
                                        <Plus className="text-white dark:text-[#35447E]"/>
                                    </button>
                                    <Input disabled={isLoading} placeholder={`Message ${type === "conversation" ? name : "#" + name}`} 
                                    className="py-6 border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-14 bg-slate-600/90 dark:bg-green-900/75 text-zinc-500 dark:text-zinc-50" {...field}/>
                                    <div className="absolute top-7 right-8 "><Smile/></div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
     );
}
 
export default ChatInput;