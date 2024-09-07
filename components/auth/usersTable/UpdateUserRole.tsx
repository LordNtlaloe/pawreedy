import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { uppdateUserRole } from '@/app/_actions/_userActions'
import { showConfirmationMessage } from '@/lib/GeneralFunctions'



const UpdateUserRole = ({ clerkId, firstName, lastName, role }: { clerkId: string, firstName: string, lastName: string, role: string }) => {
    const [selectedValue, setSelectedValue] = useState<string>(role)
    const _updateRole = async () => {
        const result = await uppdateUserRole(clerkId, selectedValue)

        showConfirmationMessage("success", "User role was updated successfully")
    }
    return (
        <div className="flex items-center gap-2 rounded-[10px]">

            <Dialog>
                <DialogTrigger>
                    <button className="border px-1 rounded-[5px] bg-blue-700 text-white" >...</button>
                </DialogTrigger>
                <DialogContent className='bg-white rounded-[10px]'>
                    <DialogHeader>
                        <DialogTitle>Change user role:</DialogTitle>
                        <DialogDescription className=''>
                            <div className='mt-4 border-t py-4 '>
                                <div className='flex flex-col gap-4 border-b pb-4 '>
                                    <h1>First Name: <span className=' font-semibold'>{firstName}</span> </h1>
                                    <h1>Last Name: <span className='font-semibold'>{lastName}</span></h1>

                                    <h1>Current Role: <span className=' font-semibold text-red-600'>{role}</span></h1>
                                </div>
                                <div>
                                    <h1 className='font-bold my-2'>NEW ROLE: <span className='border no-underline px-2' >{selectedValue}</span></h1>
                                    <RadioGroup defaultValue="member" className='flex items-center gap-10' onValueChange={(value) => setSelectedValue(value)}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="member" id="option-one" />
                                            <Label htmlFor="member">member</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="admin" id="admin" />
                                            <Label htmlFor="admin">admin</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className='flex items-center justify-end gap-2 border-t pt-3 rounded'>
                                <Button
                                    className='bg-primary hover:bg-primary/70'
                                    onClick={_updateRole}
                                >
                                    Update
                                </Button>
                                <DialogClose>
                                    <Button className='bg-red-600 text-white rounded hover:bg-red-400 '>
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>

            </Dialog>

        </div>
    )
}

export default UpdateUserRole