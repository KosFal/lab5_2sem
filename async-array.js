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

function doubleAsync(num, cb) {
  setTimeout(function() {
    cb(null, num * 2);
  }, 100);
}

asyncMap([1, 2, 3], doubleAsync, function(err, result) {
  if (err) {
    console.error("помилка:", err);
  } else {
    console.log(result);
  }
});
