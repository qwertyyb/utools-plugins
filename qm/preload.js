const applescript = require('applescript');

// Very basic AppleScript command. Returns the song name of each
// currently selected track in iTunes as an 'Array' of 'String's.

const scripts = {
  next: `tell application "System Events"
  tell process "QQ音乐" 
      click menu item "下一首" of menu "播放控制" of menu bar item "播放控制" of menu bar 1 of application process "QQMusic" of application "System Events"
  end tell
  end tell`,

  prev: `tell application "System Events"
  tell process "QQ音乐" 
      click menu item "上一首" of menu "播放控制" of menu bar item "播放控制" of menu bar 1 of application process "QQMusic" of application "System Events"
  end tell
  end tell`,

  pause: `tell application "System Events"
  tell process "QQ音乐"
    if menu item "暂停" of menu "播放控制" of menu bar item "播放控制" of menu bar 1 of application process "QQMusic" of application "System Events" exists then
      click menu item "暂停" of menu "播放控制" of menu bar item "播放控制" of menu bar 1 of application process "QQMusic" of application "System Events"
    else
      click menu item "播放" of menu "播放控制" of menu bar item "播放控制" of menu bar 1 of application process "QQMusic" of application "System Events"
    end if
  end tell
  end tell`
}

const exec = (script) => applescript.execString(script, (err, rtn) => {
  if (err) {
    // Something went wrong!
  }
  if (Array.isArray(rtn)) {
    for (const songName of rtn) {
      console.log(songName);
    }
  }
});

window.exports = {
  qm: {
    mode: 'list',
    args: {
      // 进入插件时调用（可选）
      enter: (action, callbackSetList) => {
        // 如果进入插件就要显示列表数据
        callbackSetList([
          {
             title: '下一曲',
             description: '播放下一曲',
             command: 'next'
          },
          {
             title: '上一曲',
             description: '播放上一曲',
             command: 'prev'
          },
          {
             title: '播放/暂停',
             description: '切换暂停播放',
             command: 'pause'
          },
        ])
     },
     // 子输入框内容变化时被调用 可选 (未设置则无搜索)
    //  search: (action, searchWord, callbackSetList) => {
    //     // 获取一些数据
    //     // 执行 callbackSetList 显示出来
    //     callbackSetList([
    //        {
    //           title: '这是标题',
    //           description: '这是描述',
    //           icon:'', // 图标
    //           url: 'https://yuanliao.info',
    //           other: 'xxx'
    //        }
    //     ])
    //  },
     // 用户选择列表中某个条目时被调用
     select: (action, itemData, callbackSetList) => {
        window.utools.hideMainWindow()
        const command = itemData.command
        exec(scripts[command])
        window.utools.outPlugin()
     },
     // 子输入框为空时的占位符，默认为字符串"搜索"
     placeholder: "搜索"
    }
  }
}
