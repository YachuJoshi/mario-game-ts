import hills from "./image/hills.png";
import background from "./image/background.png";

import { Generics } from "./generics";
import { Platform } from "./platform";
import { Goomba } from "./goomba";

import { MAP_WIDTH, PLATFORM_WIDTH } from "./base";

interface Position {
  x: number;
  y: number;
}

export function createNewImage(src: string): HTMLImageElement {
  const image: HTMLImageElement = new Image();
  image.src = src;
  return image;
}

export function generateNewPlatforms(): Platform[] {
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

export function generateNewGoombas(platforms: Platform[]): Goomba[] {
  let goombas: Goomba[] = [];
  const P_WIDTH = 580;
  const G_WIDTH = 86;
  const GOOMBA_GAP = 56;

  for (let i = 1; i < platforms.length - 1; i++) {
    const platform = platforms[i];
    const random = Math.random();
    const goombaCount =
      random > 0.66 ? 3 : random > 0.33 && random < 0.66 ? 2 : 1;
    for (let j = 0; j < goombaCount; j++) {
      if (goombaCount % 2 === 0) {
        goombas.push(
          new Goomba({
            x:
              platform.x +
              P_WIDTH / 2 -
              2 * (j / 2 - 1) -
              (G_WIDTH * j) / 2 -
              GOOMBA_GAP * (j / 2 - 1),
            y: 522,
          })
        );
        continue;
      }
      goombas.push(
        new Goomba({
          x:
            platform.x +
            P_WIDTH / 2 -
            (G_WIDTH * j) / 2 -
            (GOOMBA_GAP * (j - 1)) / 2,
          y: 522,
        })
      );
    }
  }

  return goombas;
}

export function extractPosition<T extends Position>(array: T[]): Position[] {
  return array.map((item) => ({ x: item.x, y: item.y }));
}

export function regeneratePlatforms(platforms: Platform[]): Platform[] {
  const positions = extractPosition(platforms);

  return positions.map(
    (position) =>
      new Platform({
        x: position.x,
        y: position.y,
      })
  );
}

export function regenerateGoombas(goombas: Goomba[]): Goomba[] {
  const positions = extractPosition(goombas);

  return positions.map(
    (position) =>
      new Goomba({
        x: position.x,
        y: position.y,
      })
  );
}

export function getBackgroundInstance(): Generics {
  return new Generics(background);
}

export function getHillInstance(pos: Position): Generics {
  return new Generics(hills, pos);
}
