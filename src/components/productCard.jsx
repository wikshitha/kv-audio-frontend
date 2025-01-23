export default function ProductCard(props){

    console.log(props)
    return (
        <div>
            <img src={props.img}/>
            <span>{props.name}</span>
            <span>LKR. {props.price}</span>
            <p>{props.description}</p>
        </div>
    )
}