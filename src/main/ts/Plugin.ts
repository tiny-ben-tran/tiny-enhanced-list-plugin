import { Arr } from '@ephox/katamari';
import { SugarElement, Traverse } from '@ephox/sugar';
import { Editor, TinyMCE } from 'tinymce';
import * as Dialogs from './ui/Dialog';
import * as Utils from "./core/Utils"
import * as Icons from './ui/Icons';

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
    icon: 'cjk',
  },
  {
    value: 'decimal',
    icon: 'list-num-default'
  },
  {
    value: 'georgian',
    icon: 'bomb'
  },
  {
    value: 'hebrew',
    icon: 'hebrew'
  },
  {
    value: 'hiragana',
    icon: 'hiragana'
  },
  {
    value: 'hiragana-iroha',
    icon: 'hiragana'
  },
  {
    value: 'katakana',
    icon: 'katakana'
  },
  {
    value: 'katakana-iroha',
    icon: 'katakana'
  },
  {
    value: 'decimal-leading-zero',
    icon: 'bomb'
  },
  {
    value: 'lower-alpha',
    icon: 'list-num-lower-alpha'
  },
  {
    value: 'lower-greek',
    icon: 'list-num-lower-greek'
  },
  {
    value: 'lower-latin',
    icon: 'list-num-lower-alpha'
  },
  {
    value: 'lower-roman',
    icon: 'list-num-lower-roman'
  },
  {
    value: 'upper-alpha',
    icon: 'list-num-upper-alpha'
  },
  {
    value: 'upper-greek',
    icon: 'list-num-upper-greek'
  },
  {
    value: 'upper-latin',
    icon: 'list-num-upper-alpha'
  },
  {
    value: 'upper-roman',
    icon: 'list-num-upper-roman'
  }
];

/**
 * Common logic for applying list style type
 * @param editor
 * @param element Targeted element
 * @param command A command of Advlist and list plugins
 * @param listStyleType A valid value for list-style-type
 * @param commandOptions Options for editor.activeEditor.execCommand
 */
function applyListStyleHelper(editor: Editor, element: SugarElement<Node>, command: string, listStyleType: string, commandOptions?: any) {
  if (/UL|OL|LI/.test(element.dom.nodeName) === false) {
    editor.execCommand(command, false, commandOptions || {});
  } else {
    const listNode = Traverse.parentNode(element).getOrNull();
    if (listNode !== null && Utils.isOLULNode(listNode) === true) {
      editor.dom.setStyle(listNode.dom, 'list-style-type', listStyleType);
    }
  }
}

declare const tinymce: TinyMCE;

const setup = (editor: Editor): void => {
  // register icons
  Icons.register(editor);

  if (!editor.hasPlugin('lists') || !editor.hasPlugin('advlist')) {
    console.error('List and Advanced List plugins are required');
  }

  // Part 1. Enhanced list
  editor.ui.registry.addButton('tiny-enhanced-list-plugin-enhanced', {
    icon: 'list-bull-default',
    onAction: () => {
      const selectedElement = editor.selection.getNode();
      if (/OL|UL|LI/.test(selectedElement.nodeName) === false) {
        editor.execCommand('InsertUnOrderedList', false, {});
      } else {
        Dialogs.register(editor, selectedElement);
      }
    }
  });
  
  // Part 2. unorderlist split button
  editor.ui.registry.addSplitButton('tiny-enhanced-list-plugin-unorderedlist', {
    icon: 'list-bull-circle',
    onAction: () => {
      applyListStyleHelper(editor, SugarElement.fromDom(editor.selection.getNode()), 'InsertUnOrderedList', unorderedListTypes[0].value);
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
      applyListStyleHelper(editor, SugarElement.fromDom(editor.selection.getNode()), 'InsertUnOrderedList', value, {
        'list-style-type': value
      });
    }
  });

  // Part 2. ordered list split button
  editor.ui.registry.addSplitButton('tiny-enhanced-list-plugin-orderedlist', {
    icon: 'list-num-default',
    // invoked when the toolbar is clicked
    onAction: () => {
      applyListStyleHelper(editor, SugarElement.fromDom(editor.selection.getNode()), 'InsertOrderedList', orderedListTypes[0].value);
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
      applyListStyleHelper(editor, SugarElement.fromDom(editor.selection.getNode()), 'InsertOrderedList', value, {
        'list-style-type': value
      });
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tiny-enhanced-list-plugin', setup);
};
