import React from 'react'
import fireInner from '../../img/fire-inner.svg'
import fireOuter from '../../img/fire-outer.svg'
export default function BurnIcon() {
  return (
    <div className='w-full pb-[100%] rounded-full bg-dark-gray  relative'>
        <img className='w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' src={fireOuter} />
        <img className='w-1/4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[25%]' src={fireInner} />     
    </div>
  )
}
