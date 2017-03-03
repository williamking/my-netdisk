/*
 * 文件大小单位转换
 * @param {number} bytes 以byte为单位的大小参数
 * @return {string} 转换后的大小(带单位)
 */
export function convertBytes(bytes) {
  let unit = ['Bytes', 'KB', 'MB', 'GB'];
  // 判断用哪一个单位进行表示
  let index = parseInt(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, index)).toFixed(1) + ' ' + unit[index];
}

/*
 * 时间格式转换
 * @param {number} sec 以秒为单位的时间戳
 * @return {string} 以'时：分：秒'的格式表示时间的字符串
 */
export function convertTime(sec) {
  let h = Math.floor(sec / 3600),
    m = Math.floor((sec - h * 3600) / 60),
    s = sec - h * 3600 - m * 60;
  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;
  return `${h}:${m}:${s}`;
}

/*
 * 日期格式转换
 * @param {Date} date 日期
 * @return {string} 以'年-月-日'的格式表示时间的字符串
 */
export function convertDate(date) {
  date = new Date(date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}
