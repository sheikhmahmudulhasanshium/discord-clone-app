"use client"
import { useSocket } from "./providers/socket-provider"
import { Badge } from "./ui/badge"
const SocketIndicator = () => {
    const {isConnected}=useSocket()
    if(!isConnected){
        return(
            <Badge variant="outline" className="text-white bg-yellow-600 border-none">
                Fallback: Polling every 1sec
            </Badge>
        )
    }
    return(
        <Badge variant="outline" className="text-white border-none bg-emerald-600">
            Live: Real time updates
        </Badge>
    )
    }
 
export default SocketIndicator;