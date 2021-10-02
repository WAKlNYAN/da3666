#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const Store = require('./lib/Store.js');
const contentTypes = {
  base: require('./lib/contentType/base.js'),
  user: require('./lib/contentType/user.js'),
};
const {
  add,
  user,
} = require('./lib/util');

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
  store.loadEventsFromFile(options.db)
    .catch(() => {
      console.error('Creating a new db file');
    })
    .finally(() => {
      console.log(please(add(user(options.adduser))));

      console.log(store.entities)

      store.saveEventsToFile(options.db).then(() => {
        console.log('Saved');
      });
    });
} else {
  console.error('?');
}
