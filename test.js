const { addService, useService } = require("./dist");
const assert = require("assert");

// 被管理的中对名必须使用 class 语法
class NameService {
  get name() {
    return "tom";
  }
}

class AgeService {
  get age() {
    return 11;
  }
}

class MyService {
    
  // 在构建函数中注入依赖
  constructor(nameService, ageService) {
    this.nameService = nameService;
    this.ageService = ageService;
  }

  print() {
    return `${this.nameService.name} ${this.ageService.age}`;
  }
}

function testMain() {
  // 手动注册到 simpledi 中，第二个参数是依赖对象 class 的数组
  // 需要保持顺序
  addService(MyService, [NameService, AgeService]);

  // 调用 useService 时，simpledi 会自动创建对象，如果已经被创建，则会直接返回
  const myService1 = useService(MyService);
  assert.strictEqual(myService1.print(), `tom 11`);

  // 两次调用 useService，实际上返回都是同一个对象
  const myService2 = useService(MyService);
  assert.equal(myService2, myService1);
}

testMain();
