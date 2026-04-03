import { useEffect, useRef, useState } from "react";

export function useWelcomeToast(currentUser) {
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (currentUser && !shownRef.current) {
      shownRef.current = true;
      setVisible(true);
    }
  }, [currentUser]);

  function dismiss() {
    setVisible(false);
  }

  return { visible, dismiss };
}
