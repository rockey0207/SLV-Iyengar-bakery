import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const LocCtx = createContext(null);
export const useLocation = () => useContext(LocCtx);

export function LocationProvider({ children }) {
  const [status, setStatus] = useState(() => {
    const saved = localStorage.getItem("slv_location");
    return saved ? JSON.parse(saved) : null;
  });
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (!status) requestLocation();
    // eslint-disable-next-line
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      const fallback = { lat: 12.9352, lng: 77.6245, in_range: true, distance_km: 0, denied: true };
      setStatus(fallback);
      localStorage.setItem("slv_location", JSON.stringify(fallback));
      return;
    }
    setAsking(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { data } = await api.post("/location/check", { lat: pos.coords.latitude, lng: pos.coords.longitude });
        const s = { lat: pos.coords.latitude, lng: pos.coords.longitude, ...data };
        setStatus(s);
        localStorage.setItem("slv_location", JSON.stringify(s));
      } catch {}
      setAsking(false);
    }, () => {
      const fallback = { lat: 12.9352, lng: 77.6245, in_range: true, distance_km: 0, denied: true };
      setStatus(fallback);
      localStorage.setItem("slv_location", JSON.stringify(fallback));
      setAsking(false);
    }, { timeout: 8000 });
  };

  return <LocCtx.Provider value={{ status, requestLocation, asking }}>{children}</LocCtx.Provider>;
}
