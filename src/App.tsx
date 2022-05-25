import Character, {
  Characters,
  Direction,
  getSideObject,
  Status,
} from "$lib/components/Character/Character";
import Matrix, {
  isMatrixPositionBlocked,
  WorldTile,
} from "$lib/components/World/Matrix";
import { createSignal, onCleanup, onMount } from "solid-js";
import "./App.css";

const worldMatrix = Array.from(Array(20).keys()).map((_, x) =>
  Array.from(Array(20).keys()).map((_, y) => {
    // npm position
    if (x === 8 && y === 5) {
      return {
        ground: WorldTile.dirt,
        blocked: true,
        action: () => {
          alert("Hi Mom!");
        },
      };
    }

    return {
      ground: WorldTile.dirt,
    };
  })
);

export default function App() {
  const [getCharacterPosition, setCharacterPosition] = createSignal<
    [number, number]
  >([1, 1]);
  const [getMoving, setMoving] = createSignal(false);
  const [getDirection, setDirection] = createSignal<Direction>(Direction.down);

  let finishedMoving: NodeJS.Timeout;
  function handleKeyboardInput(e: KeyboardEvent) {
    e.preventDefault();
    if (getMoving()) return;
    let newPosition: [number, number];
    switch (e.key) {
      case "ArrowUp":
        setDirection(Direction.up);
        if (getCharacterPosition()[1] === 0) return;

        newPosition = [
          getCharacterPosition()[0],
          Math.max(0, getCharacterPosition()[1]) - 1,
        ];

        if (isMatrixPositionBlocked(newPosition)) return;

        setCharacterPosition(newPosition);

        // enable movement animation
        setMoving(true);
        clearTimeout(finishedMoving);
        finishedMoving = setTimeout(() => {
          setMoving(false);
        }, 200);
        break;
      case "ArrowLeft":
        setDirection(Direction.left);
        if (getCharacterPosition()[0] === 0) return;

        newPosition = [
          Math.max(0, getCharacterPosition()[0]) - 1,
          getCharacterPosition()[1],
        ];

        if (isMatrixPositionBlocked(newPosition)) return;

        setCharacterPosition(newPosition);

        // enable movement animation
        setMoving(true);
        clearTimeout(finishedMoving);
        finishedMoving = setTimeout(() => {
          setMoving(false);
        }, 200);
        break;
      case "ArrowDown":
        setDirection(Direction.down);
        newPosition = [
          getCharacterPosition()[0],
          Math.max(0, getCharacterPosition()[1]) + 1,
        ];

        if (isMatrixPositionBlocked(newPosition)) return;

        setCharacterPosition(newPosition);

        // enable movement animation
        setMoving(true);
        clearTimeout(finishedMoving);
        finishedMoving = setTimeout(() => {
          setMoving(false);
        }, 200);
        break;
      case "ArrowRight":
        setDirection(Direction.right);
        newPosition = [
          Math.max(0, getCharacterPosition()[0]) + 1,
          getCharacterPosition()[1],
        ];

        if (isMatrixPositionBlocked(newPosition)) return;

        setCharacterPosition(newPosition);

        // enable movement animation
        setMoving(true);
        clearTimeout(finishedMoving);
        finishedMoving = setTimeout(() => {
          setMoving(false);
        }, 200);
        break;
      case " ":
        const object = getSideObject({
          position: getCharacterPosition(),
          direction: getDirection(),
        });
        object?.action?.();

        break;

      default:
        // console.log(e.key);

        break;
    }
  }
  onMount(() => {
    window.addEventListener("keydown", handleKeyboardInput);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyboardInput);
  });

  return (
    <div
      id="game"
      style={{
        "--tile-size": "3.2rem",
      }}
    >
      <Matrix matrix={worldMatrix} />
      <Character
        title="Bob"
        direction={getDirection()}
        character={Characters.Character7}
        position={getCharacterPosition()}
        move={getMoving()}
      />
      <Character
        title="Peter"
        status={Status.idle}
        direction={Direction.left}
        character={Characters.Character4}
        position={[8, 5]}
      />
    </div>
  );
}
