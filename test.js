'use strict';

const createTaskQueue = require('./index');

test('Run tasks in sequence.', async () => {
  const results = [];
  const taskQueue = createTaskQueue();

  const fnA = () => delay(10).then(() => results.push('a'));
  const fnB = () => delay(1).then(() => results.push('b'));

  await Promise.all([taskQueue.enqueue(fnA), taskQueue.enqueue(fnB)]);

  expect(results).toEqual(['a', 'b']);
});

test('Returns the result.', async () => {
  const taskQueue = createTaskQueue();

  const fn = () => delay(1).then(() => 'x');

  const result = await taskQueue.enqueue(fn);

  expect(result).toBe('x');
});

test('Rejects an error.', async () => {
  expect.assertions(1);

  const taskQueue = createTaskQueue();

  const fn = () => Promise.reject('error');

  try {
    await taskQueue.enqueue(fn);
  } catch (error) {
    expect(error).toBe('error');
  }
});

test('Passes the arguments to the function.', async () => {
  const taskQueue = createTaskQueue();

  const fn = (a, b) => delay(1).then(() => a + b);

  const result = await taskQueue.enqueue(fn, [2,3]);

  expect(result).toBe(5);
});

test('Preserves the this arguments that are in an arrow function.', async () => {
  const taskQueue = createTaskQueue();

  const myObject = {
    a: 2,
    task() {
      return taskQueue.enqueue(() => Promise.resolve(this.a));
    }
  }

  const result = await myObject.task();

  expect(result).toBe(2);
});

test('Throws when trying to enqueue a non function.', async () => {
  const taskQueue = createTaskQueue();

  expect(() => taskQueue.enqueue('a')).toThrow('Please provide a function to enqueue.');
});

test('Throws when trying to enqueue with non array arguments.', async () => {
  const taskQueue = createTaskQueue();
  const task = () => {};

  expect(() => taskQueue.enqueue(task, 'x')).toThrow('Please provide task arguments as an array to enqueue');
});

/**
 * @param {number} ms
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
