import { Arr } from '@ephox/katamari';
import { SuccessCallback } from '@ephox/mcagar/lib/main/ts/ephox/mcagar/loader/Loader';
import { SugarElement, Traverse } from '@ephox/sugar';
import { Editor, TinyMCE } from 'tinymce';
import * as Dialogs from '../ts/ui/Dialog';
import * as Utils from "../ts/core/Utils"

const unorderedListTypes = [
  {
    value: 'disc',
    icon: 'list-bull-default'
  },
  {
    value: 'circle',
    icon: 'list-bull-circle'
  },
  {
    value: 'square',
    icon: 'list-bull-square'
  }
];

const orderedListTypes = [
  {
    value: 'armenian',
    icon: 'bomb',
  },
  {
    value: 'cjk-ideographic',
    icon: 'bomb',
  },
  {
    value: 'decimal',
    icon: 'list-num-default'
  },
  {
    value: 'decimal-leading-zero',
    icon: 'bomb'
  },
  {
    value: 'georgian',
    icon: 'bomb'
  },
  {
    value: 'hebrew',
    icon: 'bomb'
  },
  {
    value: 'hiragana',
    icon: 'bomb'
  },
  {
    value: 'hiragana-iroha',
    icon: 'bomb'
  },
  {
    value: 'katakana',
    icon: 'bomb'
  },
  {
    value: 'katakana-iroha',
    icon: 'bomb'
  },
  {
    value: 'lower-alpha',
    icon: 'bomb'
  },
  {
    value: 'lower-greek',
    icon: 'bomb'
  },
  {
    value: 'lower-latin',
    icon: 'bomb'
  },
  {
    value: 'lower-roman',
    icon: 'bomb'
  },
  {
    value: 'upper-alpha',
    icon: 'bomb'
  },
  {
    value: 'upper-greek',
    icon: 'bomb'
  },
  {
    value: 'upper-latin',
    icon: 'bomb'
  },
  {
    value: 'upper-roman',
    icon: 'bomb'
  }
];

declare const tinymce: TinyMCE;

const setup = (editor: Editor): void => {
  if (!editor.hasPlugin('lists') || !editor.hasPlugin('advlist')) {
    console.error('List and Advanced List plugins are required');
  }

  // Register toolbar button
  // editor.ui.registry.addButton('tiny-enhanced-list-plugin', {
  //   icon: 'list-bull-default',
  //   onAction: () => {
  //     const selectedElement = editor.selection.getNode();
  //     if (/OL|UL|LI/.test(selectedElement.nodeName) === false) {
  //       editor.execCommand('InsertUnOrderedList', false, {});
  //     } else {
  //       Dialogs.register(editor, selectedElement);
  //     }
  //   }
  // });
  
  // unorderlist
  editor.ui.registry.addSplitButton('tiny-enhanced-list-plugin-unorderedlist', {
    icon: 'list-bull-circle',
    onAction: (api) => {
      const selectedEl = SugarElement.fromDom(editor.selection.getNode());
      if (/UL|OL|LI/.test(selectedEl.dom.nodeName) === false) {
        editor.execCommand('InsertUnOrderedList', false, {});
      } else {
        const listNode = Traverse.parentNode(selectedEl).getOrNull();
        if (listNode !== null && Utils.isOLULNode(listNode) === true) {
          editor.dom.setStyle(listNode.dom, 'list-style-type', unorderedListTypes[0].value);
        }
      }
    },
    columns: 3,
    fetch: (callback) => {
      const items: unknown[] = Arr.map(unorderedListTypes, (t) => ({
        type: 'choiceitem',
        icon: t.icon,
        text: t.value,
        value: t.value
      }));
      callback(items);
    },
    onItemAction: (api, value) => {
      const selectedEl = SugarElement.fromDom(editor.selection.getNode());
      if (/UL|OL|LI/.test(selectedEl.dom.nodeName) === false) {
        editor.execCommand('InsertUnorderedList', false, {
          'list-style-type': value
        });
      } else {
        const listNode = Traverse.parentNode(selectedEl).getOrNull();
        if (listNode !== null && Utils.isOLULNode(listNode) === true) {
          editor.dom.setStyle(listNode.dom, 'list-style-type', value);
        }
      }
    }
  });

  // ordered list
  editor.ui.registry.addSplitButton('tiny-enhanced-list-plugin-orderedlist', {
    icon: 'list-num-default',
    // invoked when the toolbar is clicked
    onAction: (api) => {
      console.log("wowow", api);
    },
    columns: 3,
    fetch: (callback) => {
      const items: unknown[] = Arr.map(orderedListTypes, (t) => ({
        type: 'choiceitem',
        icon: t.icon,
        text: t.value,
        value: t.value
      }));
      callback(items);
    },
    // invoked when a dropdown list option is clicked
    onItemAction: (api, value) => {
      console.log("api ==>", api);
      console.log('value ===>', value);
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tiny-enhanced-list-plugin', setup);
};
