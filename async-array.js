function tripleAsync(num, timers, cb) {
  var t = setTimeout(function() {
    cb(null, num * 3);
  }, 200);
  timers.push(t);
}

function triplePromise(num, timers) {
  return new Promise(function(resolve) {
    var t = setTimeout(function() {
      resolve(num * 3);
    }, 200);
    timers.push(t);
  });
}

console.log("=== demo 1: callback ===");
asyncMap([1, 2, 3, 4], tripleAsync, function(err, result) {
  if (err) return console.error("помилка:", err.message);
  console.log("callback result:", result); 
});

console.log("=== demo 2: promise ===");
asyncMapPromise([5, 10, 15], triplePromise)
  .then(function(result) {
    console.log("promise result:", result); 
  })
  .catch(function(err) {
    console.error("помилка:", err.message);
  });

console.log("=== demo 3: async/await ===");
async function runAwait() {
  try {
    var result = await asyncMapPromise([2, 4, 6], triplePromise);
    console.log("await result:", result); 
  } catch (err) {
    console.error("помилка:", err.message);
  }
}
runAwait();

console.log("=== demo 4: callback + abort ===");
var controller1 = new AbortController();

asyncMap([10, 20, 30], tripleAsync, function(err, result) {
  if (err) {
    console.log("callback скасовано:", err.message); 
  } else {
    console.log("callback result (не мало виконатись):", result);
  }
}, controller1.signal);

setTimeout(function() {
  controller1.abort(); 
}, 50);

console.log("=== demo 5: promise + abort ===");
var controller2 = new AbortController();

asyncMapPromise([7, 8, 9], triplePromise, controller2.signal)
  .then(function(result) {
    console.log("promise result (не мало виконатись):", result);
  })
  .catch(function(err) {
    console.log("promise скасовано:", err.message); 
  });

setTimeout(function() {
  controller2.abort();
}, 50);

console.log("=== demo 6: abort до старту ===");
var controller3 = new AbortController();
controller3.abort(); 

asyncMap([1, 2], tripleAsync, function(err, result) {
  console.log("вже скасовано одразу:", err.message); 
}, controller3.signal);
