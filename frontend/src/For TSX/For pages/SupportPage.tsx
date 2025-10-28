import Navbar from "../components/Common Component/Navbar";
import Header from "../components/Common Component/Header";

const SupportPage = () => {
  return (
    <>
      <div style={{ paddingTop: "60px", paddingBottom:'70px'}}>
        <Header title="SUPPORT" onBack={() => window.history.back()} />
        <h3>SupportPage</h3>
      </div>
      <Navbar />
    </>
  );
};

export default SupportPage;
