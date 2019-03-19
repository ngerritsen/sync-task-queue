'use strict';

/**
 * @typedef {Object} TaskQueue
 * @property {Function} enqueue
 */

 /**
 * @typedef {Object} Task
 * @property {Function} fn
 * @property {Function} resolve
 * @property {Function} reject
 * @property {Promise}  promise
 */

/**
 * @returns {TaskQueue}
 */
function createTaskQueue() {
  /** @type {Task[]} */
  var queue = [];

  /**
   * @param {Function}  fn
   * @param {Array}     [args=[]]
   * @returns {Promise}
   */
  function enqueue(fn, args) {
    validate(fn, args);

    var shouldRun = queue.length === 0;
    var task = createTask(fn, args);

    queue.push(task);

    if (shouldRun) {
      run();
    }
    
    return task.promise;
  }

  /**
   * @param {Function}  fn
   * @param {Array}     [args=[]]
   */
  function validate(fn, args) {
    if (typeof fn !== 'function') {
      throw new Error('Please provide a function to enqueue.');
    }

    if (args && !Array.isArray(args)) {
      throw new Error('Please provide task arguments as an array to enqueue.');
    }
  }

  /**
   * @returns {Promise}
   */
  function run() {
    var task = queue[0];

    Promise.resolve(task.fn.apply(undefined, task.args || []))
      .then(task.resolve)
      .catch(task.reject)
      .then(handleResult);
  }

  function handleResult() {
    queue.shift();
  
    if (queue.length === 0) {
      return;
    }

    run();
  }

  return {
    enqueue: enqueue
  };
}

/**
 * @param {Function}  fn
 * @param {Array}     [args=[]]
 * @returns {Task}
 */
function createTask(fn, args) {
  var resolve, reject;
  
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });

  return {
    fn: fn,
    args: args,
    resolve: resolve,
    reject: reject,
    promise: promise
  };
}

module.exports = createTaskQueue;
