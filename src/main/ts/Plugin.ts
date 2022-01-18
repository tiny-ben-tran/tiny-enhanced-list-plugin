import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;


function getListElementInParent(editor: Editor) {
  const selectionStart = editor.selection.getStart(true);
  return editor.dom.getParent(selectionStart, 'OL,UL,DL');
}

const setup = (editor: Editor, url: string): void => {
  if (!editor.hasPlugin('lists') || !editor.hasPlugin('advlist')) {
    throw 'List and Advanced List plugins are required';
  }
  editor.ui.registry.addButton('tiny-enhanced-list-plugin', {
    icon: 'list-bull-square',
    onAction: () => {
      const listElement = getListElementInParent(editor);
      if (listElement === null) {
        editor.execCommand('InsertOrderedList', false, {});
      } else {
          tinymce.activeEditor.windowManager.open({
            title: 'Select a styling',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'listbox',
                  name: 'selectedStyle',
                  label: 'Select a style',
                  items: [
                    { text: 'Bold', value: 'bold' },
                    { text: 'Italic', value: 'italic' },
                    { text: 'Strike', value: 'strikethrough' },
                  ]
                }
              ]
            },
            buttons: [
              {
                type: 'submit',
                text: 'Submit'
              }
            ],
            onSubmit: function (dialogApi) {
              dialogApi.close();
            },
            onChange: function (dialogApi) {
              console.log(dialogApi.getData()["selectedStyle"]);
            }
          });
        }
      }
  });
};

export default (): void => {
  tinymce.PluginManager.add('tiny-enhanced-list-plugin', setup);
};
