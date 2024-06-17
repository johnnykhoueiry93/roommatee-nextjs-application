import "../../styles/SearchForRoom.css";
import AutocompleteSearchBar from "@/components/modals/AutocompleteSearchBar";

export default async function Protected() {
  return (
    <div>
      {/* ------------------------- TITLE  -------------------------*/}
      <div>
        <h1 className="search-bar-sub-heading">Search for a Room</h1>
      </div>

      <div className="sliding-right-to-left center-div pl-3 pr-3">
        <AutocompleteSearchBar searchRouter={'/searchListings'} nextPage={"/find-a-room-results"} profileType={''}/>
      </div>
    </div>
  );
}
