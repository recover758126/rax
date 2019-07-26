module.exports = ({ chainWebpack }, value) => {
  chainWebpack((config) => {
    config.output.path(value);
  });
};
