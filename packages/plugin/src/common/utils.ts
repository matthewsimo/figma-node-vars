import { postToFigma } from "./msg";

export const forMS = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const prettyNum = (num) => parseFloat(Number(num).toFixed(2));

export const colorToString = (color: RGB | RGBA): string => {
  const { r, g, b, a = 1 } = color as RGBA;
  return `rgba(${prettyNum(r) * 255}, ${prettyNum(g) * 255}, ${
    prettyNum(b) * 255
  }, ${prettyNum(a)})`;
};

export const pluralize = (str: string, count: number, suffix = "s") => {
  return `${str}${count > 1 ? suffix : ""}`;
};

export const capitalize = (str: string) => {
  return str
    .split("")
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("");
};

export const handleCopy = async (
  textareaEl: React.RefObject<HTMLTextAreaElement>,
  content: string,
  name: string
) => {
  textareaEl?.current?.select();

  console.log({ copy: true, content, name });
  let message = "";
  let isError = false;
  try {
    document.execCommand("copy", false, content);
    message = `${name} copied!`;
  } catch (err) {
    message = `Failed copying ${name}!`;
    isError = true;
  } finally {
    postToFigma({
      type: "notifiy",
      payload: {
        message,
        options: {
          error: isError,
        },
      },
    });
  }
};
