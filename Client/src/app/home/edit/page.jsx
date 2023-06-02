"use client"

import dynamic from "next/dynamic"
const Edit = dynamic(() => import("../../../components/Edit/edit"), {ssr:false});

const EditView = () => {
    return (
        <div>
            <Edit/>
        </div>
    )
}

export default EditView