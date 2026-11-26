import AppHeader from "../../components/AppHeader/AppHeader";
import FlightForm from "../FlightForm/FlightForm";
import WelcomeText from "../../components/WelcomeText/WelcomeText";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const AgentPage = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="agentPage">
      <div className="agentContentWrapper">
        <AppHeader />

        <WelcomeText name={user?.name} role={user?.role} />

        <FlightForm />
      </div>
    </div>
  );
};

export default AgentPage;
