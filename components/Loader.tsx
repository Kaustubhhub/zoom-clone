import Image from 'next/image'
import React from 'react'

const Loader = () => {
    return (
        <div className='flex-center w-full h-screen'>
            <Image
                src={'/icons/loading-circle.svg'}
                alt='loading-icon'
                width={50}
                height={50}
            />
        </div>
    )
}

export default Loader
