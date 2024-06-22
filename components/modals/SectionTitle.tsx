//@ts-ignore
/**
 * 
 * @param param0 
 * @returns 
 */
const SectionHeading = ({ title, paddingTop }) => {
    return (
        <div>
            <h3 className={`pt-${paddingTop}`}>{title}</h3>
        </div>
    )
}

export default SectionHeading;