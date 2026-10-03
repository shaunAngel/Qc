
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers = [
  { markerOffset: -15, name: "VQ-01 (Active)", coordinates: [-58.3816, -34.6037], color: "#10B981", fuel: "90%" },
  { markerOffset: -15, name: "VQ-02 (In Port)", coordinates: [-43.1729, -22.9068], color: "#06B6D4", fuel: "40%" },
  { markerOffset: 25, name: "VQ-03 (Warning)", coordinates: [-68.1193, -16.4897], color: "#F59E0B", fuel: "15%" },
  { markerOffset: 25, name: "VQ-04 (Active)", coordinates: [-47.8825, -15.7942], color: "#10B981", fuel: "75%" },
  { markerOffset: 15, name: "VQ-05 (Maintenance)", coordinates: [-74.0817, 4.6097], color: "#EF4444", fuel: "0%" },
  { markerOffset: 15, name: "VQ-06 (Active)", coordinates: [-77.0282, -12.0432], color: "#10B981", fuel: "85%" },
  { markerOffset: -15, name: "VQ-07 (In Port)", coordinates: [2.3522, 48.8566], color: "#06B6D4", fuel: "50%" },
  { markerOffset: 15, name: "VQ-08 (Active)", coordinates: [103.8198, 1.3521], color: "#10B981", fuel: "60%" },
  { markerOffset: 15, name: "VQ-09 (Active)", coordinates: [139.6917, 35.6895], color: "#10B981", fuel: "95%" }
];

export function LiveMap() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-2 left-2 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span> Active</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span> In Port</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span> Warning</div>
      </div>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--color-card)"
                stroke="var(--color-border)"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "var(--color-overlay)", outline: "none" },
                  pressed: { fill: "var(--color-card)", outline: "none" },
                } as any}
              />
            ))
          }
        </Geographies>
        {markers.map(({ name, coordinates, markerOffset, color, fuel }) => (
          <Marker key={name} coordinates={coordinates as [number, number]}>
            <circle r={4} fill={color} stroke="#fff" strokeWidth={1} />
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fontFamily: "monospace", fill: "#9ca3af", fontSize: "10px" }}
            >
              {name} ({fuel})
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
