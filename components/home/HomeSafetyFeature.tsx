import "../../styles/HomeChatFeature.css";
const SecurityImage = "/images/security-feature.png";

const HomeSafetyFeature = () => {
  return (
    <div className="">
      <div className="container container-width">
        <div className="row">
        

          <div className="col-12 col-lg-6">
            <span>SAFETY IS PRIORITY</span>
            <h1>
              Search{" "}
              <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
                {" "}
                Roommates{" "}
              </span>
              Securely and Privatly.
            </h1>
            <ul className='pt-3' style={{fontSize: '20px'}}>
              <li>Maintain privacy and security using end to end encryption.</li>
              <li>Match roommates securely and privately.</li>
            </ul>
          </div>

          <div className="col-12 col-lg-6" style={{ textAlign: "center" }}>
            <img src={SecurityImage}  width="80%" height="auto"/>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeSafetyFeature;
