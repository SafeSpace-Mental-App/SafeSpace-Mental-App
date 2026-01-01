import type { journalPost } from "../../../For Types/posttype";
import { useJournalLocalStorage } from "../hooks/useJournalstorage";
import { useEffect, useCallback } from "react";
import axiosInstance from "../../../../api/axiosInstance";

const LOCAL_KEY = "userpost";

export const useJournalFeed = () => {
  const [posts, setPosts] = useJournalLocalStorage<journalPost[]>(
    LOCAL_KEY,
    []
  );
  const fetchJournal = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/journals/my");
      console.log(res.data);
      if (!res.data?.journal) return;
      console.log("The Damn data:", res);
      const serverJournal = res.data.journal.map((journal: any) => {
        console.log("createdAt:", journal.createdAt);

        return {
          id: journal._id,
          content: journal.content,
          time: new Date(journal.createdAt).getTime(),
        };
      });
      // setPosts(serverJournal);
      setPosts((prev) => {
        const filterTemp = prev.filter((x) => x.id.startsWith("temp-"));

        const resolvedTemps = filterTemp.filter(
          (tmp) =>
            !serverJournal.some(
              (sp: any) => sp.title === tmp.title && sp.content === tmp.content
            )
        );

        return [resolvedTemps, ...serverJournal];
      });
    } catch (err) {
      console.warn("Backend unavailable, using cached posts", err);
      // keep showing localStorage posts
    }
  }, [setPosts]);

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPosts(
          parsed.map((p: any) => ({
            ...p,
            time: typeof p.time === "number" ? p.time : null,
          }))
        );
      } catch {
        //
      }
    }

    const init = async () => {
      try {
        await fetchJournal();
      } catch {
        //
      } finally {
        // await syncOutbox(setPosts);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (posts.length) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  return { posts, setPosts };
};
