"use client"
import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipTrigger, } 
from "./ui/tooltip"
interface ActionTooltipProps{
    label:string,
    children: React.ReactNode,
    side?: "top"|"right"|"bottom"|"left",
    align?: "start"|"center"|"end"
}
const ActionTooltip = ({
    label,
    children,
    side,
    align
}:ActionTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
             <TooltipTrigger asChild>{children}</TooltipTrigger>
             <TooltipContent side={side} align={align}>
                <p className="text-sm font-semibold capitalize">
                    {label.toLocaleLowerCase()}
                </p>
             </TooltipContent>
            </Tooltip> 
        </TooltipProvider>
    )
}
 
export default ActionTooltip;