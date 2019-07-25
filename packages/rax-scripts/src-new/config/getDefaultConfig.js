const path = require('path');

module.exports = ({type, command, target, context}) => {
  let config = {};
  let configPath = '';

  if (type === 'app') {
    configPath = path.resolve(__dirname, `../config/app/${command}Config/${target}`);
  }

  if (type === 'api') {
    configPath = path.resolve(__dirname, `../config/api/${command}Config/`);
  }

  try {
    config = require(configPath);
  } catch (err) {
    console.error(`Fail to load config file ${configPath}`);
    console.error(err);
    process.exit(1);
  }

  return config(context);
};
