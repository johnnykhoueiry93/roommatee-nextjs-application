import CircularProgress from "@mui/material/CircularProgress";

/**
 * Provide a message to display on top of the <CircularProgress />
 */
const MessageComponentLoader = ({loadingMessage}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Ensure the container fills the screen height
      }}
    >
      <div style={{ marginBottom: '16px' }}>{loadingMessage}</div>
      <CircularProgress />
    </div>
  );
};

export default MessageComponentLoader;
