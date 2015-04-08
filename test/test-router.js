import {Router} from '../src/router';

function assert(actual, expected) {
  console.log('.');
  console.assert(actual === expected, '\nact: ' + actual + '\nexp: ' + expected);
}

function deepEqual(x, y) {
  let result = Object.keys(x).map((key) => {
    return x[key] === y[key];
  }).reduce((curr, pre) => {
    return curr && pre
  });
  console.assert(result);
}

function test1() {
  let router = new Router();
  router.topic('/id/:id/name/:name', (message) => {
    assert(message.params.id, '1');
    assert(message.params.name, 'foo');
    assert(message.topic, '/id/1/name/foo');
    assert(message.body, 'testdata');
  });

  router.route('/id/1/name/foo', 'testdata');
};

function test2() {
  let router = new Router();
  [
    {
      pub: '/id/1/name/foo',
      sub: '/id/:id/name/:name',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    }
  ].forEach((test) => {

    router.topic(test.sub, (message) => {
      deepEqual(message.params, test.params);
      assert(message.topic, test.pub);
      assert(message.body, test.message);
    });

    router.route(test.pub, test.message);
  });
};

function run() {
  test1();
  test2();
};
run();
