'use client'

import { ColumnDef } from "@tanstack/react-table";


export type User = {
    _id: string
    userEmail: string
    userSurname: string
    userOtherNames: string
    userPhoneNumber: string

};

export const usersTableColumns: ColumnDef<User>[] = [
    {
        accessorKey: "userSurname",
        header: "Surname"
    },

    {
        accessorKey: "userOtherNames",
        header: "Other Names"
    },
    {
        accessorKey: "userEmail",
        header: "Email"
    },
    {
        accessorKey: "userPhoneNumber",
        header: "Phone Number"
    },
]