var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var src_exports = {};
__export(src_exports, {
  addService: () => addService,
  useService: () => useService
});
module.exports = __toCommonJS(src_exports);
const instances = /* @__PURE__ */ new WeakMap();
const ctors = /* @__PURE__ */ new Map();
function createObject(ctor, depObjects) {
  instances.set(ctor, Reflect.construct(ctor, depObjects));
  return instances.get(ctor);
}
function createOrGetInstance(ctor) {
  if (instances.has(ctor)) {
    return instances.get(ctor);
  }
  const deps = ctors.get(ctor) || [];
  if (deps.length === 0) {
    return createObject(ctor, []);
  }
  const depObjects = [];
  for (const depCtor of deps) {
    depObjects.push(createOrGetInstance(depCtor, ctor));
  }
  return createObject(ctor, depObjects);
}
function findCycleDependency(ctor, target = null) {
  if (ctor === target) {
    return true;
  }
  const _target = target || ctor;
  const depCtors = ctors.get(ctor) || [];
  for (const depCtor of depCtors) {
    if (findCycleDependency(depCtor, _target)) {
      return true;
    }
  }
  return false;
}
function addService(ctor, deps = []) {
  if (ctors.has(ctor)) {
    console.log(`${ctor == null ? void 0 : ctor.name} of service updated`);
  }
  ctors.set(ctor, deps);
  if (findCycleDependency(ctor, null)) {
    ctors.delete(ctor);
    throw new Error(`found cycle dependency on add '${ctor == null ? void 0 : ctor.name}'`);
  }
}
function useService(ctor) {
  return createOrGetInstance(ctor);
}
