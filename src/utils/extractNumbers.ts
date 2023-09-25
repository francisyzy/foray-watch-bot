export function extractNumbers(text: string): number[] {
  let numbers;

  numbers = text.match(/(-\d+|\d+)(,\d+)*(\.\d+)*/g);

  if (numbers) {
    numbers = numbers.map((n) => Number(n.replace(/,/g, "")));
  } else {
    throw new Error("No Numbers!");
  }

  return numbers;
}
