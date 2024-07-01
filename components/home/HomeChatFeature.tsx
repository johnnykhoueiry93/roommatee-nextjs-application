import "../../styles/HomeChatFeature.css";
const ChatFeatureImage = "/images/chat-feature-image.png";

const HomeChatFeature = () => {
  return (
    <div className="">
      <div className="container container-width">
        <div className="row">
          <div className="col-12 col-lg-6">
            <span>STAY CONNECTED</span>
            <h1>
              Connect Instantly with Local{" "}
              <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
                {" "}
                Roommates{" "}
              </span>
              in your Area.
            </h1>
            <ul className='pt-3' style={{fontSize: '20px'}}>
              <li>Easily connecte with rommates nearby.</li>
              <li>Match with like-minded roommates.</li>
              <li>Seamlessly manage connection with our built-in chat system.</li>
            </ul>
          </div>

          <div className="col-12 col-lg-6" style={{ textAlign: "center" }}>
            <img src={ChatFeatureImage}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeChatFeature;
