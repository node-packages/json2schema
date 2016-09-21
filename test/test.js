/**
 * Created by ferron on 9/21/16.
 */

var assert = require('chai').assert;
var generalizeFrom = require('../index');

describe('basic object generalization', function () {

  // TODO: compare set values as sets, e.g., when type: string[]
  it('should generalize homogenous number types', function () {
    var actual = generalizeFrom(100, -90, 45, 3.14159);
    assert.deepEqual(actual, { type: 'number' });
  });

  it('should generalize homogenous string types', function () {
    var actual = generalizeFrom('I could', 'not', 'care', 'less!');
    assert.deepEqual(actual, { type: 'string' });
  });

  it('should generalize nullable string types', function () {
    var actual = generalizeFrom('Hello', null, 'world!', null);
    assert.deepEqual(actual, { type: ['string', 'null'] });
  });

  it('should generalize more than two distinct types', function () {
    var actual = generalizeFrom(null, 'Hello', 123);
    assert.deepEqual(actual, { type: ['null', 'string', 'number'] });
  });

  it('should ignore undefined instances', function () {
    var actual = generalizeFrom(1, 2, undefined, 3);
    assert.deepEqual(actual, { type: 'number' });
  });

  it('should generalize identical object types', function () {
    var actual = generalizeFrom({ name: 'Curious George', age: 5 }, { name: 'Mark Bedelman', age: 47 });
    assert.deepEqual(actual, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' }
      }
    });
  });

  it('should build schema from distinct types', function () {
    var actual = generalizeFrom('incredible', 800);
    assert.deepEqual(actual, {
      type: ['string', 'number']
    });
  });

  it('should build schema from objects with distinct property sets', function () {
    var actual = generalizeFrom({ name: 'Curious George', age: 5 }, { breed: 'Schnauzer', age: false });
    assert.deepEqual(actual, {
      type: 'object',
      properties: {
        name: { type: 'string' },
        breed: { type: 'string' },
        age: {
          type: ['number', 'boolean']
        }
      }
    });
  });

  it('should build schema from objects with identical object types but different lengths', function () {
    var actual = generalizeFrom(
      [
        { name: 'Curious George', email: 'cgeorge@example.org' }
      ],
      [
        { name: 'Bran Kurtz', email: 'bkurtz@example.org' },
        { name: 'Kev Bravado', email: 'kbravado@example.org' }
      ]
    );
    assert.deepEqual(actual, {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    });
  });
});
