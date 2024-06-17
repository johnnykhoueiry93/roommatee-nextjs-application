import ResultsSearchBar from '../../components/search/ResultsSearchBar'
import FiltersBar from '@/components/modals/FiltersBar';
import SearchResults from '@/components/search/SearchResults';

export default async function Protected() {
  return (
    <div>
      {/* <ResultsSearchBar /> */}
      {/* <FiltersBar filterRouter={"listings"} /> */}
      <SearchResults/>


    </div>
  );
}
