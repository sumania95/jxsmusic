import { useAtom } from 'jotai'
import React from 'react'
import { playerState, playlist } from '@/state/globalState'
import { api } from '@/utils/api'
import { RiPauseLargeFill, RiPlayLargeFill } from 'react-icons/ri'
import MoreDetailsGenreTooltip from '@/components/pages/common/more-details-genre'
import Link from 'next/link'
import { PenBox } from 'lucide-react'
// import ButtonPlayPauseComponent from '../../common/button-play-pause'


interface Props {
    index_key:number,
    index:number,
    id:string,
    title:string | null,
    artist:string | null,
    in_key:string | null,
    filetype:string | null,
    bpm_start:number,
    bpm_end:number,
    release_year:number,
    is_opm:boolean,
    is_disabled:boolean,
    is_explicit:boolean,
    is_exclusive:boolean,
    genre_track:{
        genre:{
            name:string
        }
    }[]
    duration:number,
    releaseAt:Date,
    playlist:{
        id:string,
        index:number,
        title:string,
        artist:string,
        key:string,
        isFull:boolean,
    }[] | null

}

const ReleasesItem = (props:Props) => {
    const [state,setState] = useAtom(playerState)
    const {mutateAsync:signSource} = api.signedUrl.signUrlKeyBucket.useMutation()
    const [,setData] = useAtom(playlist)
    const playButton = async()=>{
        if (state.id === String(props?.id)){
            setState({
                ...state,
                playing:true
            })
        }else{
            // const previewLink = await preview({
            //     id:String(props?.id)
            // })
            setState({
                ...state,
                next:true
            })
            const isVideo = props.filetype?.includes("video")
            const previewExtension = isVideo ? "mp4" : "mp3"
            const preview_key = isVideo?`video/${props.id}.${previewExtension}`:`${props.id}.${previewExtension}`
            console.log(preview_key)
            const source = await signSource({
                id:String(props.id),
                key:preview_key,
                bucketName:"jxs-music"
            })
            setState({
                ...state,
                id:String(props?.id),
                source:String(source.url),
                playing:true,
                next:false
            })
            setData(props.playlist!)
        }
    }
    const isOpenParenthesis = String(props?.title?.trim()).includes("(")
    const explicit = `${props?.is_explicit?'Dirty':'Clean'}`
  return (
    <div className={`min-h-20 select-none w-full flex items-center justify-evenly text-zinc-900 dark:text-white px-2 md:px-5 gap-2 ${Boolean(props.index_key%2!==0)?'bg-purple-700/5 dark:bg-purple-100/20 border dark:border-white/10':'dark:bg-zinc-900/70 border dark:border-white/10'} py-2 text-sm rounded-lg`}>
        <div className='h-auto w-auto rounded-full flex items-center bg-zinc-900 border border-zinc-600 justify-center p-1 mx-2'>
            {state.playing&&state.id===String(props.id)?
                <>
                    <RiPauseLargeFill onClick={()=>{
                        setState({
                            ...state,
                            playing:false
                        })
                    }}  className="w-6 h-6 cursor-pointer p-1 text-white"/>
                </>
                    :
                <>
                    <RiPlayLargeFill onClick={playButton} className=' w-6 h-6 cursor-pointer text-white'/>
                </>
            }
        </div>
        <div className='w-full flex flex-col items-start'>
            <div className="inline-flex items-center">
                <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100">
                    {props.title?.trim()}
                    <span
                        className={`pl-1 whitespace-nowrap ${
                        Boolean(props.is_explicit) ? 'text-red-500' : 'text-green-500'
                        }`}
                    >
                        {isOpenParenthesis?explicit:`(${explicit})`}
                    </span>
                </h3>
            </div>
            <div>
                <h3>{props.artist}</h3>
            </div>
            {props.is_opm&&
                <span className={`text-xs font-medium w-10 h-5 flex items-center text-white bg-purple-700 px-1 `}>OPM</span>
            }
            
        </div>
        <div className='flex items-center gap-2 w-20 md:w-52'>
            <span className={`font-medium rounded-sm h-5 flex items-center bg-[${keyData.find((item)=>item.name===props.in_key)?.color}] px-2 md:px-3 py-4 w-12 md:w-16 text-black`}>{props.in_key}</span>
            {/* read only */}
            <span className='sr-only bg-[#FFFFFF] text-[#FFFFFF]'>--</span>
            <span className='sr-only bg-[#60F5D7]'>1A</span>
            <span className='sr-only bg-[#21ECBF]'>1B</span>
            <span className='sr-only bg-[#7DF5A3]'>2A</span>
            <span className='sr-only bg-[#3AF06D]'>2B</span>
            <span className='sr-only bg-[#ABF983]'>3A</span>
            <span className='sr-only bg-[#7AF53F]'>3B</span>
            <span className='sr-only bg-[#FED97E]'>4A</span>
            <span className='sr-only bg-[#FEC139]'>4B</span>
            <span className='sr-only bg-[#FDB9A0]'>5A</span>
            <span className='sr-only bg-[#FC8D6A]'>5B</span>
            <span className='sr-only bg-[#FDA6B1]'>6A</span>
            <span className='sr-only bg-[#FC7182]'>6B</span>
            <span className='sr-only bg-[#FDA0C7]'>7A</span>
            <span className='sr-only bg-[#FC67A5]'>7B</span>
            <span className='sr-only bg-[#F0A1E2]'>8A</span>
            <span className='sr-only bg-[#E768D1]'>8B</span>
            <span className='sr-only bg-[#D9A9FE]'>9A</span>
            <span className='sr-only bg-[#C075FF]'>9B</span>
            <span className='sr-only bg-[#B8C8FE]'>10A</span>
            <span className='sr-only bg-[#8EA5FF]'>10B</span>
            <span className='sr-only bg-[#8BE4F9]'>11A</span>
            <span className='sr-only bg-[#4BD1F8]'>11B</span>
            <span className='sr-only bg-[#5EF3EF]'>12A</span>
            <span className='sr-only bg-[#20EAE6]'>12B</span>
            {/* read only */}
            
        </div>
        <div className='hidden md:flex items-center gap-2 w-52'>
            {props.genre_track[0]?.genre.name}
            {Number(props.genre_track?.length)>1&&
            <MoreDetailsGenreTooltip genre_track={props.genre_track}/>
            }
        </div>
        <div className='hidden lg:flex w-32'>
            {props.release_year}
        </div>
        <div className='hidden md:flex w-32'>
            {props.bpm_start}
        </div>
        <div className='hidden md:flex w-32'>
            {new Date(props.releaseAt).toLocaleDateString("en-us",{
                year: "numeric", month: "numeric", day: "numeric"
            })}
        </div>
        <div className='flex items-center justify-end gap-1 w-32'>
            {/* <TrackUpdateReleasesAlertDialog id={props.id}/> */}
            <Link href={`/restricted/editor/published/${props.id}`}>
                <PenBox className='w-4 h-4 text-blue-700 dark:text-blue-200'/>
            </Link>
            {/* <AlertTrackDeleteComponent
                id={props.id}
                objectKey={String(props.download_key)}
                bucketName={String(props.storage_download[0]?.storage_download.name)}
            /> */}
        </div>
    </div>
  )
}

export default ReleasesItem

const keyData = [
    {
        id: 100,
        name: '--',
        color:'#000000',
        textColor:'#FFFFFF'
    },
    {
        id: 1,
        name: '1A',
        color:'#60F5D7',
        textColor:'#000000'
    },
    {
        id: 2,
        name: '1B',
        color:'#21ECBF',
        textColor:'#000000'
    },
    {
        id: 3,
        name: '2A',
        color:'#7DF5A3',
        textColor:'#000000'
    },
    {
        id: 4,
        name: '2B',
        color:'#3AF06D',
        textColor:'#000000'
    },
    {
        id: 5,
        name: '3A',
        color:'#ABF983',
        textColor:'#000000'
    },
    {
        id: 6,
        name: '3B',
        color:'#7AF53F',
        textColor:'#000000'
    },
    {
        id: 7,
        name: '4A',
        color:'#FED97E',
        textColor:'#000000'
    },
    {
        id: 8,
        name: '4B',
        color:'#FEC139',
        textColor:'#000000'
    },
    {
        id: 9,
        name: '5A',
        color:'#FDB9A0',
        textColor:'#000000'
    },
    {
        id: 10,
        name: '5B',
        color:'#FC8D6A',
        textColor:'#000000'
    },
    {
        id: 11,
        name: '6A',
        color:'#FDA6B1',
        textColor:'#000000'
    },
    {
        id: 12,
        name: '6B',
        color:'#FC7182',
        textColor:'#000000'
    },
    {
        id: 13,
        name: '7A',
        color:'#FDA0C7',
        textColor:'#000000'
    },
    {
        id: 14,
        name: '7B',
        color:'#FC67A5',
        textColor:'#000000'
    },
    {
        id: 15,
        name: '8A',
        color:'#F0A1E2',
        textColor:'#000000'
    },
    {
        id: 16,
        name: '8B',
        color:'#E768D1',
        textColor:'#000000'
    },
    {
        id: 17,
        name: '9A',
        color:'#D9A9FE',
        textColor:'#000000'
    },
    {
        id: 18,
        name: '9B',
        color:'#C075FF',
        textColor:'#000000'
    },
    {
        id: 19,
        name: '10A',
        color:'#B8C8FE',
        textColor:'#000000'
    },
    {
        id: 20,
        name: '10B',
        color:'#8EA5FF',
        textColor:'#000000'
    },
    {
        id: 21,
        name: '11A',
        color:'#8BE4F9',
        textColor:'#000000'
    },
    {
        id: 22,
        name: '11B',
        color:'#4BD1F8',
        textColor:'#000000'
    },
    {
        id: 23,
        name: '12A',
        color:'#5EF3EF',
        textColor:'#000000'
    },
    {
        id: 24,
        name: '12B',
        color:'#20EAE6',
        textColor:'#000000'
    },
]