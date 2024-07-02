import CityBox from "./CityBox";
import '../../styles/RoommatesNearMe.css'
import HomePageTitle from "./HomePageTitle";

const RoommatesNearMe = () => {
  const CityBoston = "/images/city-boston.jpg";
  const CityNewYork = "/images/city-new-york.jpg";
  const Phoenix = "/images/phoenix-city.jpg";

    return (
    <div className='pt-4 pb-5 container'>
      <HomePageTitle title={'Roommates Near Me'}/>
          

      <div className="container-custom">
        <div className="grid-container">
          <div className="grid-item"><CityBox city={'Boston'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'New York'} image={CityNewYork}/></div>
          <div className="grid-item"><CityBox city={'Los Angeles'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'Phoenix'} image={Phoenix}/></div>
          <div className="grid-item"><CityBox city={'Chicago'} image={CityBoston}/></div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid-container">
          <div className="grid-item"><CityBox city={'Houston'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'New York'} image={CityNewYork}/></div>
          <div className="grid-item"><CityBox city={'San Diego'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'San Antonio'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'Austin'} image={CityBoston}/></div>
        </div>
      </div>

      <div className="container-custom">
        <div className="grid-container">
          <div className="grid-item"><CityBox city={'Dallas'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'Fort Worth'} image={CityNewYork}/></div>
          <div className="grid-item"><CityBox city={'Colombus'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'San Francisco'} image={CityBoston}/></div>
          <div className="grid-item"><CityBox city={'Seattle'} image={CityBoston}/></div>
        </div>
      </div>
    </div>
    )
}

export default RoommatesNearMe;