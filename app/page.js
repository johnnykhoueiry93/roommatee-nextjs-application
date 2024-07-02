import ListingType from "../components/home/ListingType";
import RoommatesNearMe from "../components/home/RoommatesNearMe";
import HomeSafetyFeature from "../components/home/HomeSafetyFeature";
import HomeChatFeature from "../components/home/HomeChatFeature";
import RoomHighlights from "../components/home/RoomHighlights";
import RoommatesHighlight from "../components/home/RoommatesHighlight";
import CallToAction from "../components/home/CallToAction";
import '../styles/myProfile/AccountVerification.css';
import '../styles/userProfileWorkflow/Welcome.css';

export default function Home() {

  return (
    <main>
    <h1 className="search-bar-sub-heading pb-5">#1 Rommate and Tenant Finder</h1>
      <ListingType/>
      <RoomHighlights/>
      <RoommatesHighlight/>
      <CallToAction/>
      <HomeChatFeature/>
      <HomeSafetyFeature/>
      <RoommatesNearMe/>


    </main>
  );
}
