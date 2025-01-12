/**
 * Request tag indicating what blockchain will be used to mint. Currently, the value
 * will always be set to `"solana"` and cannot be overridden by the user.
 */
export declare const TagChain = 'chain'
/**
 * Request tag indicating which [Solana cluster](https://docs.solana.com/clusters) will be
 * used to mint.
 *
 * Currently this library will accept any string value, however it is strongly
 * recommended that you use one of these "canonical" values: `"devnet"`, `"mainnet-beta"`, `"testnet"`.
 * This may be enforced by the backend at a later date.
 */
export declare const TagSolanaCluster = 'solanaCluster'
/**
 * Request tag indicating which "user agent" or tool is being used to prepare the upload. This should be
 * set to a string that includes the name of the tool or platform.
 *
 * Projects using this library are free to choose their own value for this tag, however you should avoid
 * changing the name over time, unless the project itself changes names (for example, due to a community fork or re-branding).
 *
 * For personal projects or individuals creating tools that are not affiliated with a public platform, please set the
 * value to a URL for your code repository. If your code is not yet public, please create a repository containing a
 * description of the project and links to its public-facing interface.
 *
 * Examples of suitable values:
 *
 * - `"metaplex/candy-machine-cli"`
 * - `"metaplex/js-sdk"`
 * - `"magiceden/mint-authority"`
 * - `"https://github.com/samuelvanderwaal/metaboss"`
 *
 */
export declare const TagMintingAgent = 'mintingAgent'
/**
 * Optional request tag indicating which version of the "minting agent" was used to prepare the request.
 * This may contain arbitrary text, as each project may have their own versioning scheme.
 */
export declare const TagMintingAgentVersion = 'agentVersion'
export declare type SolanaCluster = string
export interface AuthContext {
  chain: 'solana'
  solanaCluster: SolanaCluster
  mintingAgent: string
  agentVersion?: string
  signMessage: Signer
  publicKey: Uint8Array
}
export declare type Signer = (message: Uint8Array) => Promise<Uint8Array>
export interface RequestContext {
  message: RequestMessage
  messageBytes: Uint8Array
  mintDID: string
  signature: Uint8Array
}
export declare function MetaplexAuthWithSigner(
  signMessage: Signer,
  publicKey: Uint8Array,
  opts: {
    mintingAgent: string
    agentVersion?: string
    solanaCluster?: SolanaCluster
  }
): AuthContext
export declare function MetaplexAuthWithSecretKey(
  privkey: Uint8Array,
  opts: {
    mintingAgent: string
    agentVersion?: string
    solanaCluster?: SolanaCluster
  }
): AuthContext
export declare function makeMetaplexUploadToken(
  auth: AuthContext,
  rootCID: string
): Promise<string>
export declare function keyDID(pubkey: Uint8Array): string
interface PutCarRequest {
  rootCID: string
  tags: Record<string, string>
}
interface RequestMessage {
  put?: PutCarRequest
}
export {}
//# sourceMappingURL=auth.d.ts.map
