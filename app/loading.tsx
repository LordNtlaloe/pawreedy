import React from 'react'
import { BeatLoader } from 'react-spinners'

const Loading = () => {
    return (
        <main className='text-center h-full w-full flex items-center justify-cent bg-transparent'>

            <div className='w-52 h-52 rounded bord flex flex-col items-center justify-center'>
                <h1 className='font-semibold mb-6'>System Busy</h1>
                <BeatLoader color="#0a09f5" size={30} />
                <h1></h1>
            </div>
        </main>
    )
}

export default Loading