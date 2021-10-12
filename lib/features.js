module.exports = [
  require('./feature/Comment'),
  require('./feature/Entity'),
  require('./feature/Request'),
  require('./feature/WebSocket'),
  require('./feature/Silly'),
  require('./feature/WebSocketAuthentication'),
].reduce((exports, { client, server }) => ({
  ...exports,
  server: [...exports.server || [], server],
  client: [...exports.client || [], client],
}), {});
