import { useLocation as useLoc } from "@/context/LocationContext";
import { AlertTriangle, MapPin, X } from "lucide-react";
import { useState } from "react";

export default function LocationBanner() {
  const { status, requestLocation } = useLoc();
  const [dismissed, setDismissed] = useState(false);
  if (!status || status.in_range || dismissed) return null;
  return (
    <div className="bg-[#BE123C] text-white px-4 py-2.5 text-sm flex items-center justify-between gap-3" data-testid="location-banner">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Sorry, we currently deliver only within 5 KM of our bakery location. (You are {status.distance_km} km away)</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={requestLocation} className="text-xs underline flex items-center gap-1" data-testid="retry-location">
          <MapPin className="w-3.5 h-3.5" /> Update
        </button>
        <button onClick={() => setDismissed(true)}><X className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
