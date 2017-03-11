const styles = require('ansi-styles');

const others = 'reset bold dim italic underline inverse hidden strikethrough'.split(' ');

const keys = Object.keys(styles);
const isBgColor = x => x.indexOf('bg') === 0;
const isOther = x => others.includes(x);
const bgColors = keys.filter(isBgColor);
const colors = keys.filter(x => (!isBgColor(x)) && (!isOther(x)));
const maxLength = Math.max(...colors.map(x => x.length), ...bgColors.map(x => x.length));
const pad = color => ` ${color}${' '.repeat(maxLength - (color.length + 1))}`;
const inColor = color => text => `${styles[color].open}${text}${styles[color].close}`;
const inBgColor = bgColor => text => `${styles[bgColor].open}${text}${styles[bgColor].close}`;
const row = (color) => {
  const padded = pad(color);
  const backgrounds = bgColors.map(bgColor => inBgColor(bgColor)(padded)).join('');
  return inColor(color)(`${backgrounds}`);
};
const table = colors.map(row).join('\n');
const usage = () => console.log(table);

const Logging = { usage };
keys.forEach((key) => {
  const { open, close } = styles[key];
  Logging[key] = text => `${open}${text}${close}`;
});

module.exports = Logging;
