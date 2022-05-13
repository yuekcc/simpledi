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
export {
  addService,
  useService
};
