module.exports = ({ context, config }) => {
  const { userConfig, target } = context;
  const { outputDir } = userConfig;

  config.output.path(outputDir);
};
