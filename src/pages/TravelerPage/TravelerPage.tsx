import GoBackPlane from "../../components/GoBackPlane/GoBackPlane";

function TravelerPage() {
  return (
    <div className="userPageWrapper">
      <GoBackPlane
        onClick={() => {
          localStorage.removeItem("accessToken");
        }}
      />

      <p>welcome to traveler page</p>
    </div>
  );
}

export default TravelerPage;
