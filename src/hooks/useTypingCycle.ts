import { useState, useEffect, useCallback } from "react";

export function useTypingCycle(roles: string[], typeSpeed = 80, deleteSpeed = 40, pause = 1800) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = roles[roleIndex];
    if (isDeleting) {
      setDisplayText((prev) => prev.slice(0, -1));
    } else {
      setDisplayText((prev) => current.slice(0, prev.length + 1));
    }
  }, [isDeleting, roleIndex, roles]);

  useEffect(() => {
    const current = roles[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === current) {
      timer = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      timer = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles, tick, typeSpeed, deleteSpeed, pause]);

  return { displayText, currentRole: roles[roleIndex], isDeleting };
}
