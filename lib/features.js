module.exports = [
  require('./feature/Entity'),
  require('./feature/Request'),
  require('./feature/Silly'),
  require('./feature/WebSocket'),
  require('./feature/WebSocketAuthentication'),
].reduce((exports, { client, server }) => ({
  ...exports,
  server: [...exports.server || [], server],
  client: [...exports.client || [], client],
}), {});
