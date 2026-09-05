import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { CircleHelp } from 'lucide-react'

interface Props {
    genre_track:{
        genre:{
            name:string
        }
    }[]
}

const MoreDetailsGenreTooltip = (props:Props) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <CircleHelp className='w-3 h-3'/>
            </TooltipTrigger>
            <TooltipContent>
                {props.genre_track.map((item,index)=>(
                    <p className='' key={index}>{item.genre.name}</p>
                ))}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>

  )
}

export default MoreDetailsGenreTooltip