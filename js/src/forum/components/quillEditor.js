import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import ItemList from 'flarum/utils/ItemList';
import listItems from 'flarum/helpers/listItems';
import * as Quill from 'quill';

/**
 * The `QuillEditor` component displays a WYSIWYG textarea
 *
 * ### Attrs
 *
 * - `composer`
 * - `submitLabel`
 * - `value`
 * - `onChange`
 * - `placeholder`
 * - `disabled`
 * - `preview`
 */
export default class QuillEditor extends Component {

  oninit(vnode) {
    super.oninit(vnode);
    this.value = this.attrs.value || '';

    // provide default class name
    this.className = this.attrs.className || "quill-editor";

    // editor instance to be initialized later
    this.quill = null;

  }

  view() {
    const classNames = 'Composer-flexible ql-snow ql-container ' + this.className;
    return (
      <div className="TextEditor">
        <div className={classNames}> </div>
        {/* <textarea
          className="FormControl Composer-flexible"
          oninput={(e) => {
            this.oninput(e.target.value, e);
          }}
          placeholder={this.attrs.placeholder || ''}
          disabled={!!this.attrs.disabled}
          value={this.value}
        /> */}

        <ul className="TextEditor-controls Composer-footer">
          {listItems(this.controlItems().toArray())}
          <li className="TextEditor-toolbar">{this.toolbarItems().toArray()}</li>
          <li className="quill-toolbar"></li>
        </ul>
      </div>
    );
  }

  oncreate(vnode) {
    super.oncreate(vnode);

    this.quill = new Quill('.' + this.className, {
      formats: ['bold', 'italic', 'underline', 'strike', 'link', 'list', 'indent', 'size', 'font', 'align', 'image'],
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
          [{ 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['image', 'video'],                                       // remove formatting button
          ['clean']                                         // remove formatting button
        ]
      },
      placeholder: this.attrs.placeholder || '',
      readOnly: !!this.attrs.disabled,
      theme: 'snow'
    });
    this.$('.quill-toolbar').append($('.ql-toolbar'));
    // this.quill.setContents(this.value, 'api');
    this.quill.clipboard.dangerouslyPasteHTML(0, this.value);
    this.quill.on('text-change', this.oninput.bind(this));

    const handler = () => {
      this.onsubmit();
      m.redraw();
    };
    this.quill.keyboard.addBinding({ key: 'Enter', shortKey: true }, handler);
    // this.$('textarea').bind('keydown', 'meta+return', handler);
    // this.$('textarea').bind('keydown', 'ctrl+return', handler);

    this.attrs.composer.editor = this.quill;
    // this.attrs.composer.editor = new SuperTextarea(this.$('textarea')[0]);
  }

  /**
   * Build an item list for the text editor controls.
   *
   * @return {ItemList}
   */
  controlItems() {
    const items = new ItemList();

    items.add('submit',
      Button.component(
        {
          icon: 'fas fa-paper-plane',
          className: 'Button Button--primary',
          itemClassName: 'App-primaryControl',
          onclick: this.onsubmit.bind(this),
        },
        this.attrs.submitLabel
      )
    );
    if (this.attrs.preview) {
      items.add(
        'preview',
        Button.component({
          icon: 'far fa-eye',
          className: 'Button Button--icon',
          onclick: this.attrs.preview,
          title: app.translator.trans('core.forum.composer.preview_tooltip'),
          oncreate: (vnode) => $(vnode.dom).tooltip(),
        })
      );
    }

    return items;
  }
  /**
  * Build an item list for the toolbar controls.
  *
  * @return {ItemList}
  */
  toolbarItems() {
    return new ItemList();
  }
  /**
   * Handle input into the editor.
   */
  oninput() {
    let html = this.quill.root.innerHTML;
    this.value = html;
    this.attrs.onchange(html);
  }

  /**
   * Handle the submit button being clicked.
   */
  onsubmit() {
    this.attrs.onsubmit(this.value);
  }

}
