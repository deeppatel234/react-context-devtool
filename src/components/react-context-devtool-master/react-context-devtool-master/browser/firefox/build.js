const chalk = require("chalk");
const build = require("../../build/build");

const startBuild = async () => {

  console.log(chalk.white.bgBlue("\nThe Firefox extension build started"));

  try {
    await build("firefox");

    console.log(chalk.white.bgBlue("\nThe Firefox extension build successfully\n"));
  } catch (err) {
    console.error(err);
    console.log(chalk.red("\nThe Firefox extension build failed\n"));
  }
};

startBuild();
