import { Editor } from 'tinymce';
import { Traverse, SugarElement, PredicateFilter } from '@ephox/sugar';
import { Arr } from '@ephox/katamari';

interface DialogData {
  readonly listStyle: string;
  readonly applyingOption: string;
  readonly paddingValue: string;
}

/**
 *
 * @param selectedEl
 * @returns True if selectedEl has more than 1 UL or OL ancestors
 */
function isNestedList(selectedEl: SugarElement<Element>) {
  const ancestors = PredicateFilter.ancestors(selectedEl, (e) => Arr.contains(["UL", "OL"], e.dom.nodeName) === true);
  return ancestors.length > 1;
}

function getListAndItemNodes(selectedEl: SugarElement<Element>, applyingOption: string): Node[] {
  const currenListNode = Traverse.parentNode(selectedEl).getOrDie();
  let listNodes: SugarElement<Node>[] = [currenListNode];
  // Add ancestor or decedant UL and OL
  if (applyingOption === "selectedListAndParents") {
    const ancestorNodes = PredicateFilter.ancestors(currenListNode, (e) => Arr.contains(["UL", "OL"], e.dom.nodeName) === true);
    listNodes = listNodes.concat(ancestorNodes);
  } else if (applyingOption === "selectedListAndDecendants") {
    const descendantNodes = PredicateFilter.descendants(currenListNode, (e) => Arr.contains(["UL", "OL"], e.dom.nodeName) === true);
    listNodes = listNodes.concat(descendantNodes);
  } else if (applyingOption === "wholetree") {
    const ancestorNodes = PredicateFilter.ancestors(currenListNode, (e) => Arr.contains(["UL", "OL"], e.dom.nodeName) === true);
    const descendantNodes = PredicateFilter.descendants(currenListNode, (e) => Arr.contains(["UL", "OL"], e.dom.nodeName) === true);
    listNodes = listNodes.concat(ancestorNodes).concat(descendantNodes);
  }
  // get LI of each OL and UL
  const liItems = Arr.flatten(Arr.map(listNodes, (e) => PredicateFilter.children(e, (i) => i.dom.nodeName === "LI")));
  listNodes = listNodes.concat(liItems);
  return Arr.map(listNodes, (e) => e.dom);
}

/**
 * Apply style to OL, UL and padding to LI nodes
 * @param nodes
 * @param listStyle Values of list-style-type
 * @param padding Apply to LI nodes
 */
function applyStyleToNodes(editor: Editor, nodes: Node[], listStyle: string, padding: string) {
  Arr.each(nodes, (n) => {
    if (/OL|UL/.test(n.nodeName) === true) {
      editor.dom.setStyle(n, 'list-style-type', listStyle);
    } else if (n.nodeName === "LI") {
      editor.dom.setStyle(n, 'padding-left', padding + "px");
    }
  });
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

  // specific option to LI element
  if (isNestedList(sugarEl) === true) {
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
              value: 'selectedListAndDecendants', text: 'Selected list + all children lists'
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
        applyStyleToNodes(editor, nodes, listStyle, paddingValue);
      });
      dialogApi.close();
    },
  });
}

export {
  register
}