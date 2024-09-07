
import { getAllProducts } from '@/app/_actions/_productsActions'
import ChangeProductStatus from '@/components/products/ProductActions/ChangeProductStatus'
import UpdateProduct from '@/components/products/ProductActions/UpdateProduct';
import { productTableColumns } from '@/components/products/productsTable/ProductColumns';
import { DataTable } from '@/components/general/datatable'
import React from 'react'

const getBusineses = async () => {
    const productes = await getAllProducts()
    return productes
}

const ProductPages = async ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
    const columns = productTableColumns
    const data = await getBusineses()

    const action = searchParams?.action
    const id = searchParams?.id as string

    return (
        <main>
            <DataTable data={data} columns={columns} />
            {action === "update info" ? <UpdateProduct id={id} /> :
                action === "change status" ? <ChangeProductStatus id={id} /> : null}
        </main>
    )
}

export default ProductPages