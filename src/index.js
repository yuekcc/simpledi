const instances = new WeakMap(); // 缓存已经创建的实例
const ctors = new Map(); // 保存构造函数及其依赖关系

// 创建一个对象，并保存到缓存中
function createObject(ctor, depObjects) {
  instances.set(ctor, Reflect.construct(ctor, depObjects));
  return instances.get(ctor);
}

// 创建或获取实例
function createOrGetInstance(ctor) {
  // 先检查缓存
  if (instances.has(ctor)) {
    return instances.get(ctor);
  }

  const deps = ctors.get(ctor) || [];

  // 没有依赖项的，直接创建实例
  if (deps.length === 0) {
    return createObject(ctor, []);
  }

  // 递归创建依赖项的实例
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

export function addService(ctor, deps = []) {
  // 重复设置
  if (ctors.has(ctor)) {
    console.log(`${ctor?.name} of service updated`);
  }

  ctors.set(ctor, deps);

  // 循环依赖检查
  if (findCycleDependency(ctor, null)) {
    ctors.delete(ctor);
    throw new Error(`found cycle dependency on add '${ctor?.name}'`);
  }
}

export function useService(ctor) {
  return createOrGetInstance(ctor);
}
