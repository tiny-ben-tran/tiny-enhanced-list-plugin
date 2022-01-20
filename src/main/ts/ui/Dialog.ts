import { Editor } from 'tinymce';
import { Arr } from '@ephox/katamari';
import * as Utils from '../core/Utils';
import { PredicateFilter, SugarElement } from '@ephox/sugar';

interface DialogData {
  readonly listStyle: string;
  readonly applyingOption: Utils.ApplyingOption;
  readonly paddingValue: string;
}

const register = (editor: Editor, selectedEl: Element): void => {
  const sugarEl = SugarElement.fromDom(selectedEl);
  const panelItems: any[] = [
    {
      type: 'bar',
      items: [
        {
          type: 'selectbox',
          name: 'listStyle',
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

  // applying option dropdown for nested list
  if (PredicateFilter.ancestors(sugarEl, Utils.isOLULNode).length > 1) {
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
              value: 'listAndParents', text: 'Selected list + all parent lists'
            },
            {
              value: 'listAndDecendants', text: 'Selected list + all children lists'
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
      const {listStyle, paddingValue, applyingOption} = dialogApi.getData() as DialogData;
      const nodes = Utils.getListAndItemNodes(sugarEl, applyingOption);
      editor.undoManager.transact(function() {
        Arr.each(nodes, (n) => {
          if (/OL|UL/.test(n.nodeName) === true) {
            editor.dom.setStyle(n, 'list-style-type', listStyle);
          } else if (n.nodeName === 'LI' && /[0-9]+/.test(paddingValue) === true) {
            editor.dom.setStyle(n, 'padding-left', paddingValue + 'px');
          }
        });
      });
      dialogApi.close();
    },
  });
}

export {
  register
}