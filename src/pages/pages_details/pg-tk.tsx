import Activity from "../../components/activity";
import Announcement from "../../components/annoucment";
import Footer from "../../components/footer";
import Header from "../../components/header";
import NavbarDetail from "../../components/navbar-detail/NavbarDetail";

const Pgtk = () => {
  return (
    <>
      <NavbarDetail />
      <Header />
      <Announcement />
      <Activity />
      <Footer />
    </>
  );
};

export default Pgtk;
