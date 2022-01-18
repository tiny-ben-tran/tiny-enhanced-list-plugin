
import { Editor } from 'tinymce';

const applyUnorderList = function (editor: Editor): void {
  editor.execCommand('InsertUnOrderedList', false, {});
}

export {
  applyUnorderList
}