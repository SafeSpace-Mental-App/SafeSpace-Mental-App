import Navbar from "../components/Common Component/Navbar";
import Header from "../components/Common Component/Header";
import React from "react";
import styles from "./FeedPage.module.css";
import SearchBar from "../components/Common Component/SearchBar";
import CategoryTabs from "../components/Common Component/CategoryTabs";
import PostCard from "../components/Common Component/PostCard";

const FeedPage: React.FC = () => {
  return (
    <div className={styles.feedContainer}>
      {/* Header */}
      <Header title="" />

      {/* Search & Tabs */}
      <div className={styles.searchSection}>
        <SearchBar />
        <CategoryTabs />
      </div>

      {/* Posts */}
      <div className={styles.postsSection}>
        {/* Later we’ll map posts here */}
        <PostCard />
        <PostCard />
        <PostCard />
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
};

export default FeedPage;
