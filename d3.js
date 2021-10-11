#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  debug: {
    any: debugAny,
    cli: debug,
  },
  db,
} = require('./config');
const Server = require('./lib/Server');
const Client = require('./lib/Client');
const { mix } = require('./lib/mixin');

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'file',
    alias: 'f',
    type: String,
    multiple: false,
    description: 'Database file to use',
    typeLabel: '<files>'
  },
  {
    name: 'adduser',
    alias: 'u',
    type: String,
    description: 'Add user'
  },
  {
    name: 'entity',
    alias: 'e',
    type: String,
    description: 'Lookup entity'
  },
  {
    name: 'test',
    alias: 't',
    type: Boolean,
    description: 'Run Test'
  },
  {
    name: 'rpc',
    alias: 'r',
    type: Boolean,
    description: 'List RPC methods'
  }
]

const options = commandLineArgs(optionDefinitions)
const noOptions = Object.keys(options).length < 1;
if (!options.db) options.db = db;

if (options.help || noOptions) {
  const usage = commandLineUsage([
    {
      header: 'DA3666',
      content: 'D3 Demonstration CLI'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      content: 'Project home: {underline https://github.com/WAKlNYAN/da3666}\n'+
        `Database File: ${options.db}`
    }
  ])
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
    .then(() => client.initialize())
    .then(() => {
      const {
        getEntityById,
        addCommentToEntity,
      } = rpcMethods;
      if (options.adduser) {
        console.log('Nope');
        return Promise.resolve();
      } else if (options.test) {
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
