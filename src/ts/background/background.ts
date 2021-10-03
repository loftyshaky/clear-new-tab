import 'background/listen';
import '@loftyshaky/shared/ext';
import { init_shared } from '@loftyshaky/shared';
import 'shared/internal';
import { init } from 'background/internal';

importScripts('/env.js');

init_shared();
init();
