import { Editor, TinyMCE } from 'tinymce';
import * as Dialogs from '../ts/ui/Dialog';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  if (!editor.hasPlugin('lists') || !editor.hasPlugin('advlist')) {
    console.error('List and Advanced List plugins are required');
  }

  // Register toolbar button
  editor.ui.registry.addButton('tiny-enhanced-list-plugin', {
    icon: 'list-bull-square',
    onAction: () => {
      const selectedElement = editor.selection.getNode();
      if (/OL|UL|LI/.test(selectedElement.nodeName) === false) {
        editor.execCommand('InsertUnOrderedList', false, {});
      } else {
        Dialogs.register(editor, selectedElement);
      }
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tiny-enhanced-list-plugin', setup);
};
