import { useEffect } from "react";

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} | StudyFlow`;
  }, [title]);
}

export default useDocumentTitle;
