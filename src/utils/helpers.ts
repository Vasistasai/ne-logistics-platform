export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function timeAgo(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} months ago`;
}

export function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case 'low': return 'text-green-500';
    case 'medium': return 'text-yellow-500';
    case 'high': return 'text-orange-500';
    case 'critical': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getIncidentIcon(category: string): string {
  switch (category?.toLowerCase()) {
    case 'flood': return 'Waves';
    case 'landslide': return 'MountainSnow';
    case 'road damage': return 'CarCrash';
    case 'infrastructure damage': return 'Zap';
    default: return 'AlertTriangle';
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function isInNortheast(lat: number, lng: number): boolean {
  // Rough bounding box for NE India
  // Lat: ~21.5 to 29.5
  // Lng: ~88.0 to 97.5
  return lat >= 21.5 && lat <= 29.5 && lng >= 88.0 && lng <= 97.5;
}
