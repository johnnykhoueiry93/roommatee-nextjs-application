import '../../styles/SingleValue.css'

//@ts-ignore
const SingleValue = ({value, label}) => {
    return (
        <div className='single-value'>
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    )
}

export default SingleValue;