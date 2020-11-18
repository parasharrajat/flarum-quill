
import { extend, override } from 'flarum/extend';
import app from 'flarum/app';
import ComposerBody from 'flarum/components/ComposerBody';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import avatar from 'flarum/helpers/avatar';
import listItems from 'flarum/helpers/listItems';
import QuillEditor from './components/quillEditor.js';
import Composer from 'flarum/components/Composer';
import ConfirmDocumentUnload from './components/ConfirmDocumentUnload';
import { adjustQuill } from './adjustQuill.js';
import addComposerAutocomplete from './components/addComposerAutocomplete.js';


app.initializers.add('parasharrajat/flarum-quill', () => {

  // adjustQuill Picker for Dropdown
  // todo use Bootstrap for dropdown
  adjustQuill();

  // adjust the Mentions plugin for quill
  if (flarum['extensions']['flarum-mentions']) {
    addComposerAutocomplete();
  }


  override(ComposerBody.prototype, 'view', function () {
    return (
      <ConfirmDocumentUnload when={this.hasChanges.bind(this)}>
        <div className={'ComposerBody ' + (this.attrs.className || '')}>
          {avatar(this.attrs.user, { className: 'ComposerBody-avatar' })}
          <div className="ComposerBody-content">
            <ul className="ComposerBody-header">{listItems(this.headerItems().toArray())}</ul>
            <div className="ComposerBody-editor">
              {QuillEditor.component({
                submitLabel: this.attrs.submitLabel,
                placeholder: this.attrs.placeholder,
                disabled: this.loading || this.attrs.disabled,
                composer: this.composer,
                preview: this.jumpToPreview && this.jumpToPreview.bind(this),
                onchange: this.composer.fields.content,
                onsubmit: this.onsubmit.bind(this),
                value: this.composer.fields.content(),
              })}
            </div>
          </div>
          {LoadingIndicator.component({ className: 'ComposerBody-loading' + (this.loading ? ' active' : '') })}
        </div>
      </ConfirmDocumentUnload>
    );
  });
  extend(Composer.prototype, 'oncreate', function () {
    this.$().on('focus blur', '[contenteditable=true]', (e) => {
      this.active = e.type === 'focusin';
      m.redraw();
    });
    this.$().on('keydown', '[contenteditable=true]', 'esc', () => this.state.close());

  });
});
