import { Editor } from 'tinymce';
import { Traverse, SugarElement, PredicateFilter } from '@ephox/sugar';
import { Arr } from '@ephox/katamari';
type ApplyingOption  = 'listAndParents' | 'listAndDecendants' | 'wholetree' | 'list';

interface DialogData {
  readonly listStyle: string;
  readonly applyingOption: ApplyingOption;
  readonly paddingValue: string;
}


function isOLULNode(e: SugarElement<Element>) {
  return Arr.contains(['UL', 'OL'], e.dom.nodeName) === true;
}

function getListAndItemNodes(selectedEl: SugarElement<Element>, applyingOption: string): Node[] {
  // TODO: Maybe need to handle where parent of LI isn't an OL or UL node?
  const currenListNode = Traverse.parentNode(selectedEl).getOrDie('Can not find parent node');
  // apply to the selected list by default
  let listNodes: SugarElement<Node>[] = [currenListNode];
  // Add ancestor or decedant UL and OL nodes
  if (applyingOption === 'listAndParents') {
    const ancestorNodes = PredicateFilter.ancestors(currenListNode, isOLULNode);
    listNodes = listNodes.concat(ancestorNodes);
  } else if (applyingOption === 'listAndDecendants') {
    const descendantNodes = PredicateFilter.descendants(currenListNode, isOLULNode);
    listNodes = listNodes.concat(descendantNodes);
  } else if (applyingOption === 'wholetree') {
    const ancestorNodes = PredicateFilter.ancestors(currenListNode, isOLULNode);
    const descendantNodes = PredicateFilter.descendants(currenListNode, isOLULNode);
    listNodes = listNodes.concat(ancestorNodes).concat(descendantNodes);
  }

  // get LI of each OL and UL
  const liItems = Arr.flatten(Arr.map(listNodes, (e) => PredicateFilter.children(e, (i) => i.dom.nodeName === 'LI')));
  listNodes = listNodes.concat(liItems);
  return Arr.map(listNodes, (e) => e.dom);
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

  // dropdown for nested list
  if (PredicateFilter.ancestors(sugarEl, isOLULNode).length > 1) {
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
      const nodes = getListAndItemNodes(sugarEl, applyingOption);
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