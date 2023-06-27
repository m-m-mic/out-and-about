export function formatDistance(distance: number) {
  if (distance < 1000) {
    return distance + " m";
  } else {
    return Math.floor(distance / 1000) + " km";
  }
}
