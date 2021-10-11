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

  const rpcMethods = client.getRPCMethods();

  server
    .initialize()
    .then(client.initialize.bind(client))
    .then(() => {
      const {
        getEntityById,
        addCommentToEntity,
      } = rpcMethods;

      if (options.test) {
        return addCommentToEntity({
          originalEntity: {
            id: 1
          },
          commentEntity: {
            text: 'xyzzy'
          }
        }).then(console.log).catch(log);

      } else if (options.entity) {
        const id = parseInt(options.entity);
        return getEntityById({ id }).then(console.log);

      } else if (options.rpc) {
        console.log(Object.keys(rpcMethods));
        return false;
      }
    })
    .then(() => {
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
