import React from 'react'
import Image from 'next/image'
import logo from '/public/logo01.png' // Ensure the path is correct

const Loading = () => {
    return (
        <main className='text-center h-screen w-full flex items-center justify-center bg-transparent'>
            <div className='w-52 h-52 flex flex-col items-center justify-center'>
                <h1 className='font-semibold mb-6'>System Busy</h1>
                <div className="animate-blink">
                    <Image src={logo} alt="Loading..." width={120} height={60} className="rounded-[5px]" />
                </div>
            </div>
        </main>
    )
}

export default Loading
