import { Roboto } from 'next/font/google';
import React from 'react'

interface Props {
  title:string
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400']
});

const HeaderTitleComponent = (props:Props) => {
  return (
    <h3 className={`${roboto.className} py-3 md:py-0 text-xl tracking-widest uppercase font-bold`}>{props.title}</h3>
  )
}

export default HeaderTitleComponent