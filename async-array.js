function asyncMap(array, asyncTask, cb, signal) {
  var results = [];
  var completed = 0;
  var timers = [];      
  var aborted = false;

  function onAbort() {
    aborted = true;
    timers.forEach(function(t) { clearTimeout(t); });
    timers = [];
    cb(new Error("AbortError: операцію скасовано"), null);
  }

  if (signal) {
    if (signal.aborted) {
      return cb(new Error("AbortError: вже скасовано"), null);
    }
    signal.addEventListener("abort", onAbort);
  }

  if (array.length === 0) {
    if (signal) signal.removeEventListener("abort", onAbort);
    return cb(null, []);
  }

  array.forEach(function(item, index) {
    asyncTask(item, timers, function(err, value) {
      if (aborted) return; 

      if (err) {
        if (signal) signal.removeEventListener("abort", onAbort);
        return cb(err, null);
      }

      results[index] = value;
      completed = completed + 1;

      if (completed === array.length) {
        if (signal) signal.removeEventListener("abort", onAbort); 
        cb(null, results);
      }
    });
  });
}

function asyncMapPromise(array, asyncTask, signal) {
  return new Promise(function(resolve, reject) {
    var results = [];
    var completed = 0;
    var timers = [];

    function onAbort() {
      timers.forEach(function(t) { clearTimeout(t); }); 
      timers = [];
      reject(new Error("AbortError: операцію скасовано"));
    }

    if (signal) {
      if (signal.aborted) {
        return reject(new Error("AbortError: вже скасовано"));
      }
      signal.addEventListener("abort", onAbort);
    }

    if (array.length === 0) {
      if (signal) signal.removeEventListener("abort", onAbort);
      return resolve([]);
    }

    array.forEach(function(item, index) {
      asyncTask(item, timers)
        .then(function(value) {
          results[index] = value;
          completed = completed + 1;
          if (completed === array.length) {
            if (signal) signal.removeEventListener("abort", onAbort); 
            resolve(results);
          }
        })
        .catch(function(err) {
          if (signal) signal.removeEventListener("abort", onAbort);
          reject(err);
        });
    });
  });
}
