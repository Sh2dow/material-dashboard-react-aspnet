module.exports = function (config) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        querystring: require.resolve("querystring-es3"),
      },
    },
  }
}