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
              value: 'selectedListAndParents', text: 'Selected list + all parent lists'
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
      const {listStyleType, paddingValue, applyingOption} = dialogApi.getData() as any;
      const currentEl = editor.selection.getStart(true);
      // TODO: Refactor when able to use the sweet ephox/sugar
      let parentEls = [];
      if (applyingOption === "" || applyingOption === "selectedList") {
        parentEls.push(parentEls);
      } else if (applyingOption === "selectedListAndParents") {
        parentEls = editor.dom.getParents(currentEl, "UL,OL", null);
      }
      editor.undoManager.transact(function() {
        parentEls.forEach((e) => {
          editor.dom.setStyle(e, 'list-style-type', listStyleType);
          if (/[0-9]+/.test(paddingValue) === true) {
              editor.dom.setStyle(e.children, 'padding-left', paddingValue + "px");
          }
        });
      });
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