import { useState, type MouseEvent } from 'react';
import { MAP_PATHS, type StatePath } from '../data/mapPaths';
import type { MapMarker, Coordinates } from '../types';
import { MapTooltip } from './MapTooltip';
import { MapLegend } from './MapLegend';

interface NEIndiaMapProps {
  markers: MapMarker[];
  userLocation?: Coordinates;
  selectedState?: string;
  onStateClick: (stateId: string) => void;
  onMarkerClick: (marker: MapMarker) => void;
}

function coordsToSVG(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - 88) / (97.5 - 88)) * 750 + 25;
  const y = ((29.5 - lat) / (29.5 - 21.5)) * 650 + 25;
  return { x, y };
}

export function NEIndiaMap({
  markers,
  userLocation,
  selectedState,
  onStateClick,
  onMarkerClick
}: NEIndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    subtitle: '',
    type: ''
  });

  const handleStateHover = (e: MouseEvent, state: StatePath) => {
    setHoveredState(state.id);
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      title: state.name,
      subtitle: 'Click to view state details',
      type: 'STATE'
    });
  };

  const handleStateLeave = () => {
    setHoveredState(null);
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleStateMouseMove = (e: MouseEvent) => {
    setTooltip(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY
    }));
  };

  const handleMarkerHover = (e: MouseEvent, marker: MapMarker) => {
    e.stopPropagation();
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      title: marker.title,
      subtitle: marker.description || '',
      type: marker.type
    });
  };

  const handleMarkerLeave = (e: MouseEvent) => {
    e.stopPropagation();
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const renderMarkerIcon = (marker: MapMarker, cx: number, cy: number) => {
    const size = 16;
    const half = size / 2;
    
    switch (marker.type) {
      case 'disaster':
        return (
          <polygon
            points={`${cx},${cy - half - 2} ${cx - half - 2},${cy + half} ${cx + half + 2},${cy + half}`}
            fill="#ef4444"
            stroke="#b91c1c"
            strokeWidth="1"
            className="cursor-pointer transition-all hover:scale-125 origin-center"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker);
            }}
            onMouseEnter={(e) => handleMarkerHover(e, marker)}
            onMouseLeave={handleMarkerLeave}
          />
        );
      case 'road-issue':
        return (
          <polygon
            points={`${cx},${cy - half - 2} ${cx + half + 2},${cy} ${cx},${cy + half + 2} ${cx - half - 2},${cy}`}
            fill="#f97316"
            stroke="#c2410c"
            strokeWidth="1"
            className="cursor-pointer transition-all hover:scale-125 origin-center"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker);
            }}
            onMouseEnter={(e) => handleMarkerHover(e, marker)}
            onMouseLeave={handleMarkerLeave}
          />
        );
      case 'logistics':
        return (
          <rect
            x={cx - half}
            y={cy - half}
            width={size}
            height={size}
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="1"
            className="cursor-pointer transition-all hover:scale-125 origin-center"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker);
            }}
            onMouseEnter={(e) => handleMarkerHover(e, marker)}
            onMouseLeave={handleMarkerLeave}
          />
        );
      case 'user':
        return (
          <g>
            <circle cx={cx} cy={cy} r="15" fill="rgba(59, 130, 246, 0.4)" className="animate-ping" />
            <circle cx={cx} cy={cy} r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          </g>
        );
      case 'incident':
      default:
        return (
          <circle
            cx={cx}
            cy={cy}
            r={half}
            fill="#eab308"
            stroke="#a16207"
            strokeWidth="1"
            className="cursor-pointer transition-all hover:scale-125 origin-center"
            style={{ transformOrigin: `${cx}px ${cy}px` }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(marker);
            }}
            onMouseEnter={(e) => handleMarkerHover(e, marker)}
            onMouseLeave={handleMarkerLeave}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
      <svg
        viewBox="0 0 800 700"
        className="w-full h-full max-h-[80vh]"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
      >
        <g className="states">
          {MAP_PATHS.map((state: StatePath) => {
            const isHovered = hoveredState === state.id;
            const isSelected = selectedState === state.id;
            const fillOpacity = isSelected ? 0.9 : (isHovered ? 0.7 : 0.5);

            return (
              <g key={state.id}>
                <path
                  d={state.path}
                  fill="#3b82f6"
                  fillOpacity={fillOpacity}
                  stroke={isSelected ? '#f8fafc' : '#1e293b'}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => onStateClick(state.id)}
                  onMouseEnter={(e) => handleStateHover(e, state)}
                  onMouseLeave={handleStateLeave}
                  onMouseMove={handleStateMouseMove}
                />
                <text
                  x={state.labelPosition.x}
                  y={state.labelPosition.y}
                  fill="#f1f5f9"
                  fontSize={isSelected ? "16" : "14"}
                  fontWeight="600"
                  textAnchor="middle"
                  className="pointer-events-none select-none drop-shadow-lg transition-all duration-300"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {state.name}
                </text>
              </g>
            );
          })}
        </g>

        <g className="markers">
          {markers.map((marker) => {
            const { x, y } = coordsToSVG(marker.coordinates.lat, marker.coordinates.lng);
            return (
              <g key={marker.id}>
                {renderMarkerIcon(marker, x, y)}
              </g>
            );
          })}
        </g>

        {userLocation && (
          <g className="user-location pointer-events-none">
            {(() => {
              const { x, y } = coordsToSVG(userLocation.lat, userLocation.lng);
              return renderMarkerIcon({ 
                id: 'user', 
                coordinates: userLocation, 
                type: 'user', 
                title: 'You are here', 
                description: '',
                state: ''
              }, x, y);
            })()}
          </g>
        )}
      </svg>

      <MapLegend />
      <MapTooltip {...tooltip} />
    </div>
  );
}
