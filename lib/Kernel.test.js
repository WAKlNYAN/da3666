const Kernel = require('./Kernel');

test('Initialization works with promises', () => {
  const k = new Kernel();
  var testValue = 0;

  for (var x=0; x<10; x++) {
    k.whileInitializing(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          testValue++;
          resolve();
        }, 10);
      })
    );
  };

  expect(testValue).toEqual(0);

  return k
    .initialize()
    .then(() => {
      expect(testValue).toEqual(10);
    })
  ;
});

test('Initialization works without promises', () => {
  const k = new Kernel();

  return k.initialize().then(() => {
    expect(true).toEqual(true);
  });
});
