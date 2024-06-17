import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from 'next/navigation';

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
      <p
        onClick={() => handleBackToResults(prevPage)}
        className="cursor-pointer back-to-result-style"
      >
        <KeyboardBackspaceIcon/>{" "}
        <span style={{ fontWeight: "500" }}>{text}</span>
      </p>
      <hr className="mt-3" />
    </div>
  );
};

export default BackToResultsBtn;
