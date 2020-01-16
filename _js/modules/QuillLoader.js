/*jshint -W032 */ /* ignore unnecessary semicolon */
var Quill = require('./Quill');

class QuillLoader {
  constructor() {
    var richTextElems = document.querySelectorAll('.rich-text-element'), i, textDelta;

    this.formats = ['bold', 'italic', 'link', 'blockquote', 'header', 'indent', 'list', 'documentlink', 'image', 'video'];

    for (i = 0; i < richTextElems.length; i++) {
      if (textDelta = richTextElems[i].getAttribute('data-delta')) {
        this.setQuillElement(richTextElems[i], textDelta);
        richTextElems[i].removeAttribute('data-delta');
      }
    }
  }

  /**
    * Expects an element id, and delta string
    */
  setQuillElement(el, textDelta) {
    var delta = JSON.parse(textDelta),
      quillModel;
    
    quillModel = new Quill(el, {
      modules: {
        toolbar: null
      },
      readOnly: true,
      formats: this.formats
    });
    
    quillModel.setContents(delta.ops, 'silent');
  }

};

export default QuillLoader;