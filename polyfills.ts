// Remove the explicit process import
import 'zone.js';
import 'reflect-metadata';

// Add these instead
import { Buffer } from 'buffer';
import * as os from 'os-browserify/browser';
import * as path from 'path-browserify';
import * as vm from 'vm-browserify';

// Add to window object
(window as any).Buffer = Buffer;
(window as any).os = os;
(window as any).path = path;
(window as any).vm = vm;