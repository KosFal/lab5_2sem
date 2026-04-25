function asyncMap(array, asyncTask, cb) {
  var results = [];
  var completed = 0;

  if (array.length === 0) {
    return cb(null, []);
  }

  array.forEach(function(item, index) {
    asyncTask(item, function(err, value) {
      if (err) {
        return cb(err, null);
      }
      results[index] = value;
      completed = completed + 1;
      if (completed === array.length) {
        cb(null, results);
      }
    });
  });
}

function asyncMapPromise(array, asyncTask) {
  return new Promise(function(resolve, reject) {
    var results = [];
    var completed = 0;

    if (array.length === 0) {
      return resolve([]);
    }

    array.forEach(function(item, index) {
      asyncTask(item)
        .then(function(value) {
          results[index] = value;
          completed = completed + 1;
          if (completed === array.length) {
            resolve(results);
          }
        })
        .catch(function(err) {
          reject(err);
        });
    });
  });
}

function doublePromise(num) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(num * 2);
    }, 100);
  });
}

async function runExample() {
  try {
    var result = await asyncMapPromise([1, 2, 3], doublePromise);
    console.log(result); 
  } catch (err) {
    console.error("помилка:", err);
  }
}

runExample();
