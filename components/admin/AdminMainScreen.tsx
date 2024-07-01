import UserCount from "./UserCount";
import UserProfileDataComponent from "./UserProfileDataComponent";
import StaticFrontendLabel from "../../StaticFrontend";

const AdminMainScreen = () => {
  const APPLICATION_VERSION = StaticFrontendLabel.APPLICATION_VERSION;

  return (
    <>
      <div style={{ textAlign: "center", margin: "auto" }}>
        <h1>Welcome Admin!</h1>
        <h4>Application Version {APPLICATION_VERSION}</h4>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-6 col-lg-3">
            <UserCount />
          </div>

          <div className="col-6 col-lg-3">
            <UserProfileDataComponent
              column={"isProfileVerified"}
              label={"Verified Users"}
            />
          </div>

          <div className="col-6 col-lg-3">
            <UserProfileDataComponent
              column={"isLookingForRoommate"}
              label={"Looking for Roommates"}
            />
          </div>

          <div className="col-6 col-lg-3">
            <UserProfileDataComponent
              column={"isProfileComplete"}
              label={"Completed Profiles"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMainScreen;
