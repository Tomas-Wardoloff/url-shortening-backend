function generateShortCode(num: number) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  if (num === 0) return chars[0];

  while (num > 0) {
    const rest = num % 62;
    result = chars[rest] + result;
    num = Math.floor(num / 62);
  }

  return result;
}

function validateUrl(url: string) {
  const urlRegex =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/i;
  return urlRegex.test(url);
}

export { generateShortCode, validateUrl };
