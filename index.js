'use strict';

const fetch = require('node-fetch');
const {send} = require('micro');
const showdown = require('showdown');
const url = require('url');
const {GraphQLClient} = require('graphql-request');
const frontmatter = require('front-matter');

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

  await client
    .request(query)
    .then(data => {
      data.repository.object.entries.map(entry => {
        if (entry.name.endsWith('.md')) {
          const fm = frontmatter(entry.object.text);
          returned['data'].push({
            content: converter.makeHtml(fm.body),
            meta: {
              name: entry.name,
              ...fm.attributes,
            },
          });
        }
      });
    })
    .catch(error => {
      const errorCode =
        error.response.errors[0].type === 'NOT_FOUND' ? 404 : 500;

      const errorMessage = error.response.errors[0].message
        ? error.response.errors[0].message
        : 'Sorry, something went wrong';

      return send(res, errorCode, {
        status: errorCode,
        message: errorMessage,
      });
    });

  send(res, 200, returned);
};
