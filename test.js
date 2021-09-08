const { addService, useService } = require("./dist");
const assert = require("assert");

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
  constructor(nameService, ageService) {
    this.nameService = nameService;
    this.ageService = ageService;
  }

  print() {
    return `${this.nameService.name} ${this.ageService.age}`;
  }
}

function testMain() {
  addService(MyService, [NameService, AgeService]);

  const myService1 = useService(MyService);
  assert.strictEqual(myService1.print(), `tom 11`);

  const myService2 = useService(MyService);
  assert.equal(myService2, myService1);
}

testMain();
