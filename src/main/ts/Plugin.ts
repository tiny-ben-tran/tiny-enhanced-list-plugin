import { Editor, TinyMCE } from 'tinymce';
import * as Dialogs from '../ts/ui/Dialog';

declare const tinymce: TinyMCE;

function applyUnorderList(editor) {
  editor.execCommand('InsertUnOrderedList', false, {});
}

const setup = (editor: Editor, url: string): void => {
  if (!editor.hasPlugin('lists') || !editor.hasPlugin('advlist')) {
    console.error('List and Advanced List plugins are required');
  }
  // Register toolbar button
  editor.ui.registry.addButton('tiny-enhanced-list-plugin', {
    icon: 'list-bull-square',
    onAction: () => {
      const selectingElement = editor.selection.getStart(true);
      if (selectingElement.nodeName !== 'OL' && selectingElement.nodeName !== 'UL' && selectingElement.nodeName !== 'LI') {
        applyUnorderList(editor);
      } else {
        Dialogs.register(editor, selectingElement.nodeName);
      }
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tiny-enhanced-list-plugin', setup);
};
