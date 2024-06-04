import CircularProgress from "@mui/material/CircularProgress";

const CirculatorProgressLoader = () => {
  return (
    <div
      className='pt-2'
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default CirculatorProgressLoader;
