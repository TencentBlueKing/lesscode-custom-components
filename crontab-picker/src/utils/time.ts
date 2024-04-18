export const prettyDateTimeFormat = (target: string) => {
  if (!target) {
    return '';
  }
  const formatStr = (str: number | string) => {
    if (String(str).length === 1) {
      return `0${str}`;
    }
    return str;
  };
  const d = new Date(target);
  const year = d.getFullYear();
  const month = formatStr(d.getMonth() + 1);
  const date = formatStr(d.getDate());
  const hours = formatStr(d.getHours());
  const minutes = formatStr(d.getMinutes());
  const seconds = formatStr(d.getSeconds());
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};