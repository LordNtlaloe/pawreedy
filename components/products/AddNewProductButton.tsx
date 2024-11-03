'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AddNewProductButton = () => {
    
    return (
        <main>
            <Link href="products/create"
                className="bg-blue-600 text-white flex p-1 px-3 rounded hover:cursor-pointer hover:bg-blue-800 items-center"
            >
                <Plus /> add New Product
            </Link>
        </main>
    )
}

export default AddNewProductButton
