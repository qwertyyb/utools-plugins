const EventEmitter = require('events');

const applescript = require('applescript')

const { clipboard } = require('electron');
const { ContentType } = require('../constant')

class CustomClipboard extends EventEmitter {
  constructor() {
    super();
    this.start()
  }

  start = () => {
    let lastText = null;
    const checkClipboard = () => {
      const text = clipboard.readText()
      if (lastText === text) return;
      lastText = text;
      this.emit('newData', {
        contentType: ContentType.text,
        contentValue: text,
        text: text
      })
    }
    setInterval(checkClipboard, 1000)
  }

  write = (data) => {
    clipboard.writeText(data.contentValue)
  }

  paste = () => {
    return applescript.execString(`
      tell application "System Events" to keystroke "v" using command down
    `)
  }
}

module.exports = new CustomClipboard();
