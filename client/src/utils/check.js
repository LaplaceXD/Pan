function number(value, { maxIntLength, maxFracLength }) {
  const [int, frac] = String(value).split(".");
  const intIsWithinMaxLength = int.length <= (maxIntLength || 5);
  const fracIsWithinMaxLength = frac ? frac.length <= (maxFracLength || 2) : true;

  return intIsWithinMaxLength && fracIsWithinMaxLength;
}

export default {
  number,
};
