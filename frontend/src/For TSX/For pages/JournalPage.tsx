import Navbar from "../components/Common Component/Navbar";
import Header from "../components/Common Component/Header";

const JournalPage = () => {
  return (
    <>
      <div style={{ paddingTop: "60px", paddingBottom: "70px" }}>
        <Header title="JOURNAL" onBack={() => window.history.back()} />
        <h3>JournalPage</h3>
        <Navbar />
      </div>
    </>
  );
};

export default JournalPage;
