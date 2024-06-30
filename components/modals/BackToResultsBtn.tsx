import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from 'next/navigation';
import "../../styles/BackToResults.css";

//@ts-ignore
const BackToResultsBtn = ({ prevPage, text }) => {
  const router = useRouter();
  const navigateToPage = (path) => {
    router.push(path);
  };

  //@ts-ignore
  function handleBackToResults(prevPage) {
    navigateToPage(prevPage);
  }

  return (
    <div>
      <p className="back-to-result-style">
        <KeyboardBackspaceIcon className='cursor-pointer'/>
        <span className='cursor-pointer' onClick={() => handleBackToResults(prevPage)} style={{ fontWeight: "500" }} > {text}</span>
      </p>
      <hr className="mt-3" />
    </div>
  );
};

export default BackToResultsBtn;
