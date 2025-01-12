declare const file: {
  new (
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag | undefined
  ): File
  prototype: File
}
declare const blob: {
  new (
    blobParts?: BlobPart[] | undefined,
    options?: BlobPropertyBag | undefined
  ): Blob
  prototype: Blob
}
declare const _fetch: typeof fetch
declare const textEncoder: {
  new (): TextEncoder
  prototype: TextEncoder
}
declare namespace dummyFS {
  namespace promises {
    function readFile(): never
    function readFile(): never
    function stat(): never
    function stat(): never
    function readdir(): never
    function readdir(): never
  }
}
import _path from 'path-browserify'
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory'
export {
  file as File,
  blob as Blob,
  _fetch as fetch,
  textEncoder as TextEncoder,
  dummyFS as fs,
  _path as path,
  MemoryBlockStore as Blockstore,
}
//# sourceMappingURL=platform.browser.d.ts.map
