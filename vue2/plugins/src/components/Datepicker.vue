<template>
  <div class="datepicker">
    <div class="datepicker--wrap">
      <!-- 输入框 -->
      <div class="input" type="text" @click="togglePanel">{{ value }}</div>
      <!-- 日期显示框 -->
      <transition name="fade">
        <div class="date-panel" v-show="panelState">
          <!-- 月和日的显示头 -->
          <div class="panel-header" v-show="panelType !== 'year'">
            <div class="arrow-left" @click="prevMonthPreview">&lt;</div>
            <div class="year-month-box">
                <div class="year-box" @click="changeToYearView">{{ tmpYear }}</div>
                <div class="month-box" @click="changeToMonthView">{{tmpMonth + 1 | month(language)}}</div>
            </div>
            <div class="arrow-right" @click="nextMonthPreview">&gt;</div>
          </div>

          <!-- 年份的显示头 -->
          <div class="panel-header" v-show="panelType === 'year'">
            <div class="arrow-left" @click="preYear">&lt;</div>
            <div class="year-range">
              <span>{{ yearList[0] }}</span> - <span>{{ yearList[yearList.length - 1] }}</span>
            </div>
            <div class="arrow-right" @click="nextYear">&gt;</div>
          </div>

          <!-- 显示年份 -->
          <div class="type-year" v-show="panelType === 'year'">
            <ul class="year-list">
              <li 
                :class="{selected: isSelected('year', item)}"
                v-for="item in yearList"
                @click="selectYear(item)">{{ item }}</li>
            </ul>
          </div>

          <!-- 显示月份 -->
          <div class="type-month" v-show="panelType === 'month'">
            <ul class="month-list">
              <li 
                :class="{selected: isSelected('month', index)}"
                @click="selectMonth(index)"
                v-for="(item, index) in monthList">
                {{ item |  month(language)}}
              </li>
            </ul>
          </div>

          <!-- 显示日期 -->
          <div class="type-date" v-show="panelType == 'date'">
            <ul class="weeks">
                <li v-for="item in weekList">{{ item | week(language) }}</li>
            </ul>
            <ul class="date-list">
              <li 
                :class="{
                  preMonth: item.previousMonth,
                  nextMonth: item.nextMonth,
                  firstItem: (index % 7) === 0}"
                @click="selectDate(item)"
                v-for="(item, index) in dateList">
                <div class="message" :class="{selected: isSelected('date', item)}">
                  <div class="bg"></div><span>{{ item.value }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>  
</template>

<script>
  /**
   * value '2013-12-04' 传入日期
   * language 选择的语言
   */
  export default {
    name: 'Datapicker',

    props: {
      value: {
        type: String,
        default: ''
      },
      language: {
        type: String,
        default: 'zh'
      }
    },

    data() {
      let now = this.value ? new Date(this.value) : new Date()

      return {
        panelState: false,
        panelType: 'date',
        year: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate(),
        tmpYear: now.getFullYear(),
        tmpMonth: now.getMonth(),
        weekList: [0, 1, 2, 3, 4, 5, 6],
        monthList: [1, 2, 3 ,4 ,5, 6, 7 ,8, 9, 10, 11, 12]
      }
    },

    mounted() {
      window.addEventListener('click', this.closeDatepicker)
    },

    methods: {
      closeDatepicker(e) {
        if( !this.$el.contains( e.target )) {
          this.panelState = false
        }
      },

      togglePanel() {
        this.panelState = !this.panelState
      },

      isSelected (type, item) {
        switch (type){
          case 'year':
            return item === this.tmpYear
            break;
          case 'month':
            return item === this.tmpMonth
            break;
          case 'date':
            return this.year == this.tmpYear && this.date === item.value && this.month === this.tmpMonth && item.currentMonth
            break;
          default: 
           return false
        }
      },

      changeToYearView() {
        this.panelType = 'year'
      },

      changeToMonthView() {
        this.panelType = 'month'
      },

      selectYear(year) {
        this.tmpYear = year
        this.panelType = 'month'
      },

      selectMonth(month) {
        this.tmpMonth = month
        this.panelType = 'date'
      },

      selectDate(data) {
        //选择的是上一个月
        if( data.previousMonth ){
          //如果月份1月上一个月就跨年了
          if( this.tmpMonth === 0 ) {
            this.tmpMonth = 11
            this.tmpYear -= 1
          }else{
            this.tmpMonth -= 1
          }
        }

        //选择的是下一个月
        if( data.nextMonth ) {
          if( this.tmpMonth === 11 ) {
            this.tmpYear += 1
            this.tmpMonth = 0
          }else{
            this.tmpMonth += 1
          }
        }

        this.year = this.tmpYear
        this.month = this.tmpMonth
        this.date = data.value

        let value = `${this.year}-${('0' + (this.month + 1)).slice(-2)}-${('0' + this.date).slice(-2)}`
        this.$emit('input',value)
        this.panelState = false
      },

      prevMonthPreview() {
        if( this.tmpMonth === 0 ){
          this.tmpYear -= 1
          this.tmpMonth = 11
        }else{
          this.tmpMonth -= 1
        }
      },

      nextMonthPreview() {
        if( this.tmpMonth  === 11 ){
          this.tmpYear += 1
          this.tmpMonth = 0
        }else{
          this.tmpMonth += 1
        }
      },

      nextYear() {
        let lastYear = this.yearList[this.yearList.length -1]
        this.tmpYear = lastYear
      },

      preYear() {
        let previousYear = this.yearList[0] - 11
        this.tmpYear = previousYear
      }
    },

    computed: {
      dateList() {
        // 获取本月共多少天
        let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate()
        let dateList = Array.from({length: currentMonthLength},(val,index) => {
          return {
            currentMonth: true,
            value: index + 1
          }
        })

        //确定本月的1号是星期几
        let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay()
        let previousMongthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate()

        //拼接上个月
        for( let i = 0; i < startDay; i++ ){
          dateList = [{previousMonth: true, value: previousMongthLength - i}].concat(dateList)
        }

        //拼下一个月
        let len = dateList.length
        for(let i = dateList.length, item = 1; i < 42; i++, item++){
          dateList[dateList.length] = {nextMonth: true, value: item}
        }

        return dateList
      },

      yearList() {
        let yearList = Array.from({length: 12}, (value, index) => {
          return (this.tmpYear + index)
        })
        return yearList
      }
    },

    beforeDestroy() {
      window.removeEventListener('click')
    },

    filters: {
      week(item, language) {
        switch( language ){
          case 'zh':
            return {0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六'}[item]
            break;
          case 'en':
            return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
            break;
          default:
            return item;
        }
      },

      month(item, language){
        switch (language) {
          case 'en':
            return {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
             7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}[item]
          case 'zh':
            return {1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月',
             7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月'}[item]
          default:
            return item
        }
      }
    }
  }
</script>

<style scoped lang='less'>
.datepicker {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.datepicker--wrap {
  width: 240px;
  margin: 0 auto;
}

ul{
   padding: 0;
   margin: 0;
   list-style: none;
}
.input{
   width: 100%;
   height: 100%;
   font-size: inherit;
   line-height: 2;
   padding-left: 12px;
   box-sizing: border-box;
   outline: none;
   border: 1px solid #ccc;
   border-radius: 2px;
   text-align: left;

}
.date-panel{
   position: absolute;
   z-index: 5000;
   border: 1px solid #eee;
   box-sizing: border-box;
   width: 320px;
   padding: 5px 10px 10px;
   box-sizing: border-box;
   background-color: #fff;
}
.panel-header{
   display: flex;
   flex-flow: row nowrap;
   width: 100%;
}
.arrow-left, .arrow-right{
   flex: 1;
   font-size: 20px;
   line-height: 2;
   background-color: #fff;
   text-align: center;
   cursor: pointer;
}


.weeks{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    li{
        font-weight: 600;
    }
}

.year-range{
    font-size: 20px;
    line-height: 2;
    flex: 3;
    display: flex;
    justify-content: center;
}

.year-list, .month-list{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    li{
        font-family: Roboto, sans-serif;
        transition: all .45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        cursor: pointer;
        text-align: center;
        font-size: 20px;
        width: 33%;
        padding: 10px 0;
        border-radius: 5px;
        &:hover{
            background-color: #6ac1c9;
            color: #fff;
        }
        &.selected{
            background-color: #0097a7;
            color: #fff;
        }
        &.invalid{
            cursor: not-allowed;
            color: #ccc;
        }
    }
}

.date-list{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    .valid:hover{
        background-color: #eee;
    }
    li{
        transition: all ease .1s;
        cursor: pointer;
        box-sizing: border-box;
        border-bottom: 1px solid #fff;
        position: relative;
        margin: 2px;
        &:not(.firstItem){
            margin-left: 10px;
        }
        .message{
            font-family: Roboto, sans-serif;
            font-weight: 300;
            font-size: 14px;
            position: relative;
            height: 30px;
            &.selected{
                .bg{
                    background-color: rgb(0, 151, 167);
                }
                span{
                    color: #fff;
                }
            }
            &:not(.selected){
                .bg{
                    transform: scale(0);
                    opacity: 0;
                }
                &:hover{
                    .bg{
                        background-color: rgb(0, 151, 167);
                        transform: scale(1);
                        opacity: .6;
                    }
                    span{
                        color: #fff;
                    }
                }
            }
            .bg{
                height: 30px;
                width: 100%;
                transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                border-radius: 50%;
                position: absolute;
                z-index: 10;
                top: 0;
                left: 0;
            }
            span{
                position: absolute;
                z-index: 20;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);
            }
        }
        &.invalid{
            cursor: not-allowed;
            color: #ccc;
        }
    }
    
}
.weeks, .date-list{
    width: 100%;
    text-align: center;
    .preMonth, .nextMonth{
        color: #ccc;
    }
    li{
      font-family: Roboto;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
    }
}

</style>