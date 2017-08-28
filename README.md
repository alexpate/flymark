# flymark

Flymark is a microservice that provides converted markdown files from a given Github repo, via a JSON endpoint: (Markdown -> HTML -> JSON).

Flymark is built using [micro](https://github.com/zeit/micro) and hosted on [now](https://now.sh)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/alexpate/flymark&env=GITHUB_TOKEN)

## How to use
Make a request with the name of the owner and repo:
```
https://flymark.ap.codes/{username}/{repo}/
```

This will return a JSON object with a `data` array of converted markdown files from the repo:

```json
{
  updated_at: "2017-08-28T19:16:17.295Z",
  data: [
    {
      name: "product-manager.md",
      content: "<h1>The converted markdown goes here</h1>"
    },
    {
      name: "senior-front-end-developer.md",
      content: "<h1>The converted markdown goes here</h1>"
    },
    {
      name: "junior-software-engineer.md",
      content: "<h1>The converted markdown goes here</h1>"
    }
  ]
}
```


## Use-cases
- Abstracting blog posts away from the presentational layer
- To host job articles on Github
- Because you like writing in Markdown, but want a fully static site...with no build steps...🤷‍
