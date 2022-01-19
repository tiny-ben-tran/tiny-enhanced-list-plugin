import { Editor } from 'tinymce';
import { Traverse, SugarElement, PredicateFilter } from '@ephox/sugar';
import { Arr } from '@ephox/katamari';


interface DialogData {
  readonly listStyle: string;
  readonly applyingOption: string;
  readonly paddingValue: string;
}

/**
 * Apply style to OL, UL and padding to LI nodes
 * @param node Start node
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
      const selectedEl = SugarElement.fromDom(editor.selection.getNode());
      const currenListNode = Traverse.parentNode(selectedEl).getOrNull();
      let listNodes: SugarElement<Node>[] = [currenListNode];
      // Get UL and OL list nodes
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
      // get all LI items
      // can defer this step later
      const liItems = Arr.flatten(Arr.map(listNodes, (e) => PredicateFilter.children(e, (i) => i.dom.nodeName === "LI")));
      const nodes = Arr.map(liItems.concat(listNodes), (e) => e.dom);
      editor.undoManager.transact(function() {
        applyStyleToNodes(editor, nodes , listStyle, paddingValue);
      });
      dialogApi.close();
    },
  });
}

export {
  register
}