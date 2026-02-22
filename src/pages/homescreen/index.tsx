import Announcement from "../../components/annoucment";
import Announcement2 from "../../components/annoucment2";
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Welcome from "../../components/welcome";
import Activity from "../../components/activity/index";
import Footer from "../../components/footer";
import HeaderInfo from "../../components/header-info";

const HomeScreen = () => {
	return (
		<div>
			<Navbar />
			<Header />
			<Welcome />
			<HeaderInfo />
			<Announcement />
			<Activity />
			<Announcement2 />
			<Footer />
		</div>
	);
};

export default HomeScreen;
