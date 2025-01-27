import { Link } from "react-router-dom";

export default function ErrorNotFound() {
    return (
        <div>
            <h1>404 error,Page not found</h1>
            <Link className="bg-red-600" to="/">Go back home</Link>
        </div>
    )
}