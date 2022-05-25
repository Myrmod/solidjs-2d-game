import { createEffect, createSignal, Index, onMount } from "solid-js";
import "./matrix.css";

export enum WorldTile {
  gras,
  dirt,
  stone,
}
export type WorldMatrix = Array<
  Array<{ ground: WorldTile; blocked?: boolean; action?: () => unknown }>
>;
export const [getMatrix, setMatrix] = createSignal<WorldMatrix>();

const matrixHeight = 20;
const matrixWidth = 20;

export function isMatrixPositionBlocked([x, y]: [number, number]): boolean {
  const matrix = getMatrix();
  if (!matrix) return false;

  return !!matrix[x][y].blocked;
}

export default function Matrix(props: { matrix: WorldMatrix }) {
  onMount(() => {
    if (!props?.matrix) {
      setMatrix(
        Array.from(Array(matrixWidth).keys()).map(() =>
          Array.from(Array(matrixHeight).keys()).map(() => ({
            ground: WorldTile.dirt,
          }))
        )
      );
    }
  });

  createEffect(() => {
    if (props?.matrix !== undefined) setMatrix(props.matrix);
  });

  return (
    <div
      id="world"
      style={{
        "grid-template-rows": `repeat(${matrixWidth}, var(--tile-size))`,
        "grid-template-columns": `repeat(${matrixHeight}, var(--tile-size))`,
      }}
    >
      {getMatrix() && (
        <Index each={getMatrix()} fallback={<h1>Loading...</h1>}>
          {(row, x) => (
            <Index each={row()}>
              {(_tile, y) => (
                <div>
                  {x}, {y}
                </div>
              )}
            </Index>
          )}
        </Index>
      )}
    </div>
  );
}
