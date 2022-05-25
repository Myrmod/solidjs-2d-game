import Sprite from "$assets/characters.png?url";
import { createEffect, createSignal } from "solid-js";
import { getMatrix } from "../World/Matrix";
import "./character.css";

export enum Status {
  "forwardRight",
  "idle",
  "forwardLeft",
}
export enum Direction {
  "down",
  "left",
  "right",
  "up",
}

export enum Characters {
  "Character1",
  "Character2",
  "Character3",
  "Character4",
  "Character5",
  "Character6",
  "Character7",
}

const spriteImageSize = 32;

export function getSideObject(object: {
  position: [number, number];
  direction: Direction;
}) {
  const matrix = getMatrix();

  if (!matrix) return null;

  let offsetX = 0;
  let offsetY = 0;
  switch (object.direction) {
    case Direction.up:
      offsetY = -1;
      break;
    case Direction.down:
      offsetY = 1;
      break;
    case Direction.left:
      offsetX = -1;
      break;
    case Direction.right:
      offsetX = 1;
      break;

    default:
      break;
  }

  return matrix[object.position[0] + offsetX][object.position[1] + offsetY];
}

export default function Character(props: {
  title?: string;
  character?: Characters;
  status?: Status;
  direction?: Direction;
  move?: boolean;
  movementSpeed?: number;
  position?: [number, number];
}) {
  const [getCharacterSprite, setCharacterSprite] = createSignal<
    [number, number]
  >([0, 0]);
  const [getStatus, setStatus] = createSignal<Status>(Status.idle);
  const [getDirection, setDirection] = createSignal<Direction>(Direction.down);
  const [getCharacter, setCharacter] = createSignal<Characters>(
    Characters.Character1
  );
  const [getCharacterPosition, setCharacterPosition] = createSignal<
    [number, number]
  >([0, 0]);
  const [getMoving, setMoving] = createSignal(false);

  // used for the movement
  let interval: NodeJS.Timer;

  // enables the changing of the character
  createEffect(() => {
    if (props?.character !== undefined) setCharacter(props.character);
    if (props?.status !== undefined) setStatus(props.status);
    if (props?.direction !== undefined) setDirection(props.direction);
    if (props?.move !== undefined) setMoving(props.move);
    if (props?.position !== undefined) setCharacterPosition(props.position);
  });

  // sets the Character sprite
  createEffect(() => {
    const helper = (x: number, y: number) =>
      setCharacterSprite([
        getStatus() * spriteImageSize + spriteImageSize * 3 * x,
        getDirection() * spriteImageSize + spriteImageSize * 4 * y,
      ]);
    switch (getCharacter()) {
      case Characters.Character1:
        helper(0, 0);
        break;
      case Characters.Character2:
        helper(1, 0);
        break;
      case Characters.Character3:
        helper(2, 0);
        break;
      case Characters.Character4:
        helper(3, 0);
        break;
      case Characters.Character5:
        helper(0, 1);
        break;
      case Characters.Character6:
        helper(1, 1);
        break;
      case Characters.Character7:
        helper(2, 1);
        break;

      default:
        console.warn("unknown Character defined");
        break;
    }
  });

  // movement animation
  createEffect(() => {
    if (interval) clearInterval(interval);
    if (getMoving()) {
      let fromLeft = false;
      interval = setInterval(() => {
        switch (getStatus()) {
          case Status.forwardLeft:
            setStatus(Status.idle);
            fromLeft = true;

            break;
          case Status.idle:
            fromLeft
              ? setStatus(Status.forwardRight)
              : setStatus(Status.forwardLeft);

            break;
          case Status.forwardRight:
            setStatus(Status.idle);
            fromLeft = false;
            break;

          default:
            break;
        }
      }, (props.movementSpeed || 200) / 4);
    } else {
      setStatus(Status.idle);
    }
  });

  return (
    <div
      class="character"
      title={props?.title}
      style={{
        background: `url(${Sprite}) -${getCharacterSprite()[0]}px -${
          getCharacterSprite()[1]
        }px`,
        left: `calc(${getCharacterPosition()[0]} * var(--tile-size))`,
        top: `calc(${getCharacterPosition()[1]} * var(--tile-size))`,
        "--movement-speed": `${props.movementSpeed || 200}ms`,
      }}
    />
  );
}
