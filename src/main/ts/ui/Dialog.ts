import { Editor } from 'tinymce';


const register = (editor: Editor, nodeName: string) => {
  const panelItems = [
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
              value: 'square', text: 'square'
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
          label: 'Padding Value',
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
      console.log('Dialog api ', dialogApi.getData());
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