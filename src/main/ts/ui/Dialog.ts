import { Editor } from 'tinymce';

const register = (editor: Editor, nodeName: string): void => {
  const panelItems: any[] = [
    {
      type: 'bar',
      items: [
        {
          type: 'selectbox',
          name: 'listStyleType',
          label: 'Select a style',
          items: [
            {
              value: 'disc', text: 'Disc'
            },
            {
              value: 'circle', text: 'Circle'
            },
            {
              value: 'square', text: 'Square'
            }
          ]
        },
      ]
    },
    {
      type: 'bar',
      items: [
        {
          type: 'input',
          label: 'Padding Value (px)',
          name: 'paddingValue',
          inputMode: 'text',
        },
      ]
    }
  ];

  // specific option to LI element
  if (nodeName === "LI") {
    panelItems.push({
      type: 'bar',
      items: [
        {
          type: 'selectbox',
          name: 'applyingOption',
          label: 'Apply to',
          items: [
            {
              value: 'selectedList', text: 'Selected list'
            },
            {
              value: 'selectedListAndParent', text: 'Selected list + all parent lists'
            },
            {
              value: 'selectedListAndAllChildren', text: 'Selected list + all children lists'
            },
            {
              value: 'wholetree', text: 'All lists in the current tree'
            }
          ]
        },
      ]
    })
  }
  editor.windowManager.open({
    title: 'List Styling',
    body: {
      type: 'panel',
      items: panelItems
    },
    buttons: [
      {
        type: 'submit',
        text: 'Apply'
      }
    ],
    onSubmit: function (dialogApi) {
      const {listStyleType, paddingValue} = dialogApi.getData() as any;
      // select parent ul,ol and apply new style
      editor.dom.setStyle(editor.dom.getParent(editor.selection.getStart(true), 'UL,OL', null), 'list-style-type', listStyleType);
      // apply padding-left to all siblings (LI)
      // TODO validate inputs first
      if (paddingValue !== "") {
        editor.dom.setStyle(editor.dom.select('li'), 'padding-left', paddingValue + "px");
      }
      dialogApi.close();
    },
    onChange: function (dialogApi) {
      console.log(dialogApi.getData());
    },
  });
}

export {
  register
}