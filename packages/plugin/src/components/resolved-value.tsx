import { ResolvedValue } from "@/common/utils";
import Logger from "./logger";

const prettyNum = (num) => parseFloat(Number(num).toFixed(2));

const colorToString = (color: RGB | RGBA): string => {
  const { r, g, b, a = 1 } = color as RGBA;
  return `rgba(${prettyNum(r) * 255}, ${prettyNum(g) * 255}, ${
    prettyNum(b) * 255
  }, ${prettyNum(a)})`;
};

const ResolvedValue = ({ resolvedValue }: { resolvedValue: ResolvedValue }) => {
  const { value, resolvedType } = resolvedValue;

  return (
    <>
      {resolvedType === "COLOR" ? (
        <p>
          <span
            style={{ backgroundColor: colorToString(value as RGBA) }}
            className="w-6 mr-1 align-bottom aspect-square rounded-sm inline-block border"
          />
          {colorToString(value as RGBA)}
        </p>
      ) : (
        <p className="text-2xl text-right">{String(value)}</p>
      )}

      {false && <Logger data={value} />}
    </>
  );
};

export default ResolvedValue;
