require("dotenv").config();
require("isomorphic-fetch");
const prismic = require("@prismicio/client");

const repositoryName = process.env.REPOSITORY_NAME;
const accessToken = process.env.ACCESS_TOKEN;

const client = prismic.createClient(repositoryName, {
  accessToken: accessToken,
});

module.exports = { client };
