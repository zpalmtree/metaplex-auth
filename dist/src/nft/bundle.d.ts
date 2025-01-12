import { BlockstoreI } from 'nft.storage'
import * as Block from 'multiformats/block'
import * as dagPb from '@ipld/dag-pb'
import { PackagedNFT } from './prepare.js'
import type { EncodedCar } from './prepare.js'
/**
 * An NFTBundle is a collection of Metaplex NFTs that can be packaged into a single CAR for uploading to NFT.Storage.
 *
 * All added NFTs require a unique ID string, which will be used to link from the root directory object to the
 * `assets` and `metadata` directories for that NFT.
 *
 * For example, if you add nfts with the ids `a`, `b`, and `c`, you'll end up with a root directory tree like this:
 *
 * ```
 * .
 * ├── a
 * │   ├── assets
 * │   │   └── image.png
 * │   └── metadata
 * │       └── metadata.json
 * ├── b
 * │   ├── assets
 * │   │   └── image.png
 * │   └── metadata
 * │       └── metadata.json
 * └── c
 *     ├── assets
 *     │   └── image.png
 *     └── metadata
 *         └── metadata.json
 * ```
 *
 * When using {@link addNFTFromFileSystem}, the id will be derived from the metadata json filename, unless an `id` option is provided.
 * This should play nice with the default candy-machine directory structure, where each json file has a unique name (e.g. 0.json, etc).
 * If you're using a different naming convention, you should pass in explicit ids to avoid duplicate entries, which will fail.
 *
 */
export declare class NFTBundle {
  /** Maximum NFTs a bundle can support.
   *
   * This is currently limited by the size of the root block, which must stay below 256 kib
   * to be a valid "simple" (non-sharded) UnixFS directory object. May be increased in the
   * future by switching to sharded directories for the root object.
   */
  static MAX_ENTRIES: number
  /**
   * Maximum byte length for each NFT id string (encoded as UTF-8).
   *
   * Maximum length is enforced to ensure we can fit MAX_ENTRIES in a single root block.
   * With 64 byte ids, each link in the root block takes a max of 114 bytes, which gives
   * us 2299 max entries to stay below 256 kib.
   *
   * If you change this value, make sure to recalculate and change MAX_ENTRIES to stay below the hard limit.
   */
  static MAX_ID_LEN: number
  private _blockstore
  private _nfts
  /**
   *
   * @param opts
   * @param opts.blockstore use the given Blockstore instance (useful for testing).
   */
  constructor(opts?: { blockstore?: BlockstoreI })
  /**
   * Adds a {@link PackagedNFT} to the bundle.
   *
   * @param id an identifier for the NFT that will be used to create links from the bundle root directory object to the NFT data. Must be unique within the bundle.
   * @param metadata a JS object containing Metaplex NFT metadata
   * @param imageFile a File object containing image data for the main NFT image
   * @param opts
   * @param opts.validateSchema if true, validate the metadata using a JSON schema before adding. off by default.
   * @param opts.gatewayHost override the default HTTP gateway to use in metadata links. Must include scheme, e.g. "https://dweb.link" instead of just "dweb.link". Default is "https://nftstorage.link".
   * @returns a Promise that resolves to the input `PackagedNFT` object on success.
   */
  addNFT(
    id: string,
    metadata: Record<string, any>,
    imageFile: File,
    opts?: {
      validateSchema?: boolean
      gatewayHost?: string
      additionalAssetFiles?: File[]
    }
  ): Promise<PackagedNFT>
  /**
   * Loads an NFT from the local filesystem (node.js only) using {@link loadNFTFromFilesystem}.
   *
   * Note: if opts.id is not set, the basename of the metadata json file will be used as the id,
   * which will only work if each NFT metadata file has a unique name.
   *
   * @param metadataFilePath path to metadata json file
   * @param imageFilePath optional path to image file. If not given, will be inferred using the logic in {@link loadNFTFromFilesystem}.
   * @param opts
   * @param opts.id an identifier for the NFT that will be used to create links from the bundle root directory object to the NFT data. Must be unique within the bundle. If not given, the name of the metadata json file (without '.json' extension) will be used.
   * @param opts.validateSchema if true, validate the metadata using a JSON schema before adding. off by default.
   * @param opts.gatewayHost override the default HTTP gateway to use in metadata links. Must include scheme, e.g. "https://dweb.link" instead of just "dweb.link". Default is "https://nftstorage.link".
   * @returns a Promise that resolves to a {@link PackagedNFT} containing the NFT data on success.
   */
  addNFTFromFileSystem(
    metadataFilePath: string,
    imageFilePath?: string,
    opts?: {
      id?: string
      validateSchema?: boolean
      gatewayHost?: string
    }
  ): Promise<PackagedNFT>
  private _enforceMaxEntries
  private _enforceMaxIdLength
  private _addManifestEntry
  /**
   * @returns an object that links to each added NFT. Object keys are the `id` given when the NFT was added. Values are {@link PackagedNFT} objects.
   */
  manifest(): Record<string, PackagedNFT>
  /**
   * Creates a root UnixFS directory object that links to each NFT and encodes it as an IPLD block.
   * @returns a Promise that resolves to an IPLD block of dab-pb / unixfs data.
   */
  makeRootBlock(): Promise<Block.Block<dagPb.PBNode>>
  /**
   * @returns the total size of all blocks in our blockstore. Will be slightly smaller than the size of the final CAR, due to the CAR header.
   */
  getRawSize(): Promise<number>
  /**
   * "Finalizes" the bundle by creating a root block linking to all the NFTs in the bundle and
   * generating a CAR containing all added NFT data.
   *
   * @returns a Promise that resolves to an {@link EncodedCar}, which contains a {@link CarReader} and the root object's CID.
   */
  asCAR(): Promise<EncodedCar>
}
//# sourceMappingURL=bundle.d.ts.map
