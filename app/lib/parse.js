const { Parser } = require('htmlparser2');

const Options = { decodeEntities: true };
const cols = [];

let rows;
let row = {};
let index = 0;

const ontext = text => {
  if (text === 'NULL') text = null;
  if (rows === undefined) {
    cols.push(text);
  } else {
    row[cols[index++]] = text;
  }
};

const onclosetag = name => {
  if (name === 'tr') {
    if (rows === undefined) {
      rows = [];
    } else {
      rows.push(row);
      row = {};
    }
    index = 0;
  }
};

const parse = html => {
  rows = undefined;
  cols.length = 0;
  index = 0;
  const parser = new Parser({ ontext, onclosetag }, Options);
  parser.parseComplete(html);
  return rows;
};

module.exports = parse;
