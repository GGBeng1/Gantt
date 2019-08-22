<template>
  <div class="chart" ref="chart">
    <div class="left" :style="{ width: rightLineX + 'px' }">
      <leftMenu
        :list="list"
        @handlerRowClick="handlerRowClick"
        @milestone="handlerMilestone"
        @planProject="handlerPlanProject"
      ></leftMenu>
      <div class="rightLine" :style="{ left: rightLineX + 'px' }"></div>
      <div
        class="rightLine"
        :style="{ left: rightLineX + 'px' }"
        ref="rightLine"
        @mousedown="rightLineMousedown"
      ></div>
    </div>
    <div class="date" :style="{ left: rightLineX + 2 + 'px' }">
      <div class="years" v-for="item in allDays" :key="item.year">
        <div
          class="month"
          v-for="(value, key) in item.month[0]"
          :key="value + 'zz' + key"
          :style="{ width: value.length * currentDaySize.value + 'px' }"
        >
          <div class="month-top">{{ item.year }}年{{ key }}月</div>
        </div>
      </div>
      <div class="topMonth" v-if="showFixdTopMonth">{{ fixdTopMonth }}</div>
      <div class="allDaysArray">
        <div
          v-for="(j, index) in days"
          :key="index + 'cc'"
          class="day"
          :style="{ width: currentDaySize.value + 'px' }"
        >
          <template v-if="currentDaySize.value == 40">
            <span
              class="dateNum todayDateNum"
              v-if="j.today"
              style="border-left:1px solid #d7d7d7;"
            >
              今天
            </span>
            <!-- isHover:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end -->
            <span
              v-else
              class="dateNum"
              :style="{ borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7' }"
              :class="{
                weekday: j.weekday == 0 || j.weekday == 6,
                isHover:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end
              }"
              >{{ j.date }}</span
            >
            <span
              class="dateBG"
              :class="{
                weekday2: j.weekday == 0,
                weekday1: j.weekday == 6,
                today: j.today
              }"
            ></span>
          </template>
          <template v-if="currentDaySize.value == 24">
            <!-- <span class="dateNum todayDateNum" v-if="j.today">
              {{ j.date }}
            </span> -->
            <span
              class="dateNum"
              :class="{
                weekday: j.weekday == 0 || j.weekday == 6,
                isHover:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end,
                nodBorder:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end
              }"
            >
              <div
                style="width:100%21px;height:100%;"
                :style="{
                  borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7'
                }"
                v-show="
                  (j.width == currentLineDay.end &&
                    isHover &&
                    j.weekday != 1) ||
                    (j.width == currentLineDay.start &&
                      isHover &&
                      j.weekday != 1) ||
                    j.weekday == 1
                "
              >
                {{ j.date }}
              </div>
            </span>
            <span
              class="dateBG"
              :class="{
                weekday2: j.weekday == 0,
                weekday1: j.weekday == 6,
                today: j.today
              }"
            ></span>
          </template>
          <template v-if="currentDaySize.value == 12">
            <!-- <span class="dateNum todayDateNum" v-if="j.today">
              {{ j.date }}
            </span> -->
            <!-- isHover:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end -->
            <span
              class="dateNum"
              :class="{
                isHover:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end,
                nodBorder:
                  j.width >= currentLineDay.start &&
                  j.width <= currentLineDay.end
              }"
            >
              <div
                style="width:100%;height:100%;font-size:10px!important;"
                :style="{
                  borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7'
                }"
                v-show="
                  (j.width == currentLineDay.end && isHover && j.date != 1) ||
                    (j.width == currentLineDay.start &&
                      isHover &&
                      j.date != 1) ||
                    j.date == 1
                "
              >
                {{ j.date }}
              </div>
            </span>
            <span
              class="dateBG weekday2"
              :class="{
                today: j.today
              }"
              style="border-right:none;"
            ></span>
          </template>
        </div>
      </div>
      <div class="toolTip">
        <div class="today base" @click="handleGoToday">今天</div>
        <el-dropdown trigger="click">
          <span class="base">
            {{ this.currentDaySize.label
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            slot="dropdown"
            :style="{ left: this.left + 'px !important' }"
          >
            <el-dropdown-item
              v-for="item in currentDaySizeOptions"
              :key="item.value + 'ck'"
              @click.native="handleSetDaySize(item)"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div
        class="line"
        v-for="(item, index) in list"
        :style="{
          left: item.left + 'px',
          width: item.widthMe + 'px',
          top: index == 0 ? '52px' : index * 40 + 52 + 'px'
        }"
        :ref="'line' + index"
        :key="item.startTime + item.per + index"
        @mousedown="lineMousedown(`line${index}`, $event, index)"
        @mouseover="lineMouseover(`line${index}`, $event, index)"
        @mouseleave="lineMouseleave"
        @mouseenter="lineMouseenter(`line${index}`, $event, index)"
      >
        <slider
          :min="0"
          :max="100"
          v-model="item.per"
          :index="index"
          :widths="item.widthChild"
          @thunkMousedown="thunkMousedown"
          @thunkMouseup="thunkMouseup"
          @thunkMousemove="thunkMousemove"
          v-show="item.type == '1'"
        ></slider>
        <div
          class="leftCurDrag"
          v-if="item.type == '1'"
          @mousedown.stop="leftCurDragMounsedown(`line${index}`, index, $event)"
        ></div>
        <div
          class="rightCurDrag"
          v-show="item.type == '1'"
          @mousedown.stop="
            rightCurDragMounsedown(`line${index}`, index, $event)
          "
        ></div>
        <div
          class="stoneLine"
          :style="{ top: -12 - index * 40 + 'px' }"
          v-show="item.type == '2'"
          @mouseenter="stoneLineMouseenter"
        ></div>
        <div class="milestone" v-show="item.type == '2'">
          <i class="el-icon-check"></i>
        </div>
      </div>
      <transition name="el-zoom-in-center">
        <div
          class="projectMsg"
          v-if="isShowMsg"
          :style="{
            left: currentProjectMsg.left + 'px',
            top: currentProjectMsg.top + 'px'
          }"
        >
          <div class="lineMsg">
            <span class="projectName">{{ currentProjectMsg.name }}</span>
          </div>
          <div class="lineMsg">
            <span class="title">持续时间:</span
            ><span>{{ currentProjectMsg.allTime }}天</span>
          </div>
          <div class="lineMsg">
            <span class="title">当前进度:</span
            ><span>{{ currentProjectMsg.per }}%</span>
          </div>
          <div class="lineMsg">
            <span class="title">开始时间:</span
            ><span>{{ currentProjectMsg.startTime }}</span>
          </div>

          <div class="lineMsg">
            <span class="title">结束时间:</span
            ><span>{{ currentProjectMsg.endTime }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import slider from "./components/slider";
import leftMenu from "./components/leftMenu";
export default {
  components: {
    slider,
    leftMenu
  },
  data() {
    return {
      timer: null,
      //leftMenu的右侧伸缩线
      rightLineX: 600,
      fixdTopMonth: "",
      //近三年的所有年月日
      allDays: [],
      //所有的天数
      days: [],
      monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      list: [],
      //当前hover的项目起止时间
      currentLineDay: {
        start: 0,
        end: 0
      },
      //当前的时间大小
      currentDaySize: {
        label: "天",
        value: 40
      },
      currentDaySizeOptions: [
        {
          label: "天",
          value: 40
        },
        {
          label: "周",
          value: 24
        },
        {
          label: "月",
          value: 12
        }
      ],
      //是否显示信息
      isShowMsg: false,
      //当前hover的项目信息
      currentProjectMsg: {
        name: "",
        allTime: 0,
        per: 0,
        startTime: 0,
        endTime: 0,
        left: 0,
        top: 0
      },
      isHover: false,
      showFixdTopMonth: false
    };
  },
  computed: {
    left() {
      return window.innerWidth - 30;
    },
    //当前年份
    currentYear() {
      return new Date().getFullYear();
    },
    //当前月份
    currentMonth() {
      return new Date().getMonth() + 1;
    },
    //当前日
    currentDay() {
      return new Date().getDate();
    }
  },
  methods: {
    stoneLineMouseenter() {
      this.isShowMsg = false;
      this.currentLineDay = {
        start: 0,
        end: 0
      };
    },
    //转为计划任务
    handlerPlanProject(row) {
      let index = this.list.findIndex(item => {
        return item.name == row.name;
      });
      this.list[index].type = "1";
      this.list[index].per = 50;
      this.list[index].left =
        row.left + row.widthMe - this.currentDaySize.value;
      this.list[index].widthMe = this.currentDaySize.value;
      this.list[index].widthChild = this.currentDaySize.value;
    },
    //转化为里程碑
    handlerMilestone(row) {
      let index = this.list.findIndex(item => {
        return item.name == row.name;
      });
      this.list[index].per = 100;
      this.list[index].type = "2";
      // let endTimeWidth = row.left + row.widthMe;
      this.list[index].left =
        row.left + row.widthMe - this.currentDaySize.value;
      this.list[index].widthMe = this.currentDaySize.value;
      this.list[index].widthChild = this.currentDaySize.value;
      this.setStoneLine();
      // let endTime = this.computedWithTime(endTimeWidth);
      // console.log(endTime);
    },
    rightLineMousedown(e) {
      let cx = e.clientX;
      let result;
      document.onmousemove = event => {
        result = event.clientX - cx;
        if (cx + result <= 441) return;
        this.$refs.rightLine.style.left = cx + result + "px";
      };
      document.onmouseup = events => {
        document.onmousemove = document.onmouseup = null;
        if (cx + result <= 441) {
          this.rightLineX = 441;
          return;
        }
        this.rightLineX = cx + result;
      };
    },
    handlerRowClick(row) {
      console.log(row);
      window.scrollTo(row.left - 100, 0);
    },
    handleSetDaySize(item) {
      console.log(item);
      this.currentDaySize = item;
      // this.setList();
      // this.checkList();
      this.days.forEach((item, index) => {
        item.width = (index + 1) * this.currentDaySize.value;
      });
      // console.log(this.days);
    },
    thunkMousemove(e, index) {
      this.isShowMsg = false;
    },
    thunkMousedown() {
      this.isShowMsg = false;
    },
    thunkMouseup(per, e, index) {
      this.list[index].per = per;
      // console.log(per, e, index);
      this.checkIsin(e, index);
    },
    //根据index值和e判断是否在当前line的范围里，是否展示时间和msg框
    checkIsin(events, index) {
      let line = this.$refs[`line${index}`][0];
      // console.log(line);
      // console.log(events);
      let lineTop = parseInt(line.style.top);
      let lineDown = lineTop + 16;
      let lineLeft = parseInt(line.style.left);
      let lineRight = parseInt(this.list[index].widthMe) + lineLeft;
      if (
        events.pageX - this.rightLineX >= lineLeft &&
        events.pageX - this.rightLineX <= lineRight &&
        events.y >= lineTop &&
        events.y <= lineDown
      ) {
        this.lineMouseover(`line${index}`, events, index, true);
        this.lineMouseenter(`line${index}`, events, index, true);
      } else {
        this.isShowMsg = false;
        this.currentLineDay = {
          start: 0,
          end: 0
        };
      }
    },
    //回到今天
    handleGoToday() {
      let s =
        Math.round(window.innerWidth / this.currentDaySize.value / 2) *
          this.currentDaySize.value -
        this.rightLineX;
      let width =
        (Math.floor(
          new Date(
            `${this.currentYear}/${this.currentMonth}/${this.currentDay}`
          ).getTime() - new Date(`${this.currentYear - 1}/01/01`).getTime()
        ) /
          (1000 * 60 * 60 * 24)) *
          this.currentDaySize.value -
        s;
      window.scrollTo(width, 0);
    },
    //左侧拖拽增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} index index
     */
    leftCurDragMounsedown(dom, index, e) {
      let line = this.$refs[dom][0];
      let cx = e.clientX;
      let result;
      let result1;
      document.onmousemove = event => {
        let addwidth = -(event.clientX - cx);
        result = this.list[index].widthMe + addwidth;
        result1 = this.list[index].left - addwidth;
        if (result <= this.currentDaySize.value) {
          result = this.currentDaySize.value;
          result1 =
            this.list[index].left +
            this.list[index].widthMe -
            this.currentDaySize.value;
        }
        line.style.width = result + "px";
        line.style.left = result1 + "px";
        this.list[index].widthChild = result;
        this.lineMouseover(dom, e, index, true);
        this.lineMouseleave(e, true);
      };
      document.onmouseup = events => {
        if (!result) {
          document.onmousemove = document.onmouseup = null;
          return;
        }
        result =
          Math.round(result / this.currentDaySize.value) *
          this.currentDaySize.value;
        result1 =
          Math.round(parseInt(line.style.left) / this.currentDaySize.value) *
          this.currentDaySize.value;
        this.list[index].widthMe = result;
        this.list[index].widthChild = result;
        line.style.width = result + "px";
        this.list[index].left = result1;
        line.style.left = result1 + "px";
        this.checkIsin(events, index);
        document.onmousemove = document.onmouseup = null;
      };
    },
    //右侧边缘增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} index index
     */
    rightCurDragMounsedown(dom, index, e) {
      let line = this.$refs[dom][0];
      let cx = e.pageX;
      let result;
      let z = 0;
      let wx = window.scrollX;
      let addwidth;
      // let timer;
      document.onmousemove = event => {
        if (event.clientX >= window.innerWidth - 80) {
          if (!this.timer) {
            this.timer = window.setInterval(() => {
              z = z + this.currentDaySize.value;
              window.scrollTo(z + wx, 0);
              addwidth = event.pageX - cx + z;
            }, 50);
          }
        } else {
          // console.log(123123);
          window.clearInterval(this.timer);
          // timer = null;
          this.timer = null;
          // console.log(z);
          // z = 0;
          addwidth = event.pageX - cx;
          // console.log(event.pageX);
        }
        // window.clearInterval(timer);
        result = this.list[index].widthMe + addwidth;
        if (
          result + parseInt(line.style.left) >=
          this.days.length * this.currentDaySize.value
        ) {
          result =
            this.days.length * this.currentDaySize.value -
            parseInt(line.style.left);
        }
        line.style.width = result + "px";
        this.list[index].widthChild = result;
        // console.log(line.style.width);
        if (result <= this.currentDaySize.value) {
          result = this.currentDaySize.value;
          line.style.width = result + "px";
          this.list[index].widthMe = result;
          this.list[index].widthChild = result;
        }
        this.lineMouseover(dom, e, index, true);
        this.lineMouseleave(e, true);
      };
      document.onmouseup = events => {
        if (!result) {
          document.onmousemove = document.onmouseup = null;
          return;
        }
        result =
          Math.round(result / this.currentDaySize.value) *
          this.currentDaySize.value;
        this.list[index].widthMe = result;
        this.list[index].widthChild = result;
        line.style.width = result + "px";
        this.checkIsin(events, index);
        document.onmousemove = document.onmouseup = null;
      };
    },
    //根据距离计算时间
    /**
     * @param  {Number} width
     * @param  {Number} time
     */
    computedWithTime(width, time) {
      let startTime =
        (width / this.currentDaySize.value) * (1000 * 60 * 60 * 24) +
        new Date(`${this.currentYear - 1}/01/01`).getTime();
      let s = new Date(startTime);
      if (time && time == true) {
        return s.getTime();
      } else if (time && time == "YD") {
        return `${s.getFullYear()}年${s.getMonth() + 1}月`;
      } else {
        return `${s.getFullYear()}年${s.getMonth() + 1}月${s.getDate()}日`;
      }
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} index index
     */
    //鼠标悬停展示上部日期
    lineMouseover(dom, e, index, ismove) {
      // console.log(this.$refs[dom]);
      let start =
        Math.round(
          parseInt(this.$refs[dom][0].style.left) / this.currentDaySize.value
        ) *
          this.currentDaySize.value +
        this.currentDaySize.value;
      let end =
        parseInt(this.$refs[dom][0].style.left) +
        parseInt(this.$refs[dom][0].style.width);
      end =
        Math.round(end / this.currentDaySize.value) * this.currentDaySize.value;
      this.currentLineDay = {
        start,
        end
      };
      this.isHover = true;
      // console.log(start, end);
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} index index
     */
    //鼠标进入显示当前项目的基本信息框
    lineMouseenter(dom, e, index) {
      let start =
        Math.round(
          parseInt(this.$refs[dom][0].style.left) / this.currentDaySize.value
        ) * this.currentDaySize.value;
      let end =
        parseInt(this.$refs[dom][0].style.left) +
        parseInt(this.$refs[dom][0].style.width);
      end =
        Math.round(end / this.currentDaySize.value) *
          this.currentDaySize.value -
        this.currentDaySize.value;
      this.currentProjectMsg = {
        name: this.list[index].name,
        allTime: (end - start) / this.currentDaySize.value + 1,
        per: this.list[index].per,
        startTime: this.computedWithTime(start),
        endTime: this.computedWithTime(end),
        left:
          e.pageX + 220 - window.scrollX >= window.innerWidth
            ? e.pageX - 220 - 600
            : e.pageX + 50 - 600,
        top: e.y + 20
      };
      this.isShowMsg = true;
      // console.log(e.pageX + 220 - window.scrollX >= window.innerWidth, e.pageX);
    },
    //鼠标离开信息消失，时间显示消失
    /**
     * @param  {Object} e $event
     * @param  {Boolean} move 是否移动状态
     */
    lineMouseleave(e, move) {
      if (move) {
        this.isShowMsg = false;
        this.currentProjectMsg = {
          name: "",
          allTime: 0,
          per: 0,
          startTime: 0,
          endTime: 0,
          left: 0,
          top: 0
        };
        return;
      }
      this.currentLineDay = {
        start: 0,
        end: 0
      };
      this.isHover = false;
      this.isShowMsg = false;
      this.currentProjectMsg = {
        name: "",
        allTime: 0,
        per: 0,
        startTime: 0,
        endTime: 0,
        left: 0,
        top: 0
      };
    },
    //每一行拖拽
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} index index
     */
    lineMousedown(dom, e, index) {
      let line = this.$refs[dom][0];
      let cx = e.clientX;
      let cp = e.pageX;
      let result;
      let z = 0;
      let left;
      document.onmousemove = event => {
        if (event.clientX >= window.innerWidth - 40) {
          z = z + this.currentDaySize.value;
          window.scrollTo(z, 0);
          let newWith = event.pageX - cp;
          // console.log(event.pageX, cp, 1);
          result = this.list[index].left + newWith;
          line.style.left = result + "px";
          if (result <= 0) result = 0;
        } else if (event.clientX <= 40 + this.rightLineX) {
          z = window.scrollX - this.currentDaySize.value;
          window.scrollTo(z, 0);
          let newWith = event.pageX - cp;
          // console.log(event.pageX, cp, 2);
          result = this.list[index].left + newWith;
          if (result <= 0) result = 0;
          line.style.left = result + "px";
        } else {
          let newWith = event.pageX - cp;
          // console.log(event.pageX, cp, 3);
          result = this.list[index].left + newWith;
          if (result <= 0) result = 0;
          line.style.left = result + "px";
        }
        this.lineMouseover(dom, event, index, true);
        this.lineMouseleave(e, true);
      };
      document.onmouseup = events => {
        if (!result) {
          document.onmousemove = document.onmouseup = null;
          return;
        }
        left =
          Math.round(result / this.currentDaySize.value) *
          this.currentDaySize.value;
        this.list[index].left = left;
        line.style.left = left + "px";
        this.checkIsin(events, index);
        document.onmousemove = document.onmouseup = null;
      };
    },
    //获取近三年的所有天数
    getDay() {
      this.getAllDate();
      // console.log(this.allDays);
    },
    //判断是否为闰年
    /**
     * @param  {String} year 传入年份
     */
    isLeapYear(year) {
      if (year % 4 > 0) {
        return true;
      }
      return false;
    },
    getAllDate() {
      let obj = {};
      let arr = [this.currentYear - 1, this.currentYear, this.currentYear + 1];
      arr.forEach(item => {
        obj.year = item;
        obj.days = this.isLeapYear(item) ? 365 : 366;
        this.allDays.push(obj);
        obj = {};
      });
      this.checkDate();
    },
    //根据年份天数创建月份及月份天数数组
    checkDate() {
      this.allDays.forEach(item => {
        item.month = this.handleMonthDay(item.days, item.year);
      });
      // console.log(this.allDays);
      this.allDays.forEach(element => {
        if (element.year == this.currentYear) {
          element.month[0][this.currentMonth].forEach(k => {
            if (k.date == this.currentDay) {
              k.today = true;
            }
          });
        }
      });
      let arr = [];
      this.allDays.forEach(item => {
        arr = arr.concat(item.month);
        // console.log(item.month);
      });
      arr.forEach(item => {
        for (var j in item) {
          this.days = this.days.concat(item[j]);
        }
      });
      this.days.forEach((item, index) => {
        item.width = (index + 1) * this.currentDaySize.value;
      });
      // console.log(this.days);
    },
    /**
     * @param  {Number} days
     * @param  {Number} year
     */
    handleMonthDay(days, year) {
      let arr = [];
      let obj = {};
      this.monthArr.forEach(item => {
        obj[item] = this.checkMonthDays(item, days);
      });
      arr.push(obj);
      let s = arr[0];
      for (let item in s) {
        // console.log(item, s[item]);
        s[item] = this.addNum(s[item], item, year);
      }
      // console.log(arr);
      return arr;
    },
    /**
     * @param  {number} num 天数
     * @param  {number} month 月份
     * @param  {number} year 年份
     */
    addNum(num, month, year) {
      // console.log(num, month, year);
      let arr = [];
      let obj = {};
      for (let i = 1; i <= num; i++) {
        obj.date = i;
        obj.weekday = new Date(`${year}/ ${month} / ${i}`).getDay();
        arr.push(obj);
        obj = {};
      }
      return arr;
    },
    //根据月份返回天数
    /**
     * @param  {Number} month 月份
     * @param  {Number} days 天数
     */
    checkMonthDays(month, days) {
      let day;
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
          break;
        case 2:
          day = days == 365 ? 28 : 29;
          return day;
          break;
      }
    },
    getWeek() {},
    getMonth() {},
    getYear() {},
    //加入鼠标滚轮事件
    addMousewheel() {
      let z = 0;
      window.onmousewheel = e => {
        if (e.wheelDelta > 0) {
          z = window.scrollX;
          z = z - 40;
          window.scrollTo(z, 0);
        }
        if (e.wheelDelta < 0) {
          z = z + 40;
          window.scrollTo(z, 0);
        }
      };
    },
    setList() {
      this.list = [
        {
          per: 40,
          startTime: new Date("2018/01/15").getTime(),
          endTime: new Date("2018/01/25").getTime(),
          left:
            (Math.floor(
              new Date("2018/01/15").getTime() -
                new Date("2018/01/01").getTime()
            ) /
              (1000 * 60 * 60 * 24)) *
            this.currentDaySize.value,
          widthMe:
            (Math.floor(
              new Date("2018/01/25").getTime() -
                new Date("2018/01/15").getTime()
            ) /
              (1000 * 60 * 60 * 24)) *
              this.currentDaySize.value +
            this.currentDaySize.value,
          widthChild:
            (Math.floor(
              new Date("2018/01/25").getTime() -
                new Date("2018/01/15").getTime()
            ) /
              (1000 * 60 * 60 * 24)) *
              this.currentDaySize.value +
            this.currentDaySize.value,
          name: "测试1",
          ower: "曹梦哲",
          type: "1"
        },
        {
          name: "测试2",
          ower: "曹梦哲",
          type: "1",
          per: 55,
          startTime: new Date("2018/12/20").getTime(),
          endTime: new Date("2019/1/3").getTime(),
          left:
            (Math.floor(
              new Date("2018/12/20").getTime() -
                new Date("2018/01/01").getTime()
            ) /
              (1000 * 60 * 60 * 24)) *
            this.currentDaySize.value,
          widthMe:
            (Math.floor(
              new Date("2019/1/3").getTime() - new Date("2018/12/20").getTime()
            ) /
              (1000 * 60 * 60 * 24)) *
              this.currentDaySize.value +
            this.currentDaySize.value,
          widthChild:
            (Math.floor(
              new Date("2019/1/3").getTime() - new Date("2018/12/20").getTime()
            ) /
              (1000 * 60 * 60 * 24)) *
              this.currentDaySize.value +
            this.currentDaySize.value
        }
      ];
    },
    setStoneLine() {
      this.$nextTick(() => {
        let arr = Array.from(document.getElementsByClassName("stoneLine"));
        let height = window.getComputedStyle(
          document.getElementsByClassName("today")[0]
        ).height;
        height = parseFloat(height) - 16.8;
        arr.forEach(e => {
          e.style.height = height + "px";
        });
      });
    }
  },
  watch: {
    currentDaySize(newValue, oldValue) {
      this.list.forEach(item => {
        item.left = (item.left / oldValue.value) * newValue.value;
        item.widthMe = (item.widthMe / oldValue.value) * newValue.value;
        item.widthChild = (item.widthChild / oldValue.value) * newValue.value;
      });
    }
  },
  mounted() {
    document.addEventListener("scroll", () => {
      let w = window.scrollX;
      // console.log(w);
      if (w <= 62) {
        this.showFixdTopMonth = false;
      } else {
        this.showFixdTopMonth = true;
      }
      let time = this.computedWithTime(w, "YD");
      this.fixdTopMonth = time;
    });
    // this.setStoneLine();
    this.getDay();
    // this.addMousewheel();
    this.setList();
  }
};
</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
  user-select: none;
  .left {
    position: fixed;
    top: 0;
    left: 0px;
    height: 100%;
    background-color: #fff;
    z-index: 999;
    // border-right: 1px solid #d7d7d7;
    .rightLine {
      z-index: 999;
      position: absolute;
      top: 0px;
      height: 100%;
      width: 2px;
      background-color: #d7d7d7;
      box-shadow: 4px 2px 12px 0px rgba(0, 0, 0, 0.2);
      cursor: col-resize;
      &:hover {
        background-color: #409eff;
      }
    }
  }
  .showCurrentLineDate {
    position: fixed;
    top: 0px;
    background-color: #409eff;
    color: #fff;
    height: 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .projectMsg {
    box-sizing: border-box;
    padding: 20px;
    position: absolute;
    width: 220px;
    height: 200px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;

    .lineMsg {
      margin-bottom: 10px;
      .projectName {
        font-size: 22px;
      }
      span {
        font-size: 14px;
        color: #909090;
      }
      .title {
        margin-right: 10px;
      }
    }
  }
  .date {
    display: flex;
    height: 100%;
    position: relative;
    .topMonth {
      // width: 100px;
      background-color: #fff;
      position: fixed;
      top: 0px;
      height: 21px;
      line-height: 21px;
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #909090 !important;
    }
    .toolTip {
      position: fixed;
      right: 0px;
      top: 50px;
      z-index: 999;

      .base {
        display: inline-block;
        font-weight: 500;
        text-align: center;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        background-color: #fff;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        font-weight: 400;
        color: #303030;
        border-radius: 3px;
        box-shadow: 0 3px 12px 0 rgba(48, 48, 48, 0.05),
          0 3px 6px 0 rgba(48, 48, 48, 0.1);
        margin-right: 20px;
        &:hover {
          color: #409eff;
        }
      }
    }
    .line {
      position: absolute;
      .rightCurDrag {
        cursor: e-resize;
        width: 10px;
        background-color: #000;
        height: 16px;
        position: absolute;
        right: -15px;
        transform: translateY(-50%);
        top: 50%;
        border-radius: 3px;
        user-select: none;
      }
      .leftCurDrag {
        cursor: e-resize;
        width: 10px;
        background-color: #000;
        height: 16px !important;
        position: absolute;
        left: -15px;
        transform: translateY(-50%);
        top: 50%;
        border-radius: 3px;
        user-select: none;
      }
      .stoneLine {
        position: absolute;
        top: 0px;
        left: 50%;
        margin-left: -1px;
        width: 2px;
        background-color: #24b47e;
      }
      .milestone {
        position: absolute;
        left: 50%;
        // transform: translateX(-50%);
        cursor: move;
        margin-left: -10px;
        width: 20px;
        height: 20px;
        background-color: #24b47e;
        transform: rotate(-45deg);
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          transform: rotate(45deg);
          color: #fff;
          z-index: 1;
        }
      }
    }
  }
  .years {
    display: flex;
    height: 100%;
    .month {
      height: 100%;
      .month-top {
        height: 21px;
        line-height: 21px;
        font-size: 12px !important;
        font-weight: 600 !important;
        color: #909090 !important;
      }
    }
  }
  .allDaysArray {
    display: flex;
    position: absolute;
    left: 0px;
    top: 21px;
    height: calc(100% - 21px);
    .weekday {
      color: #c7c7c7;
    }
    .weekday1 {
      border-left: 1px solid #d7d7d7;
      background-image: linear-gradient(to bottom, #f8f8f8, #f8f8f8);
    }
    .weekday2 {
      border-right: 1px solid #d7d7d7;
      background-image: linear-gradient(to bottom, #f8f8f8, #f8f8f8);
      width: 100%;
    }
    .day {
      // width: 40px;
      display: inline-block;
      height: calc(100% - 21px);
      box-sizing: border-box;
      text-align: center;
      .isHover {
        background-color: #409eff;
        color: #fff;
      }
      .nodBorder {
        div {
          border-left: none !important;
        }
      }
      .dateNum {
        font-size: 12px;
        line-height: 20px;
        display: block;
        height: 20px;
        // border-left: 1px solid #d7d7d7;
        border-bottom: 1px solid #d7d7d7;
        box-sizing: border-box;
      }
      .todayDateNum {
        background-color: #f0a100;
        color: #fff;
      }
      .dateBG {
        display: block;
        height: 100%;
      }
      .today {
        position: relative;
      }
      .today::after {
        content: "";
        height: 100%;
        width: 2px;
        background-color: #f0a100;
        position: absolute;
        // left: 20px;
        top: 0px;
      }
    }
  }
}
</style>