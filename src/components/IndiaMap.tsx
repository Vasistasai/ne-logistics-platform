import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import type { MapMarker, MapFilterType, LiveDataServiceState, MapProviderStyle } from '../types';
import { addMapStyle } from '../services/mapsService';
import { 
  Globe, 
  RotateCcw, 
  Maximize2, 
  Radio,
  Navigation
} from 'lucide-react';

interface IndiaMapProps {
  markers: MapMarker[];
  userLocation?: { lat: number; lng: number };
  onMarkerClick: (marker: MapMarker) => void;
  liveDataState?: LiveDataServiceState;
  focusMarker?: MapMarker | null;
}

// Major National Freight Corridors
const LOGISTICS_CORRIDORS = [
  {
    name: "Siliguri Corridor ('Chicken's Neck')",
    color: "#a855f7", // Purple logistics brand color
    path: [
      [26.7271, 88.3953],
      [26.5400, 88.7500],
      [26.4000, 89.8000],
      [26.1445, 91.7362] // Guwahati
    ]
  },
  {
    name: "NH-44 Guwahati-Shillong-Agartala Highway",
    color: "#06b6d4", // Cyan
    path: [
      [26.1445, 91.7362], // Guwahati
      [25.5788, 91.8933], // Shillong
      [24.8333, 92.7789], // Silchar
      [23.8315, 91.2868]  // Agartala
    ]
  },
  {
    name: "NH-29 Dimapur-Kohima Supply Line",
    color: "#f59e0b", // Amber warning
    path: [
      [26.1445, 91.7362], // Guwahati
      [25.9060, 93.7272], // Dimapur
      [25.6751, 94.1086]  // Kohima
    ]
  },
  {
    name: "NH-27 East-West Expressway Axis",
    color: "#3b82f6", // Primary blue
    path: [
      [25.3176, 82.9739], // Varanasi
      [25.6127, 85.1356], // Patna
      [26.7271, 88.3953], // Siliguri
      [26.1445, 91.7362]  // Guwahati
    ]
  }
];

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];
const INDIA_ZOOM = 5;

const NORTHEAST_CENTER: [number, number] = [26.2006, 92.9376];
const NORTHEAST_ZOOM = 7;

export function IndiaMap({
  markers,
  userLocation,
  onMarkerClick,
  liveDataState,
  focusMarker
}: IndiaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayersRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<MapFilterType>('ALL');
  const [mapStyle, setMapStyle] = useState<MapProviderStyle>('dark');
  const [showLayers, setShowLayers] = useState(false);

  // Filter markers based on selected category
  const filteredMarkers = useMemo(() => {
    if (activeFilter === 'ALL') return markers;

    return markers.filter((m) => {
      const type = m.type;
      if (activeFilter === 'DISASTER') return type === 'disaster' || type === 'official-alert';
      if (activeFilter === 'WEATHER') return type === 'weather-alert';
      if (activeFilter === 'ROAD') return type === 'road-issue';
      if (activeFilter === 'LOGISTICS') return type === 'logistics';
      if (activeFilter === 'COMMUNITY') return type === 'incident' || type === 'user';
      return true;
    });
  }, [markers, activeFilter]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map with dark theme settings
    const map = L.map(mapContainerRef.current, {
      center: INDIA_CENTER,
      zoom: INDIA_ZOOM,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true
    });

    tileLayersRef.current = addMapStyle(map, 'dark');

    // Render National Freight Corridors
    LOGISTICS_CORRIDORS.forEach(corridor => {
      L.polyline(corridor.path as [number, number][], {
        color: corridor.color,
        weight: 3.5,
        opacity: 0.75,
        dashArray: '8, 6',
        lineCap: 'round'
      }).bindTooltip(`Freight Corridor: ${corridor.name}`, {
        sticky: true,
        className: 'custom-leaflet-tooltip'
      }).addTo(map);
    });

    // Layer group for markers
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    tileLayersRef.current?.removeFrom(map);
    tileLayersRef.current = addMapStyle(map, mapStyle);
  }, [mapStyle]);

  useEffect(() => {
    if (!focusMarker || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([focusMarker.coordinates.lat, focusMarker.coordinates.lng], 9, { duration: 0.8 });
  }, [focusMarker]);

  // Update Markers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Render Current Location Marker (Cyan GPS Pin)
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(56, 189, 248, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 16px; height: 16px; border-radius: 50%; background: #38bdf8; border: 2.5px solid #ffffff; box-shadow: 0 0 12px #38bdf8;"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="background-color: #0f172a; color: #f8fafc; padding: 10px; border-radius: 8px; border: 1px solid #38bdf8;">
          <strong style="color: #38bdf8; font-size: 12px;">📍 Current Location (GPS)</strong>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Lat: ${userLocation.lat.toFixed(4)}°, Lng: ${userLocation.lng.toFixed(4)}°</p>
        </div>
      `, { className: 'dark-popup' });
      layerGroup.addLayer(userMarker);
    }

    // Dynamic Proximity Clustering Algorithm
    const currentZoom = map.getZoom();
    const clusterDistance = currentZoom < 6 ? 1.2 : currentZoom < 8 ? 0.5 : 0.0;

    const clusters: { center: [number, number]; items: MapMarker[] }[] = [];

    filteredMarkers.forEach((marker) => {
      if (clusterDistance === 0) {
        clusters.push({ center: [marker.coordinates.lat, marker.coordinates.lng], items: [marker] });
        return;
      }

      let added = false;
      for (const cluster of clusters) {
        const dLat = Math.abs(cluster.center[0] - marker.coordinates.lat);
        const dLng = Math.abs(cluster.center[1] - marker.coordinates.lng);
        if (dLat < clusterDistance && dLng < clusterDistance) {
          cluster.items.push(marker);
          added = true;
          break;
        }
      }

      if (!added) {
        clusters.push({ center: [marker.coordinates.lat, marker.coordinates.lng], items: [marker] });
      }
    });

    // Render Clustered or Individual Markers
    clusters.forEach((cluster) => {
      if (cluster.items.length > 1) {
        // Render Cluster Badge (Circular, professional count)
        const hasCritical = cluster.items.some(i => i.severity === 'critical' || i.isOfficial);
        const clusterBg = hasCritical ? '#ef4444' : '#f59e0b';

        const clusterIcon = L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div style="
              width: 38px; 
              height: 38px; 
              border-radius: 50%; 
              background: ${clusterBg}22; 
              border: 2px solid ${clusterBg}; 
              color: #ffffff; 
              font-family: Inter, sans-serif;
              font-weight: 800; 
              font-size: 12px; 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 0 15px ${clusterBg}88;
            ">
              <span>${cluster.items.length}</span>
              <span style="font-size: 7px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">ALERTS</span>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const clusterMarker = L.marker(cluster.center, { icon: clusterIcon });

        const itemsListHtml = cluster.items.map(item => `
          <div style="padding: 6px 0; border-bottom: 1px solid #1e293b;">
            <div style="font-weight: 700; color: #f8fafc; font-size: 11px;">${item.title}</div>
            <div style="font-size: 10px; color: #94a3b8;">${item.state} • ${item.type}</div>
          </div>
        `).join('');

        clusterMarker.bindPopup(`
          <div style="background-color: #0f172a; color: #f8fafc; padding: 12px; border-radius: 10px; min-width: 220px;">
            <div style="font-size: 10px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px; tracking-wide;">
              Cluster (${cluster.items.length} Intelligence Events)
            </div>
            ${itemsListHtml}
          </div>
        `, { className: 'dark-popup' });

        layerGroup.addLayer(clusterMarker);
      } else {
        // Render Single Marker with specific Icon SVG
        const item = cluster.items[0];
        const isOfficial = item.isOfficial || item.type === 'official-alert';

        let iconSvg = '';
        let iconBg = '#3b82f6';

        if (isOfficial) {
          iconBg = '#ef4444'; // Red
          // Siren / Alert SVG Icon
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M12 2v2"/><path d="M12 6a6 6 0 0 0-6 6v3l-2 2v1h16v-1l-2-2v-3a6 6 0 0 0-6-6Z"/><path d="M9 21a3 3 0 0 0 6 0"/></svg>`;
        } else if (item.type === 'weather-alert') {
          iconBg = '#06b6d4'; // Cyan
          // Cloud Rain SVG Icon
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`;
        } else if (item.type === 'road-issue') {
          iconBg = '#f59e0b'; // Amber
          // Route Blockage SVG Icon
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>`;
        } else if (item.type === 'logistics') {
          iconBg = '#a855f7'; // Purple
          // Truck SVG Icon
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><rect width="16" height="12" x="2" y="6" rx="2"/><path d="M10 12h4"/><path d="M12 10v4"/></svg>`;
        } else {
          iconBg = '#10b981'; // Green (Community)
          // Camera / Community Report Icon
          iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
        }

        const customIcon = L.divIcon({
          className: 'custom-single-marker',
          html: `
            <div style="
              width: 26px; 
              height: 26px; 
              border-radius: 50%; 
              background: ${iconBg}; 
              border: 2px solid #ffffff; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 0 10px ${iconBg}aa;
              cursor: pointer;
            ">
              ${iconSvg}
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const leafMarker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: customIcon });

        const badgeStyle = isOfficial 
          ? 'background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);' 
          : 'background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4);';

        const sourceLabel = item.source ? `<div style="font-size: 10px; color: #94a3b8; margin-top: 6px;">Source: <strong>${item.source}</strong></div>` : '';
        const linkLabel = item.sourceUrl ? `<a href="${item.sourceUrl}" target="_blank" style="color: #38bdf8; font-size: 10px; text-decoration: underline; display: block; margin-top: 4px;">View Official Source ↗</a>` : '';

        leafMarker.bindPopup(`
          <div style="background-color: #0f172a; color: #f8fafc; padding: 12px; border-radius: 10px; max-width: 260px; font-family: Inter, sans-serif;">
            <div style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; ${badgeStyle}">
              ${isOfficial ? 'OFFICIAL ALERT' : item.type}
            </div>
            <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 6px 0;">${item.title}</h4>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 8px 0; line-height: 1.4;">${item.description}</p>
            <div style="font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 6px;">
              Region: <strong>${item.state}</strong>
            </div>
            ${sourceLabel}
            ${linkLabel}
          </div>
        `, { className: 'dark-popup' });

        leafMarker.on('click', () => {
          onMarkerClick(item);
        });

        layerGroup.addLayer(leafMarker);
      }
    });

  }, [filteredMarkers, userLocation, onMarkerClick]);

  // Handlers for Map Control Buttons
  const handleResetIndia = () => {
    mapInstanceRef.current?.flyTo(INDIA_CENTER, INDIA_ZOOM, { duration: 1.2 });
  };

  const handleFocusNortheast = () => {
    mapInstanceRef.current?.flyTo(NORTHEAST_CENTER, NORTHEAST_ZOOM, { duration: 1.2 });
  };

  const handleLocateMe = () => {
    if (userLocation) {
      mapInstanceRef.current?.flyTo([userLocation.lat, userLocation.lng], 10, { duration: 1.2 });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className="relative w-full h-full bg-[#0b0f19] rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
      
      {/* Top Map Command Control Bar */}
      <div className="z-[400] bg-slate-950/90 border-b border-slate-800 backdrop-blur-md px-2 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        
        {/* Left Title */}
        <div className="flex w-full sm:w-auto items-center space-x-2.5">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[11px] sm:text-xs font-bold text-slate-100 tracking-wide flex items-center gap-1.5 truncate">
              INDIA GEOGRAPHIC INTELLIGENCE MAP
              <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-semibold">
                COMMAND
              </span>
            </h3>
          </div>
        </div>

        {/* Center Category Filter Toolbar */}
        <div className="flex max-w-full items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 overflow-x-auto text-[11px]">
          {(['ALL', 'DISASTER', 'WEATHER', 'ROAD', 'LOGISTICS', 'COMMUNITY'] as MapFilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex max-w-full items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 overflow-x-auto text-[10px]">
          {([
            ['standard', 'Standard'],
            ['dark', 'Dark'],
            ['satellite', 'Satellite'],
            ['satellite-labels', 'Satellite + Labels']
          ] as [MapProviderStyle, string][]).map(([style, label]) => (
            <button
              key={style}
              onClick={() => setMapStyle(style)}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all ${
                mapStyle === style ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowLayers((visible) => !visible)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px]"
            aria-expanded={showLayers}
          >
            Layers
          </button>
          {showLayers && (
            <div className="absolute right-0 top-9 z-[500] w-40 bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-xl space-y-1">
              {(['DISASTER', 'WEATHER', 'ROAD', 'LOGISTICS', 'COMMUNITY'] as MapFilterType[]).map((layer) => (
                <label key={layer} className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-slate-300 hover:bg-slate-800 rounded">
                  <input type="radio" name="map-layer" checked={activeFilter === layer} onChange={() => setActiveFilter(layer)} />
                  {layer}
                </label>
              ))}
              <label className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-slate-300 hover:bg-slate-800 rounded">
                <input type="radio" name="map-layer" checked={activeFilter === 'ALL'} onChange={() => setActiveFilter('ALL')} />
                ALL
              </label>
            </div>
          )}
        </div>

        {/* Right View Controls */}
        <div className="flex w-full sm:w-auto items-center justify-end space-x-2 overflow-x-auto">
          {userLocation && (
            <button
              onClick={handleLocateMe}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-semibold transition-colors"
              title="Zoom to My Detected Location"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Locate Me</span>
            </button>
          )}

          <button
            onClick={handleResetIndia}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-semibold transition-colors"
            title="Reset View to All India"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Reset India</span>
          </button>

          <button
            onClick={handleFocusNortheast}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all shadow"
            title="Focus Northeast India Region"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Northeast Focus</span>
          </button>
        </div>

      </div>

      {/* Main Leaflet Map Container */}
      <div className="relative flex-1 w-full h-full min-h-[320px] sm:min-h-[480px] bg-[#0b0f19]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Custom Zoom Controls (Top-Right of Map) */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col space-y-1 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-lg p-1 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 rounded font-bold text-base transition-colors"
          >
            +
          </button>
          <div className="w-full h-px bg-slate-800" />
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 rounded font-bold text-base transition-colors"
          >
            −
          </button>
        </div>

        {/* Live Source Status Badge (Top-Left of Map) */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-[400] bg-slate-900/90 border border-slate-800 backdrop-blur rounded-lg p-2 shadow-lg text-[10px] space-y-1 max-w-[calc(100%-4.5rem)] sm:max-w-xs">
          <div className="flex items-center justify-between font-bold text-slate-200 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Data Intelligence
            </span>
              <span className="text-[9px] font-mono text-emerald-400">
              {liveDataState?.liveSourceStatus.gdelt === 'connected' ? 'LIVE' : 'UNAVAILABLE'}
            </span>
          </div>

          <div className="space-y-0.5 text-[10px] text-slate-400 pt-0.5">
            <div className="flex items-center justify-between">
              <span>NDMA / SACHET:</span>
              <span className="text-amber-400 font-semibold">Demo fixtures</span>
            </div>
            <div className="flex items-center justify-between">
              <span>IMD Weather Watch:</span>
              <span className="text-amber-400 font-semibold">Demo fixtures</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GDELT News Mining:</span>
              <span className={liveDataState?.liveSourceStatus.gdelt === 'connected' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {liveDataState?.liveSourceStatus.gdelt === 'connected' ? 'Connected (Live)' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Command Map Legend (Bottom-Right of Map) */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-auto sm:right-4 z-[400] bg-slate-900/90 border border-slate-800 backdrop-blur rounded-lg p-2 sm:p-3 shadow-xl space-y-2 text-[10px] sm:text-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>Intelligence Marker System</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px]">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white shadow-[0_0_6px_#38bdf8]" />
              <span className="text-slate-300">Your GPS Location</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
              <span className="text-slate-300 font-semibold text-red-300">Official Alert</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full border border-white" />
              <span className="text-slate-300">Weather Warning</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
              <span className="text-slate-300">Road Blockage</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full border border-white" />
              <span className="text-slate-300">Logistics Hub</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
              <span className="text-slate-300">Community Report</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
