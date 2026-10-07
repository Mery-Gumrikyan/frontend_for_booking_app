import GoBackPlane from "../../components/GoBackPlane/GoBackPlane";

const AgentPage = () => {
  return (
    <div>
      <GoBackPlane
        onClick={() => {
          localStorage.removeItem("accessToken");
        }}
      />

      <p>Welcome, , you entered as travel agent</p>
    </div>
  );
};

export default AgentPage;
