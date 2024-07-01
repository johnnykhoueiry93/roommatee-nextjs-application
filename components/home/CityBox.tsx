import "../../styles/CityBox.css";

//@ts-ignore
const CityBox = ({ city, image }) => {
  return (
    <div className="city-box cursor-pointer">
  <img
    className="city-box-image"
    src={image}
    alt={`Roommates in ${city}`}
    height="300px"
  />
  <h4 className="city-box-title">Roommates in {city}</h4>
  <h4 className="city-box-hover-title">{city}</h4>
</div>
  );
};

export default CityBox;
