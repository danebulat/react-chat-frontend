function timestampToDate(timestamp) {
  if (!timestamp) return '';

  const dateTime = timestamp.replace('T', ' ')
    .split('.')[0]
    .replace(/[-]/g, '/');

  const date = dateTime.split(' ')[0];
  return String(date);
}

function getSubString(string, numChars) {
 return string.length <= numChars
   ? string 
   : `${string.substring(0, numChars)}...`;
}

export {
  timestampToDate,
  getSubString,
};
