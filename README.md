[![Build Status](https://travis-ci.org/ngerritsen/sync-task-queue.svg?branch=master)](https://travis-ci.org/ngerritsen/sync-task-queue)

# Sync Task Queue

Makes sure async tasks are executed in sequence.

- 🎂 _No_ dependencies!
- 💎 __0.8kB__ minified!
- 🦄 Compatible with _Node >= 4_ and _all_ browsers that support Promises

## Usage

```js
const createTaskQueue = require('sync-task-queue');

const taskQueue = createTaskQueue();

function taskA() {
  console.log('Starting HTTP request A');

  return doHttpRequest('/a');
}

function taskB() {
  console.log('Starting HTTP request B');

  return doHttpRequest('/b');
}

taskQueue.enqueue(taskA)
  .then(() => console.log('Done with HTTP request A'));

taskQueue.enqueue(taskB)
  .then(() => console.log('Done with HTTP request B'));

/**
 * Output:
 * 
 * Starting HTTP request A
 * Done with HTTP request A
 * Starting HTTP request B
 * Done with HTTP request B
 */
```

The task queue will make sure `taskB` does not start after `taskA` has finished.


> Note that for tasks to be run in sequence, they MUST use the same instance of the taskQueue. This means you can create multiple taskQueue's for different parts of your application to still run in parallel.

You can pass in arguments to the task by passing them as an array:

```js
taskQueue.enqueue(taskA, ['x', 1]);
```

Our you can just use a callback:

```js
taskQueue.enqueue(() => taskA('x', 1));
```

Enqueue will return a promise that will resolve (or reject with) the result of the task.

```js
taskQueue
  .enqueue(() => doHttpRequest('/a'))
  .then(result => console.log(result)); // Will log the result of the HTTP request.
  .catch(error => console.error(error)); // Will log an error that occurred in the HTTP request.
```

> The task queue will continue to execute the next tasks if one task rejects.
