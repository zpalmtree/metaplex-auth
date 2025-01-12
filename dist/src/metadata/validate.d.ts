import { DefinedError, ErrorObject } from 'ajv'
import { MetaplexMetadata } from './schema.js'
/**
 * Validator function for Metaplex NFT metadata objects. Returns true if metadata is valid.
 *
 * Can be used as a TypeScript type guard - if `validateMetadata(someObject)` returns `true`,
 * `someObject` can safely be treated as an instance of {@link MetaplexMetadata}.
 *
 */
export declare const validateMetadata: import('ajv').ValidateFunction<MetaplexMetadata>
/**
 *
 * @param m a JS object that hopefully contains valid metaplex NFT metadata
 * @returns the input object as an instance of {@link MetaplexMetadata} if input
 * is valid.
 * @throws {@link ValidationError} if input is not valid metaplex metadata.
 */
export declare function ensureValidMetadata(
  m: Record<string, any>
): MetaplexMetadata
/**
 * Error thrown by {@link ensureValidMetadata} when validation fails.
 * The `message` will contain a description of all errors encountered.
 *
 * The original AJV `DefinedError` objects are exposed as the `errors`
 * property.
 */
export declare class ValidationError extends Error {
  errors: DefinedError[]
  constructor(errors: ErrorObject[])
}
//# sourceMappingURL=validate.d.ts.map
