import NavbarDetail from "../../../components/navbar-detail/NavbarDetail";
import { Outlet, useParams } from "react-router-dom";

const TingkatanLayout = () => {
  const { level } = useParams();

  return (
    <div>
      <NavbarDetail level={level} />
      <Outlet />
    </div>
  );
};

export default TingkatanLayout;
