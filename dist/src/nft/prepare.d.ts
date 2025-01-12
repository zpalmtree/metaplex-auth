import { CarReader, BlockstoreI } from 'nft.storage'
import type { CID } from 'multiformats'
import { MetaplexMetadata } from '../metadata/index.js'
export declare type EncodedCar = {
  car: CarReader
  cid: CID
}
export interface PackagedNFT {
  metadata: MetaplexMetadata
  metadataGatewayURL: string
  metadataURI: string
  encodedMetadata: EncodedCar
  encodedAssets: EncodedCar
  blockstore: BlockstoreI
}
/**
 * Encodes the given NFT metadata and asset files into CARs that can be uploaded to
 * NFT.Storage.
 *
 * First, the `imageFile` and any `additionalAssetFiles` are packed into a CAR,
 * and the root CID of this "asset CAR" is used to create IPFS URIs and gateway
 * URLs for each file in the NFT bundle.
 *
 * The input metadata is then modified:
 *
 * - The `image` field is set to an HTTP gateway URL for the `imageFile`
 * - If `animation_url` contains a filename that matches the `name` of any
 *   of the `additionalAssetFiles`, its value will be set to an HTTP gateway URL
 *   for that file.
 * - If any entries in `properties.files` have a `uri` that matches the `name`
 *   of `imageFile` or any of the `additionalAssetFiles`, it will be replaced
 *   by _two_ entries in the output metadata. One will contain an `ipfs://` uri
 *   with `cdn == false`, and the other will have an HTTP gateway URL, with
 *   `cdn == true`.
 *
 * This updated metadata is then serialized and packed into a second car.
 * Both CARs are returned in a {@link PackagedNFT} object, which also contains
 * the updated metadata object and links to the metadata.
 *
 * Note that this function does NOT store anything with NFT.Storage. The links
 * in the returned {@link PackagedNFT} will not resolve until the CARs have been
 * uploaded. Use {@link NFTStorageMetaplexor.storePreparedNFT} to upload.
 *
 * @param metadata a JS object containing (hopefully) valid Metaplex NFT metadata
 * @param imageFile a File object containing image data.
 * @param [opts]
 * @param opts.additionalAssetFiles any additional asset files (animations, higher resolution variants, etc)
 * @param opts.blockstore blockstore to use when importing data. if not provided, a temporary blockstore will be created
 * @param opts.validateSchema if true, validate the metadata against a JSON schema before processing. off by default
 * @param opts.gatewayHost the hostname of an IPFS HTTP gateway to use in metadata links. Defaults to "nftstorage.link" if not set.
 * @returns
 */
export declare function prepareMetaplexNFT(
  metadata: Record<string, any>,
  imageFile: File,
  opts?: {
    additionalAssetFiles?: File[]
    blockstore?: BlockstoreI
    validateSchema?: boolean
    gatewayHost?: string
  }
): Promise<PackagedNFT>
//# sourceMappingURL=prepare.d.ts.map
