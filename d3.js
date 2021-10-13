#!/usr/bin/env node

const Server = require('./lib/Server');
const Client = require('./lib/Client');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  debug: {
    any: debugAny,
    cli: debug,
  },
  cli: {
    options: cliOptions,
    usage: cliUsage,
  },
  db,
} = require('./config');

const options = commandLineArgs(cliOptions)
const noOptions = Object.keys(options).length < 1;
if (!options.db) options.db = db;

if (options.help || noOptions) {
  const usage = commandLineUsage(cliUsage)
  console.log(usage)
} else {
  const server = new Server();
  const client = new Client({
    username: 'Bob',
    password: 'xyzzy',
  });

  const rpcMethods = client.rpcList();

  const rpc = rpcMethods.reduce((methods, method) => ({
      ...methods,
      [method]: (...args) => {
        log(`Calling ${method}`);
        return client.rpcCall(method, ...args);
      },
    }), {})
  ;
  const {
    getEntityById,
    addCommentToEntity,
    beSilly,
  } = rpc;

  server
    .initialize()
    .then(client.initialize.bind(client))
    .then(() => {
      if (options.test) {
        return addCommentToEntity(
          { id: 1 },
          { text: 'xyzzy' }
        );

      } else if (options.entity) {
        return getEntityById({ id: parseInt(options.entity) });

      } else if (options.rpc) {
        return Promise.resolve(
          rpcMethods
        );

      } else if (options.silly) {
        return beSilly('xyzzy', 'plugh', [1,2,3]);

      }
    })
    .then((...args) => {
      console.log(...args);
    })
    .catch((error) => log(error))
    .finally(() => {
      client.close();
      server.close();
      process.exit();
    })
  ;
}

function log() {
  if (debug && debugAny) {
    console.log.apply(console, [
      'D³CLI:',
      ...arguments,
    ]);
  }
}
