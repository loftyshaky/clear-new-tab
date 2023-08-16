import 'background/listen';
import '@loftyshaky/shared/ext';
import { init_shared } from '@loftyshaky/shared';
import 'shared/internal';
import { init } from 'background/internal';

importScripts('/env.js');

ext.force_local_storage_f();
init_shared();
init();
