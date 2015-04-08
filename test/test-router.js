import {Router} from '../src/router';

function assert(actual, expected) {
  console.log('.');
  console.assert(actual === expected, '\nact: ' + actual + '\nexp: ' + expected);
}

function deepEqual(actual, expected) {
  if (require) {
    require('assert').deepEqual(actual, expected);
  } else {
    assert(JSON.stringify(actual), JSON.stringify(expected));
  }
}

function sample() {
  let router = new Router();
  router.topic('/id/:id/name/:name', (message) => {
    assert(message.params.id, '1');
    assert(message.params.name, 'foo');
    assert(message.topic, '/id/1/name/foo');
    deepEqual(message.body, { foo: 'bar' });
  });

  router.route('/id/1/name/foo', { foo: 'bar' });
};

function match() {
  let testcase = [
    {
      sub: '/id/:id/name/:name',
      pub: '/id/1/name/foo',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    },
    {
      sub: '/id/1/name/foo',
      pub: '/id/1/name/foo',
      params: {},
      message: 'test'
    },
    {
      sub: '/id/:id/name/:name?',
      pub: '/id/1/name/foo',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    },
    {
      sub: '/id/:id/name/:name?',
      pub: '/id/1/name/',
      params: {
        id: '1',
        name: undefined
      },
      message: 'test'
    },
    {
      sub: '/id/:id/name/:name?',
      pub: '/id/1/name',
      params: {
        id: '1',
        name: undefined
      },
      message: 'test'
    },
    {
      sub: '/:id/:name',
      pub: '/1/foo',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    },
    {
      sub: '/:id/:name?',
      pub: '/1/foo',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    },
    {
      sub: '/:id/:name?',
      pub: '/1/',
      params: {
        id: '1',
        name: undefined
      },
      message: 'test'
    },
    {
      sub: '/:id/:name?',
      pub: '/1',
      params: {
        id: '1',
        name: undefined
      },
      message: 'test'
    },
    {
      sub: '/:id/:name?/:age',
      pub: '/1/foo/25',
      params: {
        id: '1',
        name: 'foo',
        age: '25'
      },
      message: 'test'
    },
    {
      sub: '/:id/:name?/aaa/bbb/ccc',
      pub: '/1/foo/aaa/bbb/ccc',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    },
    {
      sub: '/:id/:name?/aaa/bbb/:age?',
      pub: '/1/foo/aaa/bbb/25',
      params: {
        id: '1',
        name: 'foo',
        age: '25'
      },
      message: 'test'
    },
    {
      sub: '/:id?/:name',
      pub: '/1/foo',
      params: {
        id: '1',
        name: 'foo'
      },
      message: 'test'
    },
    {
      sub: '/:id?/:name?/:age?',
      pub: '/1/foo/25',
      params: {
        id: '1',
        name: 'foo',
        age: '25'
      },
      message: 'test'
    },
    {
      sub: 'a',
      pub: 'a',
      params: {
      },
      message: 'test'
    },
    {
      sub: '/',
      pub: '/',
      params: {
      },
      message: 'test'
    },
  ];

  let count = 0;
  testcase.forEach((test) => {
    let router = new Router();
    router.topic(test.sub, (message) => {
      deepEqual(message.params, test.params);
      assert(message.topic, test.pub);
      assert(message.body, test.message);
      count++;
    });

    router.route(test.pub, test.message);
  });

  assert(testcase.length, count);
};

function unmatch() {
  let testcase = [
    {
      sub: '/id/:id/name/:name',
      pub: '/id/1/name/'
    },
    {
      sub: '/id/:id/name/:name',
      pub: '/id/1/name'
    },
    {
      sub: '/id/:id/:name/:age',
      pub: '/id/1'
    }
  ];

  testcase.forEach((test) => {
    let router = new Router();
    router.topic(test.sub, (message) => {
      throw new Error('cant be here');
    });

    router.route(test.pub, test.message);
  });
}

function error() {
  let router = new Router();

  ['', null, undefined, {}, 1, NaN, function(){}].forEach((topic) => {
    try {
      router.topic(topic, () => {});
      throw new Error('cant be here');
    } catch(err) {
      assert(err instanceof TypeError, true);
    }
  });

  [null, undefined, {}, 1, NaN, ''].forEach((callback) => {
    try {
      router.topic('/a', callback);
      throw new Error('cant be here');
    } catch(err) {
      assert(err instanceof TypeError, true);
    }
  });

  try {
    router.route('', 'test');
    throw new Error('cant be here');
  } catch(err) {
    assert(err instanceof TypeError, true);
  }
}

function run() {
  sample();
  match();
  unmatch();
  error();
};
run();
