import { useAtom } from 'jotai'
import { Volume1Icon, Volume2Icon, VolumeX } from 'lucide-react'
import React from 'react'
import { SliderPlayer } from '@/components/ui/slider-player'
import { playerState } from '@/state/globalState'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

const VolumePlayerComponent = () => {
    const [state,setState] = useAtom(playerState)
    const handleMute = () => {
        if(Math.round(state.volume*100)>0){
            setState({
                ...state,
                volume:0
            })
        }else{
            setState({
                ...state,
                volume:1
            })
        }
    };
  return (
    <Popover>
        <PopoverTrigger>
                {Math.round(state.volume*100)==0?
                <VolumeX className='w-6 h-6'/>
                :
                <>
                    {Math.round(state.volume*100)>50?
                    <Volume2Icon className='w-6 h-6'/>
                    :
                    <Volume1Icon className='w-6 h-6'/>
                    }
                </>
                }
        </PopoverTrigger>
        <PopoverContent className='h-14 w-64 px-3 mb-4 gap-2 flex items-center justify-center dark:bg-zinc-900 border dark:border-zinc-700'>
                {Math.round(state.volume*100)==0?
                <VolumeX className='w-6 h-6 cursor-pointer' onClick={handleMute}/>
                :
                <Volume2Icon className='w-6 h-6 cursor-pointer' onClick={handleMute}/>
                }
                <SliderPlayer defaultValue={[state.volume]} value={[state.volume]} max={1} step={0.01} minStepsBetweenThumbs={1} onValueChange={async(e)=>{
                //   etState('bpm',e)
                setState({
                    ...state,
                    volume:Number(e[0])
                })
                }} className=' cursor-pointer w-full my-2 h-full'/>
                <h3 className='dark:text-zinc-300 text-start w-8'>{Math.round(state.volume*100)}</h3>
        </PopoverContent>
    </Popover>
    // <TooltipProvider>
    //     <Tooltip>
    //         <TooltipTrigger className='flex items-center gap-2'>
                
    //         </TooltipTrigger>
    //         <TooltipContent side='top' className='h-10 w-52 px-1 mb-4 gap-1 flex items-center justify-center bg-zinc-900 border border-zinc-700'>
                
    //         </TooltipContent>
    //     </Tooltip>
    // </TooltipProvider>
  )
}

export default VolumePlayerComponent