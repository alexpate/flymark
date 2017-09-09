# flymark

Flymark is a microservice that provides converted markdown files from a given Github repo, via a JSON endpoint: (Markdown -> HTML -> JSON).

Flymark is built using [micro](https://github.com/zeit/micro) and hosted on [now](https://now.sh)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/alexpate/flymark&env=GITHUB_TOKEN)

## Example
The converted contents of [this repo](https://github.com/alexpate/flymark-example) can be accessed here:

**[https://flymark.now.sh/alexpate/flymark-example](https://flymark.now.sh/alexpate/flymark-example)**

## How to use
Make a request with the name of the owner and repo:
```
https://flymark.now.sh/{username}/{repo}/
```

This will return a JSON object with a `data` array of converted markdown files from the repo. Flymark will also convert any frontmatter, and return this along with the original file name in a `meta` object:

```javascript
{
  updated_at: "2017-08-28T19:16:17.295Z",
  data: [
    {
      content: "<h1>The converted markdown goes here</h1>",
      meta: {
        name: "product-manager.md",
        title: "Product Manager",
        description: "This is where a description could go",
        date: "2017-09-09T00:00:00.000Z"
      }
    },
    {
      content: "<h1>The converted markdown goes here</h1>"
      meta: {
        name: "senior-front-end-developer.md",
        title: "Senior front-end developer",
        description: "This is where a description could go",
        date: "1994-02-16T00:00:00.000Z"
      }
    },
    {
      content: "<h1>The converted markdown goes here</h1>",
      meta: {
        name: "junior-software-engineer.md",
        title: "Junior software engineer",
        description: "This is where a description could go",
        date: "2012-06-12T00:00:00.000Z"
      }
    }
  ]
}
```


## Use-cases
- Abstracting blog posts away from the presentational layer
- To host job articles on Github
- Because you like writing in Markdown, but want a fully static site...with no build steps...🤷‍
