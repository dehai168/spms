<template>
  <div style="margin:0 auto; background: black; width: 400px; height: 300px">
    <iframe id="targetFrame" width="0" height="0" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'livevideo',
  props: {
    isFull: {
      type: Boolean,
      default: false
    },
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    right: {
      type: Number,
      default: 200
    },
    bottom: {
      type: Number,
      default: 200
    },
    src: {
      type: String,
      default: ''
    }
  },
  created() {},
  mounted() {
    this.play()
  },
  methods: {
    full() {
      const url = 'VideoMap://fullscreen'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    hide() {
      const url = 'VideoMap://hide'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    exit() {
      const url = 'VideoMap://exit'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    play() {
      const url = 'VideoPlay://' + this.src + '&pos=' + this.left + '_' + this.top + '_' + this.right + '_' + this.bottom + '&fullscreen=' + this.isFull
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    stop() {
      const url = 'VideoPlay://exit'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    }
  }
}
</script>
<style scoped></style>
