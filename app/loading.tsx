import React from 'react'
import Image from 'next/image'

const Loading = () => {
    return (
        <main className='text-center h-screen w-full flex items-center justify-center bg-transparent'>
            <div className='w-52 h-52 flex flex-col items-center justify-center'>
                {/* <h1 className='font-semibold mb-1'>System Busy</h1> */}
                <div className="animate-blink">
                    <Image src="/images/logo01.png" alt="Loading..." width={500} height={500} className="rounded-[5px]" />
                </div>
            </div>
        </main>
    )
}

export default Loading
