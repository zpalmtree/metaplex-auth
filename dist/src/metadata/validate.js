import Ajv from 'ajv'
import { metadataSchema } from './schema.js'
const ajv = new Ajv()
/**
 * Validator function for Metaplex NFT metadata objects. Returns true if metadata is valid.
 *
 * Can be used as a TypeScript type guard - if `validateMetadata(someObject)` returns `true`,
 * `someObject` can safely be treated as an instance of {@link MetaplexMetadata}.
 *
 */
export const validateMetadata = ajv.compile(metadataSchema)
/**
 *
 * @param m a JS object that hopefully contains valid metaplex NFT metadata
 * @returns the input object as an instance of {@link MetaplexMetadata} if input
 * is valid.
 * @throws {@link ValidationError} if input is not valid metaplex metadata.
 */
export function ensureValidMetadata(m) {
  if (!validateMetadata(m)) {
    throw new ValidationError(validateMetadata.errors)
  }
  return m
}
/**
 * Error thrown by {@link ensureValidMetadata} when validation fails.
 * The `message` will contain a description of all errors encountered.
 *
 * The original AJV `DefinedError` objects are exposed as the `errors`
 * property.
 */
export class ValidationError extends Error {
  constructor(errors) {
    const messages = []
    for (const err of errors) {
      switch (err.keyword) {
        case 'required':
          messages.push(
            `- required property ${err.params.missingProperty} missing`
          )
          break
        case 'propertyNames':
          messages.push(`- invalid property name: ${err.params.propertyName}`)
          break
        default:
          messages.push(err.message || 'unknown error')
      }
    }
    const message = 'metadata had validation errors: \n' + messages.join('\n')
    super(message)
    this.errors = errors
  }
}
