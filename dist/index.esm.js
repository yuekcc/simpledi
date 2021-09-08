const instances = new WeakMap();
const ctors = new Map();
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
function addService(ctor, deps = []) {
  if (ctors.has(ctor)) {
    console.log(`${ctor == null ? void 0 : ctor.name} of service updated`);
  }
  ctors.set(ctor, deps);
}
function useService(ctor) {
  return createOrGetInstance(ctor);
}
export {
  addService,
  useService
};
