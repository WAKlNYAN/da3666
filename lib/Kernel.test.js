const Kernel = require('./Kernel');
const {
  client,
  server,
  features,
} = require('./features');
const { mix } = require('./mixin');

jest.setTimeout(1000);

const forEachClass = (mixins, callback) => {
  mixins.forEach((mixin, idx) => {
    class WithMixin extends mix(Kernel).with(mixin) {};
    try {
      callback(new WithMixin(), features[idx]);
    } catch(e) {
      console.error(e);
    }
  });
};

const doTest = (withMixin, mixinName) => {
  describe(`Kernel${mixinName ? ` + "${mixinName}" feature` : ''}...`, () => {
    test('It handles RPC calls appropriately.', () => {
      expect(withMixin.rpcCall(
        'testMethod', 1, 2, 3
      )).toStrictEqual(['testMethod', 1, 2, 3]);
      expect(withMixin).toBeDefined();
    });

    test('Initialization works with promises', () => {
      const k = withMixin;
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
      const k = withMixin;

      return k.initialize().then(() => {
        expect(true).toEqual(true);
      });
    });

    test('RPC Registration Works', () => {
      const k = withMixin;
      const testRPCs = [
        ['1', '2', '3'],
        ['4']
      ];

      k.rpcRegister(testRPCs[0]);
      expect(k.rpcList()).toEqual(testRPCs[0]);

      k.rpcRegister(testRPCs[1]);
      expect(k.rpcList()).toEqual([
        ...testRPCs[0],
        ...testRPCs[1]
      ]);
    })
  });
}

var mixinIndex = 1;
doTest(new Kernel());
forEachClass(client, doTest);
