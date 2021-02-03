
//
var db = new Dexie("clipboard");
db.version(1).stores({
  history: '++id, contentType, &text, &createdAt, &lastUsedAt, &updatedAt, usedTimes'
});

window.service.clipboard.on('newData', async (data) => {
  const { text } = data
  const existsItem = await db.history.get({ text: text })
  console.log('new Data existsItem', existsItem)
  if (!existsItem) {
    data.createdAt = new Date().toLocaleString('zh-TW', { hour12: false })
    data.updatedAt = new Date().toLocaleString('zh-TW', { hour12: false })
    data.usedTimes = 1
    await db.history.put(data)
  } else {
    existsItem.updatedAt = new Date().toLocaleString('zh-TW', { hour12: false })
    await db.history.update(existsItem.id, existsItem)
  }
  window.service.clipboard.emit('historyUpdated')
})

const app = new Vue({
  el: '#app',
  data: {
    keyword: '',
    list: [],
    selectedIndex: 0,
  },
  created () {
    this.getList()
    window.service.clipboard.on('historyUpdated', this.getList)
    window.utools.onPluginEnter(() => {
      window.utools.setSubInput(({ text }) => this.keyword = text, '输入关键词搜索', false)
    }) 
    window.utools.onPluginOut(() => {
      this.selectedIndex = 0
    })
  },
  mounted () { 
    this.$refs.ul.focus()
  },
  watch: {
    keyword (val) {
      this.getList({ keyword: val })
    },
    selectedIndex(val) {
      this.$nextTick(() => {
        console.log(document.querySelector('.list-item.selected'))
        document.querySelector('.list-item.selected')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
  },
  methods: {
    async getList({ keyword = '' } = {}) {
      if (keyword) {
        window.utools.findInPage(keyword)
      } else {
        window.utools.stopFindInPage()
      }
      const list = await db.history.orderBy('updatedAt').reverse().filter((data) => {
        console.log(data.text, data.text.includes(keyword), keyword)
        return data.text.includes(keyword)
      }).toArray()
      console.log(list)
      this.list = list
    },
    async onItemClick(item) {
      window.service.clipboard.write(item)
      window.utools.hideMainWindow()
      window.utools.simulateKeyboardTap('v', 'command')
    },
    onEnterKey () {
      this.onItemClick(this.list[this.selectedIndex])
    }
  }
})
