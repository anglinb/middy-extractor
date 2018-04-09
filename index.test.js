const middy = require('middy')
const extractorMiddlewareFactory = require('./')

describe('middy-extractor', () => {
  it('should extract keys', (done) => {
    const handler = middy((event, context, callback) => {
      callback(null, event.extracted)
    })

    handler.use(extractorMiddlewareFactory({ extractions: {
      'gender': 'requestContext.authorizer.claims.gender',
      'username': 'requestContext.authorizer.claims.cognito:username',
      'contentType': 'headers.Content-Type'
    }}))

    let event = {
      requestContext: {
        authorizer: {
          claims: {
            gender: 'male',
            'cognito:username': 'banglin'
          }
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
    handler(event, null, (err, resp) => {
      expect(err).toBe(null)
      expect(resp).toEqual({
        gender: 'male',
        username: 'banglin',
        contentType: 'application/json'
      })
      done()
    })
  })
  it('should return null for keys that do not exist', (done) => {
    const handler = middy((event, context, callback) => {
      callback(null, event.extracted)
    })

    handler.use(extractorMiddlewareFactory({ extractions: {
      'gender': 'requestContext.authorizer.claims.gender',
      'username': 'requestContext.authorizer.claims.cognito:username',
      'contentType': 'headers.Content-Type'
    }}))

    let event = {
      requestContext: {
        authorizer: {
          claims: {
            gender: 'male'
          }
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
    handler(event, null, (err, resp) => {
      expect(err).toBe(null)
      expect(resp).toEqual({
        gender: 'male',
        username: null,
        contentType: 'application/json'
      })
      done()
    })
  })
})
