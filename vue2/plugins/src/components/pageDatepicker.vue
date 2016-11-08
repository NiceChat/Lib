<template>
  <div class="page page-datepicker">
    <h1>{{ msg }}</h1>
    <datePicker @input="chooseDate" :value="value"></datePicker>
  </div>
</template>

<script>
import datePicker from 'components/DatePicker'

export default {
  name: 'PageDatepicker',

  data () {
    return {
      msg: 'This is the Datapicker Components',
      value: '1990-11-20'
    }
  },

  methods: {
    chooseDate(value) {
      this.value = value
    }
  },

  components: {
    datePicker
  }
}
</script>
<style lang='less' scoped>
  .page-datepicker {
    
  }
</style>
