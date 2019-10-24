<template>
  <div></div>
</template>

<script>
import mixin from '@/mixins'

export default {
  name: 'PayResult',
  mixins: [mixin],
  data() {
    return {}
  },
  created() {
    window.addEventListener('message', function (e) {
      if (typeof e.data === 'object') {
        if (e.data.storekey) {
          window.localStorage.setItem(e.data.storekey, JSON.stringify(e.data.res))
          window.history.back()
        }
      }
    }, false)
  }
}
</script>
