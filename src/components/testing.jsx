import { useState } from "react";

export default function Testing() {
    const [count,setCount]= useState(0)


    return (
        <div className="w-full h-screen">
            <h1>{count}</h1>
            <button onClick={() => {
                const newCount = count+1
                setCount(newCount)
                }}>
        Count
            </button>
        </div>
    )
}