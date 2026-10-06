import "./loading.css";

const Loading = () => {
  return (
    <div className="wrapper">
      <div className="orbit">
        <i className="fa-solid fa-earth-americas earth"></i>
        <div className="airplane-orbit">
          <i className="fa-solid fa-plane-up airplane"></i>
        </div>
      </div>
    </div>
  );
};

export default Loading;
