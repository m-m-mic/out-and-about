export function getRandomActivityIcon() {
  const icons = ["grill", "basketball", "theater", "party-popper", "dumbbell"];
  const randomRange = (length: number) => {
    return Math.floor(Math.random() * length);
  };
  return icons[randomRange(icons.length)];
}
