#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const {
  EVENT_TYPE_ANY,
  EVENT_TYPE_ADD,
  EVENT_TYPE_DELETE,
  EVENT_TYPE_MUTATE,

  ENTITY_TYPE_USER,
  ENTITY_TYPE_COMMENT,
  ENTITY_TYPE_MUTATION,
} = require('./constants');
const {
  debug: {
    any: debugAny,
    cli: debug,
  },
  db,
} = require('./config');
const eventClasses = require('./lib/model/events');
const entityClasses = require('./lib/model/entities');
const Server = require('./Server');
const Client = require('./Client');

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
  ['getEntityById', 'addEntity'].forEach(
    method => {
      global[method] = (args) => (
        client
          .call(method, args)
          .then(console.log)
          .catch(log)
      )
    }
  );

  server
    .initialize()
    .then(() => client.initialize())
    .then(() => {
      if (options.adduser) {
        console.log('Nope');
      } else if (options.test) {
        client.addCommentToEntity({
          originalEntity: {
            id: 1
          },
          commentEntity: {
            text: 'xyzzy'
          }
        }).then(console.log).catch(log);
      } else if (options.entity) {
        const id = parseInt(options.entity);
        getEntityById({ id });
      }
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
