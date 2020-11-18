
import { extend, override } from 'flarum/extend';
import app from 'flarum/app';
import ComposerBody from 'flarum/components/ComposerBody';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import avatar from 'flarum/helpers/avatar';
import listItems from 'flarum/helpers/listItems';
import QuillEditor from './components/quillEditor.js';
import * as Quill from 'quill';
import Composer from 'flarum/components/Composer';
import ConfirmDocumentUnload from './components/ConfirmDocumentUnload';

function adjustQuill() {
  const picker = Quill.import('ui/picker');
  const originalMethods = {
    togglePicker: picker.prototype.togglePicker,
    close: picker.prototype.close
  };
  let positionEl;
  function removeScroll(type, value) {
    if (type === "top") {
      return value - $(document).scrollTop();
    } else {
      return value - $(document).scrollLeft();
    }
  }
  picker.prototype.togglePicker = function () {
    originalMethods.togglePicker.call(this);
    positionEl = () => {
      const composerOffset = $('.Composer').offset();
      const containerOffset = $(this.container).offset();
      const optionsHeight = $(this.options).outerHeight();
      $(this.options).css({
        top: removeScroll('top', containerOffset.top) - removeScroll('top', composerOffset.top) - optionsHeight + 'px',
        left: removeScroll('left', containerOffset.left) - removeScroll('left', composerOffset.left) + 'px'
      });
    }
    positionEl();
    $(window).on('scroll', positionEl);
  }
  picker.prototype.close = function () {
    originalMethods.close.call(this);
    $(window).off('scroll', positionEl);
  }
}

app.initializers.add('parasharrajat/flarum-quill', () => {
  adjustQuill();
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
