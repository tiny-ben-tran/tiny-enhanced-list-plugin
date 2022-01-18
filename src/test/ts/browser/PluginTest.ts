import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/mcagar';

import Plugin from '../../../main/ts/Plugin';

// This an example of a browser test of the editor.
describe('browser.PluginTest', () => {
  const hook = TinyHooks.bddSetup({
    plugins: 'tiny-enhanced-list-plugin',
    toolbar: 'tiny-enhanced-list-plugin'
  }, [ Plugin ]);

  it('test click on button', () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button:contains("tiny-enhanced-list-plugin button")');
    TinyAssertions.assertContent(editor, '<p>content added from tiny-enhanced-list-plugin</p>');
  });
});
