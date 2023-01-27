
export default function Tag({onClick, name}){

    return (
        <div onClick={onClick} className="vtag">#{name}</div>
    );
    
}