import React from 'react'

type Props = {
  title: string
  description?: string
}

const BannerTitleComponent = ({ title,description }: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      <h3 className='flex pt-5 text-xl md:text-3xl font-bold'>{title}</h3>
      {description&&<span className='text-xs text-zinc-700 dark:text-zinc-400'>{description}</span>}
    </div>
  )
}

export default BannerTitleComponent
