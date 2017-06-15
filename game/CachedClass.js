export default class CachedClass {
  static prop(name, defaultValue) {
    CachedClass[name] = CachedClass[name] || defaultValue;
    return CachedClass[name];
  }
}
