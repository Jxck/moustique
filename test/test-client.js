import {Client} from '../src/client';

function assert(actual, expected) {
  console.log('.');
  console.assert(actual === expected, '\nact: ' + actual + '\nexp: ' + expected);
}

function error() {
  // new
  ['', null, undefined, {}, 1, NaN, function(){}].forEach((v) => {
    try {
      new Client(v, 'a');
      throw new Error('cant be here');
    } catch(err) {
      assert(err instanceof TypeError, true);
    }
  });

  ['', null, undefined, {}, 1, NaN, function(){}].forEach((v) => {
    try {
      new Client('a', v);
      throw new Error('cant be here');
    } catch(err) {
      assert(err instanceof TypeError, true);
    }
  });

  let client = new Client('a', 'b');

  // connect
  try {
    client.connect('ws://example.com', { will: { topic: '/a', payload: '' }});
    throw new Error('cant be here');
  } catch(err) {
    assert(err instanceof TypeError, true);
  }

  // sub
  try {
    client.sub('/a', ()=>{});
    throw new Error('cant be here');
  } catch(err) {
    assert(err instanceof TypeError, true);
  }

  // pub
  try {
    client.pub('/a', '');
    throw new Error('cant be here');
  } catch(err) {
    assert(err instanceof TypeError, true);
  }
};

function run() {
  error();
};
run();
