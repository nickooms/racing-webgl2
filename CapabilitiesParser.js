const { Parser, DomHandler, parseDOM } = require('htmlparser2');
const parseString = require('xml2js').parseString;

const Options = { xmlMode: true, decodeEntities: true };
// const cols = [];

/* let rows;
let row = {};
let index = 0;*/
// const layers = [];
const doc = [];
const elements = [doc];
// let parent = doc;
// let element;
// let elementName;
// let layer;
// let lastTag;
const layers = [];

const onopentag = (name) => {
  const parent = elements[elements.length - 1];
  const element = { [name]: [] };
  // if (!parent.children) parent.children = [];
  parent.push(element);
  elements.push(element[name]);
  // console.log(name);
  /* if (name === 'name' && lastTag === 'layer') {
    layers.push({});
    // layers.push()
  }
  lastTag = name;*/
  /* try {
    element = { [name]: [] };
    elementName = name;
    elements.push(element);
    parent.push(element);
    parent = element[elementName];
    console.log(parent);
  } catch (e) {
    // console.log(e);
  }*/
};

const ontext = (text) => {
  const trimmed = text.replace(/\n|\r|\t/g, '');
  if (trimmed.length) {
    const parent = elements[elements.length - 1];
    // if (!parent.children) parent.children = [];
    // parent[Object.keys(parent)[0]] = text;
    parent.push(trimmed);
  }
  // elements.push(text);
  // if (lastTag === 'name') console.log(layer !== null);
  /* if (lastTag === 'name' && layers.length) {
    console.log(layers);
    layers[layers.length - 1].name === text;
  }*/
  /* try {
    parent.push(text);
  } catch (e) {
    // console.log(e);
  }*/
  // if (text === 'NULL') text = null;
  /* if (rows === undefined) {
    cols.push(text);
  } else {
    row[cols[index++]] = text;
  }*/
};

const onclosetag = (name) => {
  const element = elements.pop();
  if ((element.length === 1) && (typeof element[0] === 'string')) {
    const parent = elements[elements.length - 1];
    parent[name] = element[0];
  }
  // if (name === 'layer') {
    // layers.push(layer);
  // }
  // layer = null;
  // element = elements.pop();
  // parent = elements[element.length - 1];
  /* if (name === 'tr') {
    if (rows === undefined) {
      rows = [];
    } else {
      rows.push(row);
      row = {};
    }
    index = 0;
  }*/
};

const parse = x => new Promise((resolve, reject) => {
  parseString(x, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
});
  /* rows = undefined;
  cols.length = 0;
  index = 0;*/
  /* const handler = new DomHandler(function (error, dom) {
    if (error) {
      console.log(error);
    } else {
      console.log(dom);
    }
  });
  const parser = new Parser(handler);
  parser.parseComplete(x);*/
  // return parseDOM(x);
  // parser.done();

  /* const parser = new Parser({ onopentag, ontext, onclosetag }, Options);
  parser.parseComplete(x);
  return doc; // layers;*/
// };

module.exports = parse;
