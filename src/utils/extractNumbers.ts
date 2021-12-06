export function extractNumbers(text: string): number[] {
  let numbers;

  numbers = text.match(/(-\d+|\d+)(,\d+)*(\.\d+)*/g);

  numbers = numbers!.map((n) => Number(n.replace(/,/g, "")));

  return numbers;
}
