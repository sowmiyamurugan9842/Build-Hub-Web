import { createContext, useContext, useState, useCallback } from "react";
import { attendanceSeed } from "../data/fakeData";

const STORAGE_KEY = "buildhub_attendance";
const Ctx = createContext(null);

const Svc = {
  load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    const seed = JSON.parse(JSON.stringify(attendanceSeed));
    this.persist(seed);
    return seed;
  },
  persist(records) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
  },
};

export function AttendanceProvider({ children }) {
  const [records, setRecords] = useState(() => Svc.load());

  const getForProject = useCallback(
    (projectId, date) =>
      records.filter((r) => r.projectId === projectId && (!date || r.date === date)),
    [records]
  );

  const addRecord = useCallback((rec) => {
    const newRec = { ...rec, id: `ATT-${Date.now()}` };
    setRecords((prev) => {
      const next = [...prev, newRec];
      Svc.persist(next);
      return next;
    });
  }, []);

  const updateRecord = useCallback((id, patch) => {
    setRecords((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      Svc.persist(next);
      return next;
    });
  }, []);

  const deleteRecord = useCallback((id) => {
    setRecords((prev) => {
      const next = prev.filter((r) => r.id !== id);
      Svc.persist(next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ getForProject, addRecord, updateRecord, deleteRecord }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAttendance = () => useContext(Ctx);
