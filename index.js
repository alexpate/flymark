'use strict';

const fetch = require('node-fetch');
const {send} = require('micro');
const showdown = require('showdown');
const url = require('url');
const {GraphQLClient} = require('graphql-request');
const converter = new showdown.Converter();

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

module.exports = async function(req, res) {
  const {pathname} = url.parse(req.url, true);
  const params = pathname.split('/');
  const user = params[1];
  const repo = params[2];

  if (!user || !repo) {
    return send(res, 400, {
      status: 400,
      message:
        'One of both of the required parameters (user and repo) were missing',
    });
  }

  const query = `{
    repository(owner:"${user}", name: "${repo}") {
      object(expression: "master:") {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }`;

  const returned = {
    updated_at: new Date(),
    status: 200,
    data: [],
  };

  await client.request(query).then(data => {
    data.repository.object.entries.map(entry => {
      if (entry.name.endsWith('.md')) {
        returned['data'].push({
          name: entry.name,
          content: converter.makeHtml(entry.object.text),
        });
      }
    });
  });

  send(res, 200, returned);
};
