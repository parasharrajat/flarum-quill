import * as Quill from 'quill';

export function adjustQuill() {
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
