<template>
  <div class="chart" ref="chart">
    <div class="header">
      <div class="header-left">
        <el-button type="primary" size="mini" @click="handlerAddGantt"
          >新建</el-button
        >
        <el-button type="primary" size="mini" @click="handlerSaveData"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="handlerCheckList"
          >批量添加数据</el-button
        >
      </div>
    </div>
    <div class="left" :style="{ width: rightLineX + 'px' }">
      <leftMenu
        :list="list"
        ref="leftMenu"
        :BGScrollTop.sync="BGScrollTop"
        @TableScrollTop="TableScrollTop"
        @handlerRowClick="handlerRowClick"
        @milestone="handlerMilestone"
        @planProject="handlerPlanProject"
        @handlerGroup="handlerGroup"
        @handlerEdit="handlerEdit"
        @handleGroupAdd="handleGroupAdd"
        @handlerExpand="handlerExpand"
        @handlerDel="handlerDel"
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
        <div class="alldays">
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
              <span
                v-else
                class="dateNum"
                :style="{
                  borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7'
                }"
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
                :style="{
                  width: currentDaySize.value + 'px',
                  height:
                    j.weekday == 0 || j.weekday == 6 ? lineBGHeight : '0px'
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
                :style="{
                  width: currentDaySize.value + 'px',
                  height:
                    j.weekday == 0 || j.weekday == 6 ? lineBGHeight : '0px'
                }"
              ></span>
            </template>
            <template v-if="currentDaySize.value == 12">
              <!-- <span class="dateNum todayDateNum" v-if="j.today">
              {{ j.date }}
            </span> -->
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
                :style="{
                  width: currentDaySize.value + 'px',
                  height:
                    j.weekday == 0 || j.weekday == 6 ? lineBGHeight : '0px'
                }"
              ></span>
            </template>
          </div>
        </div>
        <div class="lineBG" @scroll="handlerBGScroll" ref="lineBG">
          <template v-for="(item, index) in computedList">
            <div
              class="line"
              :style="{
                left: item.left + 'px',
                width: item.widthMe + 'px',
                top: item.top + 'px'
              }"
              v-show="(item.type == '1' || item.type == '2') && item.isShow"
              :ref="'line' + item.id"
              :key="item.id + index + 'ccc'"
              @mousedown="
                lineMousedown(
                  `line${item.id}`,
                  $event,
                  item.id,
                  item.parentId,
                  index
                )
              "
              @mouseover="
                lineMouseover(
                  `line${item.id}`,
                  $event,
                  item.id,
                  item.parentId,
                  index
                )
              "
              @mouseleave="lineMouseleave"
              @mouseenter="
                lineMouseenter(
                  `line${item.id}`,
                  $event,
                  item.id,
                  item.parentId,
                  index
                )
              "
            >
              <slider
                :min="0"
                :max="100"
                v-model="item.per"
                :id="item.id"
                :parentId="item.parentId"
                :widths="item.widthChild"
                @thunkMousedown="thunkMousedown"
                @thunkMouseup="thunkMouseup"
                @thunkMousemove="thunkMousemove"
                v-show="item.type == '1'"
              ></slider>
              <div
                class="leftCurDrag"
                v-show="item.type == '1'"
                @mousedown.stop="
                  leftCurDragMounsedown(
                    `line${item.id}`,
                    $event,
                    item.id,
                    item.parentId,
                    index
                  )
                "
              ></div>
              <div
                class="rightCurDrag"
                v-show="item.type == '1'"
                @mousedown.stop="
                  rightCurDragMounsedown(
                    `line${item.id}`,
                    $event,
                    item.id,
                    item.parentId,
                    index
                  )
                "
              ></div>
              <div
                class="stoneLine"
                :style="{ top: -item.top + 'px', height: item.top + 'px' }"
                v-if="item.type == '2'"
                @mouseenter="stoneLineMouseenter"
              ></div>
              <div class="milestone" v-if="item.type == '2'">
                <i class="el-icon-check"></i>
              </div>
            </div>
            <div
              class="group"
              :style="{
                top: item.top + 'px',
                left: item.left + 'px',
                width: item.widthMe + 'px'
              }"
              v-if="item.type == '3'"
              :key="item.id + 'zzzzz'"
            >
              <div class="progress" :style="{ width: item.per + '%' }"></div>
            </div>
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVal"
      width="500px"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <dialogAdd
        :title="title"
        :dialogVal.sync="dialogVal"
        :isChildren="isChildren"
        @submit="handleSave"
        @handleEditSave="handleEditSave"
        @onCancle="onCancle"
        ref="dialogAdd"
      ></dialogAdd>
    </el-dialog>
  </div>
</template>

<script>
import dialogAdd from "./components/dialogAdd";
import slider from "./components/slider";
import leftMenu from "./components/leftMenu";
export default {
  components: {
    slider,
    leftMenu,
    dialogAdd
  },
  data() {
    return {
      //当前项是否是子集
      isChildren: false,
      dialogVal: false,
      //title
      title: "新建",
      //定时器
      timer: null,
      //leftMenu的右侧伸缩线
      rightLineX: 600,
      fixdTopMonth: "",
      //近三年的所有年月日
      allDays: [],
      //所有的天数
      days: [],
      //月数
      monthArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      //项目数据
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
      showFixdTopMonth: false,
      currentListIndex: "",
      //正在编辑的row
      editRow: [],
      currentRow: null,
      // BG滚动高度
      BGScrollTop: 0,
      // 背景高度
      lineBGHeight: 0,
      expandArr: []
    };
  },
  computed: {
    computedList() {
      let arr = [];
      this.list.forEach(item => {
        if (!item.children || item.children.length < 1) {
          arr.push(item);
        } else if (item.children && item.children.length >= 1) {
          arr.push(item);
          arr = arr.concat(item.children);
        }
      });
      return arr;
    },
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
    TableScrollTop(val) {
      let lineBG = this.$refs.lineBG;
      lineBG.scrollTo(0, val);
      // lineBG.scrollTo({
      //   top: val,
      //   left: 0,
      //   behavior: "smooth"
      // });
    },
    handlerBGScroll(e) {
      this.BGScrollTop = e.srcElement.scrollTop;
    },
    //保存当前的所有数据
    handlerSaveData() {
      console.log(this.list);
      // this.handlerCheckList();
    },
    //过滤导入的数据
    handlerCheckList() {
      let l = [
        {
          name: "1",
          ower: "",
          per: 0,
          type: "3",
          planTime: [],
          stoneTime: "",
          startTime: "",
          endTime: "",
          id: 1589269666397,
          // expand: true,
          // top: 15,
          isShow: true,
          children: [
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 1,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 2,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 3,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 4,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 5,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 41,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 42,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 444,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 43,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 4441,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 4332,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 44411,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 43321,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 444112,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 433211,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 6,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 7,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 8,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 9,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 10,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 11,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 12,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 13,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 14,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 15,
              parentId: 1568028397666
            },
            {
              name: "1",
              ower: "",
              type: "1",
              stoneTime: "",
              per: 0,
              startTime: 1567958400000,
              endTime: 1568217600000,
              id: 16,
              parentId: 1568028397666
            }
          ]
          // widthChild: 120,
          // widthMe: 120,
          // left: 19880
        },
        {
          name: "3",
          ower: "",
          per: 100,
          type: "2",
          planTime: [],
          stoneTime: 1589472000000,
          startTime: 1589472000000,
          endTime: 1589472000000,
          // left: 20000,
          // widthChild: 40,
          // widthMe: 40,
          // top: 50,
          id: 1589269688345,
          isShow: true
        },
        {
          name: "4",
          ower: "",
          per: 100,
          type: "2",
          planTime: [],
          stoneTime: 1589558400000,
          startTime: 1589558400000,
          endTime: 1589558400000,
          // left: 20040,
          // widthChild: 40,
          // widthMe: 40,
          // top: 85,
          id: 1589269707819,
          isShow: true
        }
      ];
      l.forEach((item, index) => {
        item.planTime = [];
        item.left =
          item.type == 3 ? "" : this.computedTimeWidth(item.startTime);
        item.widthMe = item.widthChild =
          item.type == 3
            ? ""
            : this.computedTimeWidth(item.startTime, item.endTime);
        item.isShow = true;
        if (index - 1 < 0) {
          item.top = 15;
          if (item.type == 3) {
            item.isexpand = true;
            if (item.children.length > 0) {
              item.children.forEach((k, i) => {
                k.planTime = [];
                k.top = item.top + i * 40 + 35;
                k.isShow = true;
                k.left = this.computedTimeWidth(k.startTime);
                k.widthMe = k.widthChild = this.computedTimeWidth(
                  k.startTime,
                  k.endTime
                );
              });
            }
          }
        } else {
          if (l[index - 1].type == 3) {
            item.top =
              l[index - 1].top + l[index - 1].children.length * 40 + 40;
            if (item.type == 3) {
              item.isexpand = true;
              if (item.children.length > 0) {
                item.children.forEach((z, o) => {
                  z.planTime = [];
                  z.top = item.top + o * 40;
                  z.isShow = true;
                  z.left = this.computedTimeWidth(z.startTime);
                  z.widthMe = z.widthChild = this.computedTimeWidth(
                    z.startTime,
                    z.endTime
                  );
                });
              }
            }
          } else {
            item.top = l[index - 1].top + 40;
          }
        }
      });
      l.forEach(item => {
        if (item.type == 3) {
          this.setGroupWidth(item.id, l);
          this.setGroupPer(item.id, l);
        }
      });
      // console.log(l);
      this.list = l;
      this.setStoneLine(1);
      // window.scrollTo(this.list[0].left - 100, 0);
      window.scrollTo({
        top: 0,
        left: this.list[0].left - 100,
        behavior: "smooth"
      });
    },
    //设置左侧leftmenu高亮
    handlerSelect(row) {
      this.$refs.leftMenu.handlerSelect(row);
    },
    //分组是否展开
    handlerExpand(row, expand) {
      let rowIndex = this.list.findIndex(item => {
        return item.id == row.id;
      });
      this.list[rowIndex].expand = expand;
      if (
        this.list[rowIndex].children &&
        this.list[rowIndex].children.length > 0
      ) {
        this.list[rowIndex].children.forEach(k => {
          k.isShow = expand;
        });
      }
      this.resetTop(rowIndex, !expand, true);
    },
    //分组添加子集
    handleGroupAdd(row) {
      this.$nextTick(() => {
        this.$refs.dialogAdd.resetFields();
      });
      this.currentListIndex = this.list.findIndex(item => {
        return item.id == row.id;
      });
      this.dialogVal = true;
      this.isChildren = true;
    },
    //编辑
    handlerEdit(row) {
      this.title = "编辑";
      this.dialogVal = true;
      let obj = {};
      if (row.parentId) {
        this.editRow[0] = row.parentId;
        this.editRow[1] = row.id;
        let parent = this.list.find(item => {
          return item.id == row.parentId;
        });
        let cur = parent.children.find(item => {
          return item.id == row.id;
        });
        let { name, ower, type, planTime, stoneTime, per } = cur;
        obj = { name, ower, type, planTime, stoneTime, per };
        if (type == 2) {
          obj.stoneTime = this.computedWithTime(cur.left, true);
        }
        obj.planTime[0] = this.computedWithTime(cur.left, true);
        obj.planTime[1] = this.computedWithTime(
          cur.left + cur.widthMe - this.currentDaySize.value,
          true
        );
        // console.log(obj);
        this.$nextTick(() => {
          this.$refs.dialogAdd.form = obj;
        });
      } else {
        this.editRow[0] = row.id;
        let cur = this.list.find(item => {
          return item.id == row.id;
        });
        let { name, ower, type, planTime, stoneTime, per } = cur;
        obj = { name, ower, type, planTime, stoneTime, per };
        if (type == 2) {
          obj.stoneTime = this.computedWithTime(cur.left, true);
        }
        obj.planTime[0] = this.computedWithTime(cur.left, true);
        obj.planTime[1] = this.computedWithTime(
          cur.left + cur.widthMe - this.currentDaySize.value,
          true
        );
        this.$nextTick(() => {
          this.$refs.dialogAdd.form = obj;
        });
      }
    },
    //删除
    handlerDel(row) {
      if (!row.parentId) {
        let index = this.list.findIndex(item => {
          return item.id == row.id;
        });
        this.list.splice(index, 1);
        if (row.type == 3) {
          if (!row.expand) {
            this.retDelTop(index, 1);
          } else {
            this.retDelTop(index, row.children.length + 1);
          }
        } else {
          this.retDelTop(index, 1);
        }
      } else {
        let parent = this.list.find(item => {
          return item.id == row.parentId;
        });
        let parentIndex = this.list.findIndex(item => {
          return item.id == row.parentId;
        });
        let cindex = parent.children.findIndex(k => {
          return k.id == row.id;
        });
        parent.children.splice(cindex, 1);
        if (parent.children[cindex]) {
          parent.children.forEach((o, i) => {
            if (i >= cindex) {
              o.top = o.top - 40;
            }
          });
        }
        this.setGroupWidth(row.parentId);
        this.setGroupPer(row.parentId);
        this.resetTop(parentIndex, true);
        this.$set(this.list, parentIndex, parent);
      }
    },
    //dialog beforClose
    handleClose(done) {
      this.currentListIndex = "";
      this.isChildren = false;
      this.editRow = [];
      this.$refs.dialogAdd.resetFields();
      this.$refs.dialogAdd.form.per = 0;
      done();
    },
    //dialog 取消
    onCancle() {
      this.currentListIndex = "";
      this.isChildren = false;
      this.$refs.dialogAdd.form.per = 0;
      this.editRow = [];
    },
    //编辑保存
    handleEditSave(row) {
      // console.log(row);
      if (this.editRow.length == 1) {
        let cur = this.list.find(item => {
          return item.id == this.editRow[0];
        });
        cur = Object.assign(cur, row);
        cur.planTime = row.planTime;
        if (cur.type != 3) {
          cur.startTime = row.stoneTime ? row.stoneTime : row.planTime[0];
          cur.endTime = row.stoneTime ? row.stoneTime : row.planTime[1];
          cur.left = this.computedTimeWidth(cur.startTime);
          cur.widthChild = cur.widthMe = this.computedTimeWidth(
            cur.startTime,
            cur.endTime
          );
          cur.per = row.per;
        }
      } else if (this.editRow.length == 2) {
        let parent = this.list.find(item => {
          return item.id == this.editRow[0];
        });
        let cur = parent.children.find(item => {
          return item.id == this.editRow[1];
        });
        cur = Object.assign(cur, row);
        cur.planTime = row.planTime;
        cur.startTime = row.stoneTime ? row.stoneTime : row.planTime[0];
        cur.endTime = row.stoneTime ? row.stoneTime : row.planTime[1];
        cur.left = this.computedTimeWidth(cur.startTime);
        cur.widthChild = cur.widthMe = this.computedTimeWidth(
          cur.startTime,
          cur.endTime
        );
        this.setGroupWidth(this.editRow[0]);
      }
      this.editRow = [];
      this.$refs.dialogAdd.form.per = 0;
    },
    // 根据时间计算距离
    computedTimeWidth(startTime, endTime) {
      let left =
        (Math.floor(
          startTime - new Date(`${this.currentYear - 1}/01/01`).getTime()
        ) /
          (1000 * 60 * 60 * 24)) *
        this.currentDaySize.value;
      let width =
        (Math.floor(endTime - startTime) / (1000 * 60 * 60 * 24)) *
          this.currentDaySize.value +
        this.currentDaySize.value;
      if (!endTime) {
        return left;
      } else {
        return width;
      }
    },
    //新建保存
    async handleSave(val, isChildren) {
      let obj = Object.assign({}, val);
      // console.log(obj);
      let index = this.list.length;
      // obj.per = 0;
      obj.startTime = obj.planTime.length > 0 ? obj.planTime[0] : obj.stoneTime;
      obj.endTime = obj.planTime.length > 0 ? obj.planTime[1] : obj.stoneTime;

      if (obj.type != 3) {
        obj.left = this.computedTimeWidth(obj.startTime);
        obj.widthMe = obj.widthChild = this.computedTimeWidth(
          obj.startTime,
          obj.endTime
        );
        // console.log(obj.type);
        if (index == 0) {
          obj.top = 15;
        } else {
          if (
            this.list[index - 1].children &&
            this.list[index - 1].children.length > 0
          ) {
            obj.top =
              this.list[index - 1].children[
                this.list[index - 1].children.length - 1
              ].top + 40;
            // console.log("ggggggg");
            // obj.top =
            //   this.list[index - 1].children.length * 40 +
            //   this.list[index - 1].top +
            //   40;
          } else {
            // console.log("zzzz");
            obj.top = this.list[index - 1].top + 40;
            // console.log(obj.top);
          }
        }
      }
      if (obj.type == 2) {
        obj.per = 100;
        // this.setStoneLine();
      }
      if (obj.type == 3) {
        obj.per = 0;
        obj.id = new Date().getTime();
        obj.expand = true;
        if (index == 0) {
          obj.top = 15;
        } else {
          if (
            this.list[index - 1].children &&
            this.list[index - 1].children.length > 0
          ) {
            obj.top =
              this.list[index - 1].children[
                this.list[index - 1].children.length - 1
              ].top + 40;
          } else {
            obj.top = this.list[index - 1].top + 40;
          }
        }
      }
      obj.id = new Date().getTime();
      obj.isShow = true;
      // console.log(this.currentListIndex);
      if (isChildren && this.currentListIndex !== "") {
        let s = this.list[parseInt(this.currentListIndex)];
        s.children = s.children ? s.children : [];
        let cindex = s.children.length;
        obj.top = 40 + cindex * 40 + s.top;
        obj.parentId = s.id;
        s.children.push(obj);
        s.children.forEach(item => {
          item.isShow = true;
        });
        // console.log(s);
        this.setGroupWidth(s.id);
        this.setGroupPer(s.id);
        this.resetTop(this.currentListIndex);
        this.$set(this.list, parseInt(this.currentListIndex), s);
      } else {
        this.list.push(obj);
      }
      this.currentListIndex = "";
      this.isChildren = false;
      this.$refs.dialogAdd.resetFields();
      this.$refs.dialogAdd.form.per = 0;
      this.handlerRowClick(obj);
      this.handlerCheckIsExpandRow();
    },
    handlerCheckIsExpandRow() {
      this.$nextTick(() => {
        if (this.expandArr.length == 0) return;
        this.expandArr.forEach(i => {
          this.$refs.leftMenu.$refs.tableMenu.toggleRowExpansion(
            this.list[i],
            false
          );
        });
        this.list.forEach((i, index) => {
          if (index > this.expandArr[0]) {
            i.top = i.top + 40;
            if (i.children && i.children.length > 0 && i.expand) {
              i.children.forEach(z => {
                z.top = z.top + 40;
              });
            }
          }
        });
      });
    },
    //修改后续高度
    resetTop(zindex, reduce, isexpand) {
      // console.log(zindex, reduce, isexpand);
      let num = reduce ? -40 : 40;
      if (!reduce && !isexpand) {
        // console.log(2);
        this.list.forEach((item, index) => {
          if (index > zindex) {
            item.top = item.top + 40;
            if (item.children && item.children.length > 0) {
              item.children.forEach((k, i) => {
                k.top = item.top + 40 * i + 40;
              });
            }
          }
        });
      } else {
        // console.log(1);
        this.list.forEach((item, index) => {
          if (index > zindex) {
            item.top = item.top + num * this.list[zindex].children.length;
            if (item.children && item.children.length > 0) {
              item.children.forEach((k, i) => {
                k.top = item.top + 40 * i + 40;
              });
            }
          }
        });
      }
    },
    retDelTop(zindex, length) {
      this.list.forEach((item, index) => {
        if (index >= zindex) {
          item.top = item.top - 40 * length;
          if (item.children && item.children.length > 0) {
            item.children.forEach((k, i) => {
              k.top = item.top + 40 * i + 40;
            });
          }
        }
      });
    },
    //根据id设置group的宽度
    setGroupWidth(id, lists) {
      let parent;
      if (lists) {
        parent = lists.find(item => {
          return item.id == id;
        });
      } else {
        parent = this.list.find(item => {
          return item.id == id;
        });
      }
      let left = Math.min.apply(
        Math,
        parent.children.map(o => {
          return o.left;
        })
      );
      let arr = [];
      parent.children.forEach(item => {
        arr.push(item.left + item.widthMe);
      });
      let width = Math.max.apply(Math, arr);
      let widthMe = width - left;
      parent.widthMe = parent.widthChild = widthMe;
      parent.left = left;
      // return parent;
    },
    //新建项目
    handlerAddGantt() {
      this.dialogVal = true;
      this.title = "新建";
      // console.log(this.list);
      let arr = [];
      this.list.forEach((i, index) => {
        if (i.children && i.children.length > 0 && i.expand == false) {
          console.log(i.children && i.children.length > 0 && i.expand == false);
          arr.push(index);
        }
      });
      this.expandArr = arr;
      // console.log(arr);
      this.$nextTick(() => {
        this.$refs.dialogAdd.resetFields();
      });
    },
    // 转为分组
    handlerGroup(row) {
      let index = this.list.findIndex(item => {
        return item.id == row.id;
      });
      this.list[index].type = "3";
      this.list[index].per = 0;
      this.list[index].id = new Date().getTime();
      this.list[index].left = 0;
      this.list[index].widthMe = this.list[index].widthChild = 0;
      this.$set(this.list, index, this.list[index]);
    },
    //里程碑去掉mouseenter显示
    stoneLineMouseenter() {
      this.isShowMsg = false;
      this.currentLineDay = {
        start: 0,
        end: 0
      };
    },
    //转为计划任务
    handlerPlanProject(row) {
      if (!row.parentId) {
        let index = this.list.findIndex(item => {
          return item.id == row.id;
        });
        this.list[index].type = "1";
        this.list[index].stoneTime = "";
        this.list[index].per = 0;
        this.list[index].left =
          row.left + row.widthMe - this.currentDaySize.value;
        this.list[index].widthMe = this.currentDaySize.value;
        this.list[index].widthChild = this.currentDaySize.value;
      } else {
        let cindex = this.list.findIndex(item => {
          return item.id == row.parentId;
        });
        this.list[cindex].children.forEach(cl => {
          if (cl.id == row.id) {
            cl.type = "1";
            cl.per = 0;
            cl.stoneTime = "";
            cl.left = row.left + row.widthMe - this.currentDaySize.value;
            cl.widthMe = cl.widthChild = this.currentDaySize.value;
          }
        });
        this.setGroupPer(row.parentId);
        this.$set(this.list, cindex, this.list[cindex]);
      }
    },
    //转化为里程碑
    handlerMilestone(row) {
      if (!row.parentId) {
        let index = this.list.findIndex(item => {
          return item.id == row.id;
        });
        this.list[index].per = 100;
        this.list[index].type = "2";
        // let endTimeWidth = row.left + row.widthMe;
        this.list[index].left =
          row.left + row.widthMe - this.currentDaySize.value;
        this.list[index].widthMe = this.currentDaySize.value;
        this.list[index].widthChild = this.currentDaySize.value;
        this.setStoneLine();
      } else {
        let cindex = this.list.findIndex(item => {
          return item.id == row.parentId;
        });
        let cur = this.list.find(item => {
          return item.id == row.parentId;
        });
        let cl = cur.children.find(item => {
          return item.id == row.id;
        });
        cl.type = "2";
        cl.per = 100;
        cl.left = row.left + row.widthMe - this.currentDaySize.value;
        cl.widthMe = this.currentDaySize.value;
        cl.widthChild = this.currentDaySize.value;
        this.setGroupPer(row.parentId);
        this.setGroupWidth(row.parentId);
        this.$set(this.list, cindex, cur);
        this.setStoneLine();
      }
    },
    //leftMenu宽度设置
    rightLineMousedown(e) {
      let cx = e.clientX;
      let result;
      document.onmousemove = event => {
        result = event.clientX - cx;
        if (cx + result <= 441) return;
        this.$refs.rightLine.style.left = cx + result + "px";
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
        if (cx + result <= 441) {
          this.rightLineX = 441;
          return;
        }
        this.rightLineX = cx + result;
      };
    },
    //rowClick事件
    handlerRowClick(row) {
      // console.log(row);
      this.currentRow = row;
      window.scrollTo({
        top: 0,
        left: row.left - 100,
        behavior: "smooth"
      });
    },
    //更改daySize
    handleSetDaySize(item) {
      // console.log(item);
      this.currentDaySize = item;
      this.days.forEach((item, index) => {
        item.width = (index + 1) * this.currentDaySize.value;
      });
      this.handleScroll();
      if (this.currentRow) {
        let rs = this.computedList.find(o => {
          return o.id == this.currentRow.id;
        });
        this.$nextTick(() => {
          window.scrollTo(rs.left - 100, 0);
        });
      }
    },
    //滑动进度条事件
    thunkMousemove() {
      this.isShowMsg = false;
    },
    //滑动进度条事件
    thunkMousedown() {
      this.isShowMsg = false;
    },
    //滑动进度条事件
    thunkMouseup(per, e, id, parentId) {
      // console.log(per, id, parentId);
      let cindex = this.computedList.findIndex(z => {
        return z.id == id;
      });
      if (parentId) {
        let index = this.list.findIndex(k => {
          return k.id == parentId;
        });
        // console.log(parentId);
        this.list.forEach(item => {
          if (item.id == parentId) {
            // console.log(item, this.list);
            item.children.forEach(k => {
              if (k.id == id) {
                k.per = per;
              }
            });
          }
        });
        this.setGroupPer(parentId);
        this.$set(this.list, index, this.list[index]);
      } else {
        this.list.forEach(item => {
          if (item.id == id) {
            item.per = per;
          }
        });
      }
      this.checkIsin(`line${id}`, e, id, parentId, cindex);
    },
    //设置分组百分比
    setGroupPer(id, lists) {
      let z;
      if (lists) {
        z = lists.find(o => {
          return o.id == id;
        });
      } else {
        z = this.list.find(o => {
          return o.id == id;
        });
      }
      let count = 0;
      let length = z.children.length;
      z.children.forEach(item => {
        count = count + (item.per / 100) * (1 / length);
      });
      z.per = Math.round(count * 100);
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
      window.scrollTo({
        top: 0,
        left: width,
        behavior: "smooth"
      });
    },
    //左侧拖拽增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    leftCurDragMounsedown(dom, e, id, parentId, index) {
      let line = this.$refs[dom][0];
      let cx = e.pageX;
      let result;
      let result1;
      let z = 0;
      let x = 0;
      let addwidth;
      let timers;
      document.onmousemove = event => {
        if (
          event.clientX <= this.rightLineX + 80 &&
          event.pageX >= this.rightLineX + 80
        ) {
          if (!this.timer) {
            this.timer = window.setInterval(() => {
              z = window.scrollX - this.currentDaySize.value;
              // window.scrollTo(z, 0);
              window.scrollTo({
                top: 0,
                left: z,
                behavior: "smooth"
              });
              addwidth = cx - event.pageX;
            }, 50);
          }
        } else if (event.clientX >= window.innerWidth - 80) {
          if (!timers) {
            timers = window.setInterval(() => {
              x = window.scrollX + this.currentDaySize.value;
              // window.scrollTo(x, 0);
              window.scrollTo({
                top: 0,
                left: x,
                behavior: "smooth"
              });
              addwidth = -(event.pageX - cx);
            }, 50);
          }
        } else {
          window.clearInterval(this.timer);
          window.clearInterval(timers);
          this.timer = null;
          timers = null;
          if (event.pageX <= this.rightLineX) {
            addwidth = -(this.rightLineX - 2 - cx);
          } else {
            addwidth = -(event.pageX - cx);
          }
        }
        result = this.computedList[index].widthMe + addwidth;
        result1 = this.computedList[index].left - addwidth;
        if (result <= this.currentDaySize.value) {
          result = this.currentDaySize.value;
          result1 =
            this.computedList[index].left +
            this.computedList[index].widthMe -
            this.currentDaySize.value;
        } else if (result1 <= 0) {
          result1 = 0;
          // console.log(result1);
        }
        line.style.width = result + "px";
        line.style.left = result1 + "px";
        this.computedList[index].widthChild = result;
        this.lineMouseover(dom, e, id, parentId, index);
        this.lineMouseleave(e, true);
      };
      document.onmouseup = events => {
        if (!result) {
          document.onmousemove = document.onmouseup = null;
          return;
        }
        window.clearInterval(this.timer);
        window.clearInterval(timers);
        this.timer = null;
        timers = null;
        result =
          Math.round(result / this.currentDaySize.value) *
          this.currentDaySize.value;
        result1 =
          Math.round(parseInt(line.style.left) / this.currentDaySize.value) *
          this.currentDaySize.value;
        this.computedList[index].widthMe = result;
        this.computedList[index].widthChild = result;
        line.style.width = result + "px";
        this.computedList[index].left = result1;
        line.style.left = result1 + "px";
        this.checkIsin(dom, events, id, parentId, index);
        // this.setComputedListGroupWidth(parentId);
        if (parentId) {
          this.list.forEach(item => {
            if (item.id == parentId) {
              item.children.forEach(k => {
                if (k.id == id) {
                  k.widthMe = k.widthChild = result;
                  k.left = result1;
                }
              });
            }
          });
          this.setGroupWidth(parentId);
        } else {
          this.list.forEach(item => {
            if (item.id == id) {
              item.widthMe = item.widthChild = result;
              item.left = result1;
            }
          });
        }
        document.onmousemove = document.onmouseup = null;
      };
    },
    //右侧边缘增加
    /**
     * @param  {String} dom ref
     * @param  {Object} e $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    rightCurDragMounsedown(dom, e, id, parentId, index) {
      let line = this.$refs[dom][0];
      let cx = e.pageX;
      let result;
      let z = 0;
      let x = 0;
      let wx = window.scrollX;
      let addwidth;
      let timers;
      document.onmousemove = event => {
        if (event.clientX >= window.innerWidth - 80) {
          if (!this.timer) {
            z = 0;
            wx = window.scrollX;
            this.timer = window.setInterval(() => {
              z = z + this.currentDaySize.value;
              // window.scrollTo(z + wx, 0);
              window.scrollTo({
                top: 0,
                left: z + wx,
                behavior: "smooth"
              });
              addwidth = event.pageX - cx + z;
            }, 50);
          }
        } else if (event.clientX <= this.rightLineX + 80) {
          if (!timers) {
            timers = window.setInterval(() => {
              x = window.scrollX - this.currentDaySize.value;
              // window.scrollTo(x, 0);
              window.scrollTo({
                top: 0,
                left: x,
                behavior: "smooth"
              });
              addwidth = event.pageX - cx;
            }, 50);
          }
        } else {
          window.clearInterval(this.timer);
          window.clearInterval(timers);
          this.timer = null;
          timers = null;
          addwidth = event.pageX - cx;
        }
        result = this.computedList[index].widthMe + addwidth;
        if (
          result + parseInt(line.style.left) >=
          this.days.length * this.currentDaySize.value
        ) {
          result =
            this.days.length * this.currentDaySize.value -
            parseInt(line.style.left);
        }
        line.style.width = result + "px";
        this.computedList[index].widthChild = result;
        // console.log(line.style.width);
        if (result <= this.currentDaySize.value) {
          result = this.currentDaySize.value;
          line.style.width = result + "px";
          this.computedList[index].widthMe = result;
          this.computedList[index].widthChild = result;
        }
        this.lineMouseover(dom, e, id, parentId, index);
        this.lineMouseleave(e, true);
      };
      document.onmouseup = events => {
        if (!result) {
          document.onmousemove = document.onmouseup = null;
          return;
        }
        window.clearInterval(this.timer);
        window.clearInterval(timers);
        this.timer = null;
        timers = null;
        result =
          Math.round(result / this.currentDaySize.value) *
          this.currentDaySize.value;
        this.computedList[index].widthMe = result;
        this.computedList[index].widthChild = result;
        line.style.width = result + "px";
        this.checkIsin(dom, events, id, parentId, index);
        if (parentId) {
          this.list.forEach(item => {
            if (item.id == parentId) {
              item.children.forEach(k => {
                if (k.id == id) {
                  k.widthMe = k.widthChild = result;
                  // k.left = result1;
                }
              });
            }
          });
          this.setGroupWidth(parentId);
        } else {
          this.list.forEach(item => {
            if (item.id == id) {
              item.widthMe = item.widthChild = result;
              // item.left = result1;
            }
          });
        }
        document.onmousemove = document.onmouseup = null;
      };
    },
    //根据距离计算时间
    /**
     * @param  {Number} width
     * @param  {Boolean|String} time
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
    //根据index值和e判断是否在当前line的范围里，是否展示时间和msg框
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    checkIsin(dom, events, id, parentId, index) {
      let line = this.$refs[dom][0];
      let lineTop = parseInt(line.style.top);
      let lineDown = lineTop + 16;
      let lineLeft = parseInt(line.style.left);
      let lineRight = parseInt(this.computedList[index].widthMe) + lineLeft;
      if (
        events.pageX - this.rightLineX >= lineLeft &&
        events.pageX - this.rightLineX <= lineRight &&
        events.y - 40 >= lineTop &&
        events.y - 40 <= lineDown
      ) {
        this.lineMouseover(dom, events, id, parentId, index);
        this.lineMouseenter(dom, events, id, parentId, index);
      } else {
        this.isShowMsg = false;
        this.currentLineDay = {
          start: 0,
          end: 0
        };
      }
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    //鼠标悬停展示上部日期
    lineMouseover(dom, e, id, parentId, index) {
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
      this.handlerSelect(this.computedList[index]);
      this.lineMouseenter(dom, e, id, parentId, index);
    },
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    //鼠标进入显示当前项目的基本信息框
    lineMouseenter(dom, e, id, parentId, index) {
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
        name: this.computedList[index].name,
        allTime: (end - start) / this.currentDaySize.value + 1,
        per: this.computedList[index].per,
        startTime: this.computedWithTime(start),
        endTime: this.computedWithTime(end),
        left:
          e.pageX + 220 - window.scrollX >= window.innerWidth
            ? e.pageX - 220 - 600
            : e.pageX + 50 - 600,
        top: e.y + 20
      };
      this.isShowMsg = true;
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
        // this.handlerSelect();
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
      this.handlerSelect();
    },
    //每一行拖拽
    /**
     * @param  {String} dom ref
     * @param  {Object} events $event
     * @param  {Number} id id
     * @param  {Number} parentId parentId
     * @param  {Number} index index
     */
    lineMousedown(dom, e, id, parentId, index) {
      let line = this.$refs[dom][0];
      let cp = e.pageX;
      let result;
      let z = 0;
      let left;
      // console.log(cp);
      document.onmousemove = event => {
        if (event.clientX >= window.innerWidth - 40) {
          z = window.scrollX + this.currentDaySize.value;
          // window.scrollTo(z, 0);
          window.scrollTo({
            top: 0,
            left: z,
            behavior: "smooth"
          });
          let newWith = event.pageX - cp;
          result = this.computedList[index].left + newWith;
          line.style.left = result + "px";
          if (result <= 0) result = 0;
        } else if (event.clientX <= 40 + this.rightLineX) {
          z = window.scrollX - this.currentDaySize.value;
          // window.scrollTo(z, 0);
          window.scrollTo({
            top: 0,
            left: z,
            behavior: "smooth"
          });
          let newWith = event.pageX - cp;
          result = this.computedList[index].left + newWith;
          if (result <= 0) result = 0;
          line.style.left = result + "px";
        } else {
          let newWith = event.pageX - cp;
          result = this.computedList[index].left + newWith;
          if (result <= 0) result = 0;
          line.style.left = result + "px";
        }
        this.lineMouseover(dom, e, id, parentId, index);
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
        this.computedList[index].left = left;
        line.style.left = left + "px";
        this.checkIsin(dom, events, id, parentId, index);
        if (parentId) {
          this.list.forEach(item => {
            if (item.id == parentId) {
              item.children.forEach(k => {
                if (k.id == id) {
                  k.left = left;
                }
              });
            }
          });
          this.setGroupWidth(parentId);
        } else {
          this.list.forEach(item => {
            if (item.id == id) {
              item.left = left;
            }
          });
        }
        document.onmousemove = document.onmouseup = null;
      };
    },
    //获取近三年的所有天数
    getDay() {
      this.getAllDate();
    },
    //判断是否为闰年
    /**
     * @param  {Number} year 传入年份
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
      });
      arr.forEach(item => {
        for (var j in item) {
          this.days = this.days.concat(item[j]);
        }
      });
      this.days.forEach((item, index) => {
        item.width = (index + 1) * this.currentDaySize.value;
      });
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
          // eslint-disable-next-line no-unreachable
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
          // eslint-disable-next-line no-unreachable
          break;
        case 2:
          day = days == 365 ? 28 : 29;
          return day;
          // eslint-disable-next-line no-unreachable
          break;
      }
    },
    setList() {},
    //设置里程碑线的高度
    setStoneLine(isFirst) {
      this.$nextTick(() => {
        // let arr = Array.from(document.getElementsByClassName("stoneLine"));
        let height = window.getComputedStyle(
          document.getElementsByClassName("lineBG")[0]
        ).height;
        // console.log(height);
        this.lineBGHeight = height;
        // height = isFirst ? parseFloat(height) : parseFloat(height) - 16.8;
        // arr.forEach(e => {
        //   // e.style.height = height + "px";
        //   console.log(e.getBoundingClientRect());
        // });
        // console.log(arr[arr.length - 1].getBoundingClientRect());
        // arr[arr.length - 1].height = "1095px";
      });
    },
    //顶部固定时间
    handleScroll() {
      let w = window.scrollX;
      if (w <= 62) {
        this.showFixdTopMonth = false;
      } else {
        this.showFixdTopMonth = true;
      }
      let time = this.computedWithTime(w, "YD");
      this.fixdTopMonth = time;
    }
  },
  watch: {
    currentDaySize(newValue, oldValue) {
      this.list.forEach(item => {
        item.left = (item.left / oldValue.value) * newValue.value;
        item.widthMe = item.widthChild =
          (item.widthMe / oldValue.value) * newValue.value;
        if (item.children && item.children.length > 0) {
          item.children.forEach(k => {
            k.left = (k.left / oldValue.value) * newValue.value;
            k.widthMe = k.widthChild =
              (k.widthMe / oldValue.value) * newValue.value;
          });
        }
      });
    }
  },
  mounted() {
    document.addEventListener("scroll", this.handleScroll);
    this.getDay();
    this.setList();
    this.setStoneLine();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    document.onmousemove = document.onmouseup = null;
  }
};
</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
  user-select: none;
  position: relative;
  // overflow: hidden;
  .header {
    height: 40px;
    position: relative;
    .header-left {
      margin-left: 10px;
      box-sizing: border-box;
      padding-top: 5px;
      height: 40px;
      position: fixed;
      top: 0px;
      left: 0px;
      background-color: #fff;
    }
  }
  .left {
    position: fixed;
    top: 40px;
    left: 0px;
    height: calc(100% - 40px);
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
    height: calc(100% - 60px);
    position: relative;
    .topMonth {
      // width: 100px;
      background-color: #fff;
      position: fixed;
      top: 40px;
      height: 21px;
      line-height: 21px;
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #909090 !important;
    }
    .toolTip {
      position: fixed;
      right: 0px;
      top: 90px;
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

    .group {
      position: absolute;
      background-color: #909090 !important;
      border: none !important;
      border-radius: 0 !important;
      height: 14px !important;
      line-height: 14px !important;
      // margin-top: 5px;
      clip-path: polygon(
        100% 0,
        100% 100%,
        calc(100% - 8px) 60%,
        8px 60%,
        0 100%,
        0 0
      );
      // > div {
      //   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      // }
      .progress {
        // width: 50px;
        background-color: #606060 !important;
        height: 100%;
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
    position: absolute;
    left: 0px;
    top: 21px;
    height: calc(100% - 21px);
    .alldays {
      display: flex;
    }
    .lineBG {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: scroll;
    }
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
      position: relative;
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
        position: absolute;
        top: 20px;
        left: 0px;
        display: block;
        // height: 100%;
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