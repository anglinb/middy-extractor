middy-extractor
===

[![travis build](https://travis-ci.org/anglinb/middy-extractor.svg?branch=master)](https://travis-ci.org/anglinb/middy-extractor)

Middy middleware for connecting to redis. [Complete documentation](https://anglinb.github.io/middy-extractor/index.html)

## Getting Started

Installing `middy-extractor`

```bash
npm install --save middy # You need middy installed
npm install --save middy-extractor
```

Running the tests
```bash
npm test
```

## Usage

```javascript
const middyExtractor = require('middy-extractor')
const middy = require('middy')

const someHandler = (event, context, callback) => {

  // The redis instance is accessible from the event object
  let { gender, contentType }  = event.extr
  callback(null, gender + ' ' + contentType)
}

const handler = middy(someHandler)
  .use(middyExtractor({ extractions: {
    gender: 'requestContext.authorizer.claims.gender',
    contentType: 'headers.Content-Type',
  }, extractionDestKey: 'extr' })

module.exports = { handler }
```


## Contributing

Feel free to open a Pull Request or Issue w/ a bug report or feature request.
