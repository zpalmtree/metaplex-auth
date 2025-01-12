import { JSONSchemaType } from 'ajv'
export interface Attribute {
  trait_type: string
  value: string | number
  display_type?: string
  max_value?: number
  trait_count?: number
}
export interface FileDescription {
  uri: string
  type: string
  cdn?: boolean
}
export interface CreatorInfo {
  address: string
  share: number
}
/**
 * See https://docs.metaplex.com/nft-standard#collections
 */
export interface CollectionInfo {
  name: string
  family: string
}
/**
 * Interface for valid Metaplex NFT metadata, as defined at https://docs.metaplex.com/nft-standard.
 */
export interface MetaplexMetadata {
  name: string
  symbol?: string
  description?: string
  seller_fee_basis_points?: number
  image: string
  animation_url?: string
  external_url?: string
  attributes?: Attribute[]
  collection?: CollectionInfo
  properties: {
    category?: string
    files: Array<FileDescription>
    creators?: CreatorInfo[]
  }
}
export declare const metadataSchema: JSONSchemaType<MetaplexMetadata>
//# sourceMappingURL=schema.d.ts.map
