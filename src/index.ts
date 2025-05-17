
// import { HelloWorld } from "./classes/hello-world.class";
import type { HelloWorld as IHelloWorld } from './classes/hello-world.class';

const isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
const isMJS = typeof require === 'undefined';
// @ts-ignore
const { HelloWorld: Hello } = isNode && (isMJS ? await import('./classes/hello-world.class.js') : eval(`require('./classes/hello-world.class.js')`));

const HelloWorld: typeof IHelloWorld = Hello;

export { HelloWorld }

