#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { setOptions, mockHTTP } = require('./lib/da3000');
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
  }
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
if (!options.db) options.db = './db.json';
setOptions(options);

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
  function addEntity(entity) {
    return client.call('addEntity', entity);
  }
  server
    .initialize()
    .then(() => client.initialize())
    .then(() => {
      if (options.adduser) {
        addUser(options.adduser);
      } else if (options.test) {
        client
          .call('getEntityById', { id: 1 })
          .then(console.log)
          .catch(log)
        ;
      } else if (options.entity) {
        client
          .call('getEntityById', { id: parseInt(options.entity) })
          .then(console.log)
          .catch(log)
        ;
      }
    });
}

function addUser(username) {
  return mockHTTP(makeEvent(EVENT_TYPE_ADD, ENTITY_TYPE_USER, username));
}

function mutateUser(args) {
  return mockHTTP(makeEvent(EVENT_TYPE_MUTATE, ENTITY_TYPE_MUTATION, args));
}

function addComment(args) {
  return mockHTTP(makeEvent(EVENT_TYPE_ADD, ENTITY_TYPE_COMMENT, args));
}

function makeEvent(eventType, entityType, payload) {
  const event = new eventClasses[eventType](
    new entityClasses[entityType](payload)
  );

  return JSON.stringify(event);
}

function log() {
  if (debug && debugAny) {
    console.log.apply(console, [
      'D³CLI:',
      ...arguments,
    ]);
  }
}
