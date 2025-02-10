import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function AdminItemspage() {

    const [items, setItems] = useState([]);

    return (
        <div className="w-full h-full relative">
            <table>
                <thead>
                    
                    <th>Key</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Dimensions</th>
                    <th>Availability</th>
                    
                </thead>
                <tbody>
                   {
                    items.map((product)=>{
                        console.log(product);
                        return (
                            <tr key={product.key}>
                                <td>{product.key}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.dimensions}</td>
                                <td>{product.availability}</td>
                            </tr>
                        )
                    }) 
                   }
                </tbody>
            </table>

            <Link to="/admin/items/add">
            <CiCirclePlus className="text-[50px] absolute right-2 bottom-2 hover:text-red-600"/>
            </Link>
        </div>
    )
}