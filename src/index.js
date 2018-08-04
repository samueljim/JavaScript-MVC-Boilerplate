import app from './app';
import chalk from "chalk";

const {
  PORT = 8080
} = process.env;
app.listen(PORT, () => console.log(chalk.blue(`Listening on port ${PORT}`))); // eslint-disable-line no-console
