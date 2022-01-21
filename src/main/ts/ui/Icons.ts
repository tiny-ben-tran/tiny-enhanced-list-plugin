import { Editor } from 'tinymce';


const register = (editor: Editor): void => {
  editor.ui.registry.addIcon('cjk', '<svg width="24" height="24"><path d="M11 4v2H4v4h2V8h12v2h2V6h-7V4m-5 6v2h5.6l-2 2H4v2h7v2h-1v2h3v-4h7v-2h-5.8l1.8-1.8V10z"/></svg>'),
  editor.ui.registry.addIcon('hebrew', '<svg width="24" height="24"><path d="M3.9 4L9 10a3.4 3.4 0 00-3 2.6L4 20h2l2-6.9c0-.6.7-1.1 1.4-1.1h1.3l6.8 8H20L15 14a3.4 3.4 0 003-2.6L20 4h-2l-2 6.9c0 .6-.7 1.1-1.4 1.1h-1.3L6.5 4z"/></svg>'),
  editor.ui.registry.addIcon('hiragana', '<svg width="24" height="24"><path d="M9 4v2H6v2h3v2a5 5 0 000 10 4 4 0 002.4-.7l.8.8 1.4-1.4-.7-.8 1-1c1-1 1.9-2.7 2.5-4.3 1 .5 1.6 1.3 1.6 2.4a5 5 0 01-1.5 3.5L18 20A7 7 0 0020 15a5 5 0 00-2.9-4.4l.4-1.3-2-.5-.3 1.3-.2-.1h-4V8h5V6h-5V4m0 8h3.5c-.6 1.4-1.3 2.7-2 3.5l-.7.6A9.9 9.9 0 0111 12m-2 0c0 2 .4 4 1.3 5.6A2 2 0 019 18a3 3 0 01-3-3A3 3 0 019 12z"/></svg>'),
  editor.ui.registry.addIcon('katakana', '<svg width="24" height="24"><path d="M4 4v2h14l-3.7 3.8 1.4 1.4L20 7V4m-9 5v4c0 2.8-.8 3.9-2.6 5.5L9.6 20a8.4 8.4 0 003.4-7V9z"/></svg>')
};

export {
  register
}