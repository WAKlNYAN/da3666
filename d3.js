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

  const rpcMethods = client.rpcMethods();
  const {
    getEntityById,
    addCommentToEntity,
    beSilly,
  } = Object
    .keys(rpcMethods)
    .reduce((methods, method) => ({
      ...methods,
      [method]: (...args) => {
        log(`Calling ${method}`);
        return rpcMethods[method](...args);
      },
    }), {})
  ;

  server
    .initialize()
    .then(client.initialize.bind(client))
    .then(() => {
      if (options.test) {
        return addCommentToEntity({
          originalEntity: {
            id: 1
          },
          commentEntity: {
            text: 'xyzzy'
          }
        });

      } else if (options.entity) {
        return getEntityById({ id: parseInt(options.entity) });

      } else if (options.rpc) {
        return Promise.resolve(
          Object.keys(rpcMethods)
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
