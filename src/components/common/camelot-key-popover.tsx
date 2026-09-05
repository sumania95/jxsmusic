import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ChevronDown } from 'lucide-react';
import CamelotWheelComponent from './camelot-key';

const CamelotKeyPopoverComponent = () => {
 
  return (
    <Popover>
        <PopoverTrigger id="key" aria-label="key"className='flex items-center dark:bg-zinc-800/50 justify-between px-2 py-1 border border-zinc-700/50 rounded-md gap-3'>
            Key
            <ChevronDown className='w-4 h-4'/>
        </PopoverTrigger>
        <PopoverContent align='end' className='flex flex-col text-center w-[300px] h-[330px] md:h-[390px] md:w-[350px] border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'>
            <h3 className='-mb-10 md:-mb-2'>CAMELOT WHEEL</h3>
            <CamelotWheelComponent/>
        </PopoverContent>
    </Popover>
  )
}

export default CamelotKeyPopoverComponent