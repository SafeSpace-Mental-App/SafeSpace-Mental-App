import Navbar from "../components/Common Component/Navbar";
import Header from "../components/Common Component/Header";

const FeedPage = () => {
  return (
    <>
      <div style={{ paddingTop: "60px", paddingBottom: "70px" }}>
        <Header title="FEED" onBack={() => window.history.back()} />
        <h3>FeedPage</h3>
        <Navbar />
      </div>
    </>
  );
};

export default FeedPage;
