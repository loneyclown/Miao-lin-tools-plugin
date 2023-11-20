
/**
 * 得到一个两数之间的随机整数
 * @param {*} min 最小值(含)
 * @param {*} max 最大值(不含)
 * @returns 
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}