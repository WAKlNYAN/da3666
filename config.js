const cliOptions = [
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
  },
  {
    name: 'silly',
    alias: 'x',
    type: Boolean,
    description: 'Silliness'
  }
];

module.exports = {
  ws: {
    port: 8081,
    address: 'localhost',
  },
  debug: {
    any: true,
    cli: true,
    client: true,
    server: true,
    serverStore: true,
  },
  cli: {
    usage: [
      {
        header: 'DA3666',
        content: 'D3 Demonstration CLI'
      },
      {
        header: 'Options',
        optionList: cliOptions,
      },
      {
        content: 'Project home: {underline https://github.com/WAKlNYAN/da3666}\n'
      }
    ],
    options: cliOptions,
  },
  db: './db.json',
};
