import { useSelector } from "react-redux";
import { Tag } from "antd";
import type { RootState } from "../../store/store";
import { UserRole } from "../../type";
import LogOutPlane from "../GoBackPlane/LogOutPlane";
import "./AppHeader.css";

const AppHeader = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const isAgent = user?.role === UserRole.Agent;

  return (
    <header className="appHeader">
      <div className="appHeaderContent">
        {user ? (
          <div className="userStatusBadge">
            <div className="userAvatar">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="userDetails">
              <span className="userNameText">{user.name}</span>
              <Tag color={isAgent ? "purple" : "blue"} className="roleBadgeTag">
                {isAgent ? "Agent" : "Traveler"}
              </Tag>
            </div>
          </div>
        ) : (
          <div />
        )}

        <LogOutPlane />
      </div>
    </header>
  );
};

export default AppHeader;
