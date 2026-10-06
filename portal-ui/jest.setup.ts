import { TextDecoder, TextEncoder } from 'node:util';
import { MessageChannel } from 'node:worker_threads';

Object.assign(global, { TextDecoder, TextEncoder, MessageChannel });
