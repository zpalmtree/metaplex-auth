/// <reference types="node" />
export class Request extends fetch.Request {
    _rawStream(): NodeJS.ReadableStream | null;
    /**
     * @type {ReadableStream<Uint8Array>|null}
     */
    get body(): ReadableStream<Uint8Array> | null;
    json(): Promise<any>;
    formData(): Promise<FormData>;
}
export class Response extends fetch.Response {
    _rawStream(): NodeJS.ReadableStream | null;
    /**
     * @type {ReadableStream<Uint8Array>|null}
     */
    get body(): ReadableStream<Uint8Array> | null;
    json(): Promise<any>;
    formData(): Promise<FormData>;
}
/**
 * @template State
 */
export class Service<State> {
    /**
     * @param {http.Server} server
     * @param {State} state
     * @param {(request:Request, state:State) => Promise<Response>} handler
     */
    constructor(server: http.Server, state: State, handler: (request: Request, state: State) => Promise<Response>);
    server: http.Server;
    state: State;
    handler: (request: Request, state: State) => Promise<Response>;
    /**
     * @param {http.IncomingMessage} incoming
     * @param {http.ServerResponse} outgoing
     */
    onrequest(incoming: http.IncomingMessage, outgoing: http.ServerResponse): Promise<void>;
    get address(): {
        port: number;
        host: string;
    };
    get url(): URL;
}
export function listen(service: Service<any>, port?: number | undefined): Promise<any>;
export function activate<State>(state: State, handler: (request: Request, state: State) => Promise<Response>): Promise<Service<State>>;
export function deactivate(service: Service<any>): void;
export type Source = {
    body: ReadableStream<Uint8Array> | null;
};
import fetch from "@web-std/fetch";
import { Headers } from "@web-std/fetch";
import http from "http";
import { ReadableStream as ReadableStream_1 } from "@web-std/blob";
export { fetch, Headers };
//# sourceMappingURL=mock-server.d.mts.map