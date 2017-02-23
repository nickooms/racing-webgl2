const consoleGroup = fnGroup => (...name) => fn => {
  fnGroup(...name);
  const result = fn();
  console.groupEnd();
  return result;
};

const group = consoleGroup(console.group);

const groupCollapsed = consoleGroup(console.groupCollapsed);

const tableCollapsed = (label, item, mapping) => {
  if (item instanceof Array) {
    groupCollapsed(`${label} [%i]`, item.length)(() => {
      console.table(item.map(mapping));
    });
  } else {
    groupCollapsed(label)(() => console.table(item));
  }
};