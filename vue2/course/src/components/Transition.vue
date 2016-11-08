<template>
  <div class="transition">
    <h2>Transition</h2>
    <ul>
      <li>
        <router-link to='single'>单元素/组件过度</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import single from 'components/transition/single'
export default {
  name: 'transition',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    single
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .transition {

  }
</style>
