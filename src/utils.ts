import hills from "./image/hills.png";
import background from "./image/background.png";

import { Generics } from "./generics";
import { Platform } from "./platform";

import { MAP_WIDTH, PLATFORM_WIDTH } from "./base";

export function createNewImage(src: string): HTMLImageElement {
  const image: HTMLImageElement = new Image();
  image.src = src;
  return image;
}

export function generatePlatform() {
  const platforms: Platform[] = [
    new Platform({
      x: -1,
      y: 608,
    }),
  ];
  for (let i = 1, j = 0; i < MAP_WIDTH / PLATFORM_WIDTH; i++, j++) {
    const prevX = platforms[j].x;
    const GAP = Math.random() * 100 + 120;
    platforms.push(
      new Platform({
        x: prevX + PLATFORM_WIDTH + GAP,
        y: 608,
      })
    );
  }
  return platforms;
}

export function getBackgroundInstance() {
  return new Generics(background);
}

export function getHillInstance() {
  return new Generics(hills, { x: -1, y: 28 });
}
