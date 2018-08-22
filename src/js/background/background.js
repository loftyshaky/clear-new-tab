//^

/* shortcuts: 
w = wrapper
svg = svg_wrapper
fd = folders_dialog
cm = context_menu
cmi = context_menu_item
fdfdcd = folders_dialog_folder_deletion_confirmation_dialog
bookmark_r = bookmark_record
bookmark_rs = bookmark_records
dnd = drag and drop 
ed = extension data
*/

'use strict';

import x from 'x';
import * as shared_b from 'background/shared_b';
import 'background/onmessage';
import 'background/onclicked';
import 'background/oninstalled';
import 'background/setting_defaults';
import 'background/open_theme_img';
import 'background/theme_img';

x.get_ed(shared_b.load_imgs);