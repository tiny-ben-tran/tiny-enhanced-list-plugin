
import { Traverse, SugarElement, PredicateFilter } from '@ephox/sugar';
import { Arr } from '@ephox/katamari';

type ApplyingOption  = 'listAndParents' | 'listAndDecendants' | 'wholetree' | 'list';

function isOLULNode(e: SugarElement<Node>): boolean {
  return Arr.contains(['UL', 'OL'], e.dom.nodeName) === true;
}

function getListAndItemNodes(selectedEl: SugarElement<Element>, applyingOption: ApplyingOption): Node[] {
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

export {
  getListAndItemNodes,
  isOLULNode,
  ApplyingOption
}