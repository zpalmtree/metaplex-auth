import { BlockstoreI } from 'nft.storage'
import type { PackagedNFT } from './prepare.js'
/**
 * Loads a Metaplex NFT from the filesystem, including metadata json, main image, and any
 * additional files referenced in the metadata.
 *
 * Loads [Metaplex NFT metadata JSON](https://docs.metaplex.com/nft-standard) from `metadataFilePath`,
 * using the image located at `imageFilePath`. If `imageFilePath` is not provided, attempts to find the image
 * in the following way:
 *
 * - If the metadata JSON object's `image` field contains the path to a file
 *   and the file exists, use it
 * - Otherwise, take the filename of the metadata file (e.g. `1.json`)
 *   and look for a file with the same basename and a `.png` extension (e.g. `1.png`).
 *
 * If no image file can be found, the returned promise will reject with an Error.
 *
 * In addition to the `image` field, if the `animation_url` contains a valid file path,
 * the file will be uploaded to NFT.Storage, and `animation_url` will be set to an
 * IPFS HTTP gateway link to the content.
 *
 * Entries in `properties.files` that contain valid file paths as their `uri` value will also be uploaded to
 * NFT.Storage, and each file will have two entries in the final metadata's `properties.files`
 * array. One entry contains an HTTP gateway URL as the `uri`, with the `cdn` field set to `true`, while the
 * other contains an `ipfs://` URI, with `cdn` set to `false`. This preserves the location-independent
 * "canonical" IPFS URI in the blockchain-linked record, while signalling to HTTP-only clients that they
 * can use the `cdn` variant.
 *
 * All file paths contained in the metadata should be relative to the directory containing the metadata file.
 *
 * Note that this function does NOT store anything with NFT.Storage. To store the returned `PackagedNFT` object,
 * see {@link NFTStorageMetaplexor.storePreparedNFT}, or use {@link NFTStorageMetaplexor.storeNFTFromFilesystem},
 * which calls this function and stores the result.
 *
 * This function is only available on node.js and will throw if invoked from a browser runtime.
 *
 * @param metadataFilePath path to a JSON file containing Metaplex NFT metadata
 * @param imageFilePath path to an image to be used as the primary `image` content for the NFT. If not provided,
 * the image will be located as described above.
 * @param opts
 * @param opts.blockstore a Blockstore instance to use when packing objects into CARs. If not provided, a new temporary Blockstore will be created.
 * @param opts.validateSchema if true, validate the metadata against a JSON schema before processing. off by default
 * @param opts.gatewayHost the hostname of an IPFS HTTP gateway to use in metadata links. Defaults to "nftstorage.link" if not set.
 *
 * @returns on success, a {@link PackagedNFT} object containing the parsed metadata and the CAR data to upload
 * to NFT.Storage.
 */
export declare function loadNFTFromFilesystem(
  metadataFilePath: string,
  imageFilePath?: string,
  opts?: {
    blockstore?: BlockstoreI
    validateSchema?: boolean
    gatewayHost?: string
  }
): Promise<PackagedNFT>
export declare function loadAllNFTsFromDirectory(
  directoryPath: string,
  opts?: {
    blockstore?: BlockstoreI
    validateSchema?: boolean
    gatewayHost?: string
  }
): AsyncGenerator<PackagedNFT>
//# sourceMappingURL=load.d.ts.map
