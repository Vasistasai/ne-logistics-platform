import L from 'leaflet';
import type { MapProviderStyle } from '../types';

export interface MapLayerDefinition {
  label: string;
  url: string;
  options: L.TileLayerOptions;
}

const standardLayer: MapLayerDefinition = {
  label: 'Standard',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
};

const darkLayer: MapLayerDefinition = {
  label: 'Dark',
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  options: {
    subdomains: 'abcd',
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

const satelliteLayer: MapLayerDefinition = {
  label: 'Satellite',
  url: import.meta.env.VITE_SATELLITE_TILE_URL || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  options: {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.esri.com/en-us/legal/terms">Esri</a>'
  }
};

const satelliteLabelsLayer: MapLayerDefinition = {
  label: 'Satellite labels',
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  options: {
    maxZoom: 19,
    opacity: 0.9,
    attribution: '&copy; <a href="https://www.esri.com/en-us/legal/terms">Esri</a>'
  }
};

export const MAP_LAYERS: Record<MapProviderStyle, MapLayerDefinition[]> = {
  standard: [standardLayer],
  dark: [darkLayer],
  satellite: [satelliteLayer],
  'satellite-labels': [satelliteLayer, satelliteLabelsLayer]
};

export function addMapStyle(map: L.Map, style: MapProviderStyle): L.LayerGroup {
  const layers = L.layerGroup();
  MAP_LAYERS[style].forEach((layer) => {
    L.tileLayer(layer.url, layer.options).addTo(layers);
  });
  layers.addTo(map);
  return layers;
}
