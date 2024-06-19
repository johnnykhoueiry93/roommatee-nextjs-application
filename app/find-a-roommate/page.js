import "../../styles/SearchForRoom.css";
import AutocompleteSearchBar from "@/components/modals/AutocompleteSearchBar";

export default async function Protected() {
  return (
    <div>
      {/* ------------------------- TITLE  -------------------------*/}
      <div>
        <h1 className="search-bar-sub-heading">Search for a Roommate</h1>
      </div>

      <div className="sliding-right-to-left center-div">
        <AutocompleteSearchBar searchRouter={'/searchProfile'} nextPage={"/find-a-roommmate-results"} profileType={'roommate'}/>
      </div>
    </div>
  );
}
