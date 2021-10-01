#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const fs = require('fs');
const Store = require('./lib/Store.js');
const contentTypes = {
  base: require('./lib/contentType/base.js'),
  user: require('./lib/contentType/user.js'),
};

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Display this usage guide.'
  },
  {
    name: 'db',
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
    name: 'test',
    alias: 't',
    type: Boolean,
    description: 'Run Test'
  }
]

const options = commandLineArgs(optionDefinitions)

if (!options.db) options.db = './db.json';
console.log(`DB: ${options.db}`);

if (options.help || Object.keys(options).length < 1) {
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
      content: 'Project home: {underline https://github.com/WAKlNYAN/da3666}'
    }
  ])
  console.log(usage)
} else if (options.adduser) {
  const store = new Store();
  const please = store.processEvent.bind(store);
  store.loadEventsFromFile(options.db).then(() => {
    console.log(please(add(user(options.adduser))));

    console.log(store.entities)

    store.saveEventsToFile(options.db).then(() => {
      console.log('Saved');
    });
  });
} else {
  console.error('?');
}

function add(content) {
  if (content.isValid()) {
    return {
      sourceId: -1,
      ADD: content,
    };
  } else {
    return `Content not added`;
  }
}

function user(args) {
  return new contentTypes.user(args);
}
