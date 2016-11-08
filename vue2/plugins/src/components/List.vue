<template>
  <div class="list">
    <h2>Plugins List Of Myselft Components</h2>
    <ul>
      <li><router-link to="datapicker">DataPicker</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
