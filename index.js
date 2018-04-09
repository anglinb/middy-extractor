const debug = require('debug')('middy-extractor')

/**
 * @function extractValueFromPath
 * @param {Object} obj - Object from which the value with be extracted
 * @param {string} extractionPath - Dot notation path for extraction
 * @example
 *
 * let obj = {
 *   user: {
 *      name: {
 *        firstName: "Brian"
 *      }
 *   }
 * }
 *
 *
 * let firstName = extractValueFromPath(obj, 'user.name.firstName')
 * console.log(firstName) // 'Brian'
 */

const extractValueFromPath = (obj, extractorPath) => {
  debug('enter extractValue: %o %o', obj, extractorPath)
  let elements = extractorPath.split('.')
  let value = obj
  for (var i = 0; i < elements.length; i++) {
    let nextValue = value[elements[i]]
    if (nextValue === undefined) {
      return null
    }
    value = nextValue
  }
  debug('got value (%o) for extractorPath: %s', value, extractorPath)
  return value
}

/**
 * Middy Extractory - Extracts values from event and writes them to a key
 * @module middy-extractor
 * @param {Object} config - Configuration for middleware
 * @param {string} config.extractionDestKey - What key on the event to assign the map of extracted values
 * @param {Object.<string,string>} config.extractions - Object that maps from name of extraction to extraction location
 * @example
 *
 * const middyExtractor = require('middy-extractor')
 * const middy = require('middy')
 *
 * const someHandler = (event, context, callback) => {
 *
 *   // The redis instance is accessible from the event object
 *   let { gender, contentType }  = event.extr
 *   callback(null, gender + ' ' + contentType)
 * }
 *
 * const handler = middy(someHandler)
 *   .use(middyExtractor({ extractions: {
 *     gender: 'requestContext.authorizer.claims.gender',
 *     contentType: 'headers.Content-Type',
 *   }, extractionDestKey: 'extr' })
 *
 * module.exports = { handler }
 *
 */
module.exports = ({ extractions = {}, extractionDestKey = 'extracted' } = {}) => {
  debug('intializing with extractions: %o and extractionDestKey: %o', extractions, extractionDestKey)

  /**
   * Before - Called to load redis, will wait until redis is ready to proceed
   * @function before
   * @param {Object} handler - Current handler
   * @modifies {handler}
   */
  const before = (handler, next) => {
    debug('entering before')
    let extracted = {}
    Object.keys(extractions).forEach((extractionKey) => {
      debug('pulling for key: %o', extractionKey)
      let extractionPath = extractions[extractionKey]
      let value = extractValueFromPath(handler.event, extractionPath)
      debug('value: %s', value)
      extracted[extractionKey] = value
    })
    debug('extractions: %o', extracted)
    handler.event[extractionDestKey] = extracted
    next()
  }

  return {
    before
  }
}
