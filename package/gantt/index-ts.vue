<template>
  <div class="chart" ref="chart">
    <div class="header">
      <div class="header-left">
        <el-button type="primary" size="mini" @click="handlerAddGantt">新建</el-button>
        <el-button type="primary" size="mini">保存</el-button>
        <el-button type="primary" size="mini" @click="handlerCheckList">批量添加数据</el-button>
      </div>
    </div>
    <div class="left" :style="{ width: rightLineX + 'px' }">
      <leftMenu
        :list="list"
        ref="leftMenuCom"
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
        ref="rightLineCom"
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
              <span class="dateNum todayDateNum" v-if="j.today" style="border-left: 1px solid #d7d7d7"> 今天 </span>
              <span
                v-else
                class="dateNum"
                :style="{
                  borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7',
                }"
                :class="{
                  weekday: j.weekday == 0 || j.weekday == 6,
                  isHover: j.width >= currentLineDay.start && j.width <= currentLineDay.end,
                }"
                >{{ j.date }}</span
              >
              <span
                class="dateBG"
                :class="{
                  weekday2: j.weekday == 0,
                  weekday1: j.weekday == 6,
                  today: j.today,
                }"
                :style="{
                  width: currentDaySize.value + 'px',
                  height: j.weekday == 0 || j.weekday == 6 ? lineBGHeight : '0px',
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
                  isHover: j.width >= currentLineDay.start && j.width <= currentLineDay.end,
                  nodBorder: j.width >= currentLineDay.start && j.width <= currentLineDay.end,
                }"
              >
                <div
                  style="width: 100%21px; height: 100%"
                  :style="{
                    borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7',
                  }"
                  v-show="
                    (j.width == currentLineDay.end && isHover && j.weekday != 1) ||
                    (j.width == currentLineDay.start && isHover && j.weekday != 1) ||
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
                  today: j.today,
                }"
                :style="{
                  width: currentDaySize.value + 'px',
                  height: j.weekday == 0 || j.weekday == 6 ? lineBGHeight : '0px',
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
                  isHover: j.width >= currentLineDay.start && j.width <= currentLineDay.end,
                  nodBorder: j.width >= currentLineDay.start && j.width <= currentLineDay.end,
                }"
              >
                <div
                  style="width: 100%; height: 100%; font-size: 10px !important"
                  :style="{
                    borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7',
                  }"
                  v-show="
                    (j.width == currentLineDay.end && isHover && j.date != 1) ||
                    (j.width == currentLineDay.start && isHover && j.date != 1) ||
                    j.date == 1
                  "
                >
                  {{ j.date }}
                </div>
              </span>
              <span
                class="dateBG weekday2"
                :class="{
                  today: j.today,
                }"
                style="border-right: none"
                :style="{
                  width: currentDaySize.value + 'px',
                  height: j.weekday == 0 || j.weekday == 6 ? lineBGHeight : '0px',
                }"
              ></span>
            </template>
          </div>
        </div>
        <div class="lineBG" @scroll="handlerBGScroll" ref="lineBG">
          <template v-for="(item, index) in computedList" :key="item.id + index + 'ccc'">
            <div
              class="line"
              :style="{
                left: item.left + 'px',
                width: item.widthMe + 'px',
                top: item.top + 'px',
              }"
              v-show="(item.type == '1' || item.type == '2') && item.isShow"
              :ref="'line' + item.id"
              @mousedown="lineMousedown(`line${item.id}`, $event, item.id, item.parentId, index)"
              @mouseover="lineMouseover(`line${item.id}`, $event, item.id, item.parentId, index)"
              @mouseleave="lineMouseleave($event, false)"
              @mouseenter="lineMouseenter(`line${item.id}`, $event, item.id, item.parentId, index)"
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
                @mousedown.stop="leftCurDragMounsedown(`line${item.id}`, $event, item.id, item.parentId, index)"
              ></div>
              <div
                class="rightCurDrag"
                v-show="item.type == '1'"
                @mousedown.stop="rightCurDragMounsedown(`line${item.id}`, $event, item.id, item.parentId, index)"
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
                width: item.widthMe + 'px',
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
          <span class="base"> {{ currentDaySize.label }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown" :style="{ left: left + 'px !important' }">
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
            top: currentProjectMsg.top + 'px',
          }"
        >
          <div class="lineMsg">
            <span class="projectName">{{ currentProjectMsg.name }}</span>
          </div>
          <div class="lineMsg">
            <span class="title">持续时间:</span><span>{{ currentProjectMsg.allTime }}天</span>
          </div>
          <div class="lineMsg">
            <span class="title">当前进度:</span><span>{{ currentProjectMsg.per }}%</span>
          </div>
          <div class="lineMsg">
            <span class="title">开始时间:</span><span>{{ currentProjectMsg.startTime }}</span>
          </div>

          <div class="lineMsg">
            <span class="title">结束时间:</span><span>{{ currentProjectMsg.endTime }}</span>
          </div>
        </div>
      </transition>
    </div>
    <el-dialog :title="title" v-model="dialogVal" width="500px" :before-close="handleClose" :append-to-body="true">
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
<script setup lang="ts">
import dialogAdd from "./components/dialogAdd.vue";
import slider from "./components/slider.vue";
import leftMenu from "./components/leftMenu.vue";
defineOptions({
  name: "Gantt",
})
import { ref, reactive, computed, nextTick, onUnmounted, getCurrentInstance, onMounted, watch } from "vue";
const _this = getCurrentInstance();
interface ListItem {
  name: string;
  ower: string;
  per: number;
  type: string;
  planTime: number[];
  stoneTime: number;
  startTime: number;
  endTime: number;
  id: number;
  expand?: boolean;
  top: number;
  isShow: boolean;
  children?: ListItem[];
  widthChild?: number;
  widthMe?: number;
  left: number;
  parentId?: number;
}

interface CurrentLineDay {
  start: number;
  end: number;
}

interface CurrentDaySize {
  label: string;
  value: number;
}

interface CurrentProjectMsg {
  name: string;
  allTime: number;
  per: number;
  startTime: number | string;
  endTime: number | string;
  left: number;
  top: number;
}

const isChildren = ref(false);
const dialogVal = ref(false);
const title = ref("新建");
const rightLineX = ref(600);
const fixdTopMonth = ref<number | string>("");
const allDays = ref<any[]>([]);
const days = ref<any[]>([]);
const monthArr = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

const list = ref<ListItem[]>([
  {
    name: "1",
    ower: "",
    per: 30,
    type: "3",
    planTime: [],
    stoneTime: 0,
    startTime: 0,
    endTime: 0,
    id: 1589512272596,
    expand: true,
    top: 15,
    isShow: true,
    children: [
      {
        name: "1-1",
        ower: "",
        per: 50,
        type: "1",
        planTime: [1589472000000, 1589817600000],
        stoneTime: 0,
        startTime: 1589472000000,
        endTime: 1589817600000,
        left: 20000,
        widthChild: 200,
        widthMe: 200,
        top: 55,
        id: 1589512287571,
        isShow: true,
        parentId: 1589512272596,
      },
      {
        name: "1-2",
        ower: "",
        per: 10,
        type: "1",
        planTime: [1589817600000, 1590076800000],
        stoneTime: 0,
        startTime: 1589817600000,
        endTime: 1590076800000,
        left: 20160,
        widthChild: 160,
        widthMe: 160,
        top: 95,
        id: 1589512309848,
        isShow: true,
        parentId: 1589512272596,
      },
    ],
    widthChild: 320,
    widthMe: 320,
    left: 20000,
  },
  {
    name: "2",
    ower: "",
    per: 100,
    type: "2",
    planTime: [],
    stoneTime: 1590249600000,
    startTime: 1590249600000,
    endTime: 1590249600000,
    left: 20360,
    widthChild: 40,
    widthMe: 40,
    top: 135,
    id: 1589512324786,
    isShow: true,
  },
  {
    name: "3",
    ower: "",
    per: 100,
    type: "2",
    planTime: [1589472000000, 1589817600000],
    stoneTime: 1590422400000,
    startTime: 1590422400000,
    endTime: 1590422400000,
    left: 20440,
    widthChild: 40,
    widthMe: 40,
    top: 175,
    id: 1589512356185,
    isShow: true,
  },
]);

const currentLineDay = ref<CurrentLineDay>({
  start: 0,
  end: 0,
});

const currentDaySize = reactive<CurrentDaySize>({
  label: "天",
  value: 40,
});

const currentDaySizeOptions = ref([
  { label: "天", value: 40 },
  { label: "周", value: 24 },
  { label: "月", value: 12 },
]);

const isShowMsg = ref(false);

const currentProjectMsg = ref<CurrentProjectMsg>({
  name: "",
  allTime: 0,
  per: 0,
  startTime: 0,
  endTime: 0,
  left: 0,
  top: 0,
});

const isHover = ref(false);
const showFixdTopMonth = ref(false);
const currentListIndex = ref("");
const editRow = ref<any[]>([]);
const currentRow = ref<any>(null);
const BGScrollTop = ref(0);
const lineBGHeight = ref("");
const expandArr = ref<any[]>([]);
const leftMenuCom = ref<InstanceType<typeof leftMenu>>();
const dialogAddCom = ref<InstanceType<typeof dialogAdd>>();
const lineBG = ref<HTMLDivElement | null>(null);
const rightLineCom = ref<HTMLDivElement | null>(null);
const computedList = computed(() => {
  let arr: ListItem[] = [];
  list.value.forEach((item) => {
    if (!item.children || item.children.length < 1) {
      arr.push(item);
    } else if (item.children && item.children.length >= 1) {
      arr.push(item);
      arr = arr.concat(item.children);
    }
  });
  return arr;
});
const listFindIndex = (id: number) => {
  let item = list.value.find((item) => item.id === id);
  if (item) {
    return item;
  } else {
    return list.value.find((item) => item.children?.findIndex((k) => k.id === id) !== -1);
  }
};
const left = computed(() => window.innerWidth - 30);

const currentYear = computed(() => new Date().getFullYear());

const currentMonth = computed(() => new Date().getMonth() + 1);

const currentDay = computed(() => new Date().getDate());

const TableScrollTop = (val: number) => {
  if (lineBG.value) {
    lineBG.value.scrollTo(0, val);
  }
};

const handlerBGScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  BGScrollTop.value = target.scrollTop;
};
const handlerCheckList = () => {
  // Implementation with type annotations
};
//设置左侧leftmenu高亮
const handlerSelect = (row?: ListItem) => {
  leftMenuCom.value?.handlerSelect(row);
};
//分组是否展开
const handlerExpand = (row: ListItem, expand: boolean) => {
  const rowIndex = list.value.findIndex((item) => item.id === row.id);
  if (rowIndex !== -1) {
    list.value[rowIndex].expand = expand;
    if (list.value[rowIndex].children && list.value[rowIndex].children!.length > 0) {
      list.value[rowIndex].children!.forEach((k) => {
        k.isShow = expand;
      });
    }
    resetTop(rowIndex, !expand, true);
  }
};
//分组添加子集
const handleGroupAdd = (row: ListItem) => {
  nextTick(() => {
    dialogAddCom.value?.resetFields();
  });
  currentListIndex.value = list.value.findIndex((item) => item.id === row.id) + "";
  dialogVal.value = true;
  isChildren.value = true;
};
//编辑
const handlerEdit = (row: ListItem) => {
  let obj: Partial<ListItem> = {};

  if (row.parentId) {
    editRow[0] = row.parentId;
    editRow[1] = row.id;
    const parent = list.value.find((item) => item.id === row.parentId);
    const cur = parent?.children?.find((item) => item.id === row.id);

    if (cur) {
      const { name, ower, type, planTime, stoneTime, per } = cur;
      obj = { name, ower, type, planTime, stoneTime, per };

      if (type === "2") {
        obj.stoneTime = computedWithTime(cur.left, true) as number;
      }
      obj.planTime = [
        computedWithTime(cur.left, true) as number,
        computedWithTime(cur.left + parseInt(cur.widthMe + "") - currentDaySize.value, true) as number,
      ];
    }
  } else {
    editRow[0] = row.id;
    const cur = list.value.find((item) => item.id === row.id);

    if (cur) {
      const { name, ower, type, planTime, stoneTime, per } = cur;
      obj = { name, ower, type, planTime, stoneTime, per };

      if (type === "2") {
        obj.stoneTime = computedWithTime(cur.left, true) as number;
      }
      obj.planTime = [
        computedWithTime(cur.left, true) as number,
        computedWithTime(cur.left + parseInt(cur.widthMe + "") - currentDaySize.value, true) as number,
      ];
    }
  }
  if (dialogAddCom.value) {
    dialogAddCom.value.form = obj as any;
  }
  title.value = "编辑";
  dialogVal.value = true;
};
//删除
function handlerDel(row: ListItem) {
  if (!row.parentId) {
    const index = list.value.findIndex((item) => item.id === row.id);
    list.value.splice(index, 1);
    if (row.type === "3") {
      if (!row.expand) {
        retDelTop(index, 1);
      } else {
        retDelTop(index, row?.children?.length || 0 + 1);
      }
    } else {
      retDelTop(index, 1);
    }
  } else {
    const parentIndex = list.value.findIndex((item) => item.id === row.parentId);
    const parent = list.value[parentIndex];
    const cindex = parent?.children?.findIndex((k) => k.id === row.id) || -1;
    if (cindex > -1) {
      parent?.children?.splice(cindex, 1);
      if (parent?.children?.[cindex]) {
        parent?.children?.forEach((o, i) => {
          if (i >= cindex) {
            o.top -= 40;
          }
        });
      }
    }

    setGroupWidth(row.parentId);
    setGroupPer(row.parentId);
    resetTop(parentIndex, true);
    list.value[parentIndex] = parent;
  }
}
const handleClose = (done: () => void) => {
  currentListIndex.value = "";
  isChildren.value = false;
  editRow.value = [];
  dialogAddCom.value?.resetFields();
  if (dialogAddCom.value?.form) {
    dialogAddCom.value.form.per = 0;
  }
  done();
};

const onCancle = () => {
  currentListIndex.value = "";
  isChildren.value = false;
  editRow.value = [];
  if (dialogAddCom.value?.form) {
    dialogAddCom.value.form.per = 0;
  }
};
//编辑保存
const handleEditSave = (row: ListItem) => {
  if (editRow.value.length === 1) {
    const curIndex = list.value.findIndex((item) => item.id === editRow.value[0]);
    if (curIndex !== -1) {
      const cur = list.value[curIndex];
      Object.assign(cur, row);
      cur.planTime = row.planTime;
      if (cur.type !== "3") {
        cur.startTime = row.stoneTime || row.planTime[0];
        cur.endTime = row.stoneTime || row.planTime[1];
        cur.left = computedTimeWidth(cur.startTime);
        cur.widthChild = cur.widthMe = computedTimeWidth(cur.startTime, cur.endTime);
        cur.per = row.per;
      }
      list.value[curIndex] = cur; // 更新list中的数据
    }
  } else if (editRow.value.length === 2) {
    const parentIndex = list.value.findIndex((item) => item.id === editRow.value[0]);
    if (parentIndex !== -1) {
      const parent = list.value[parentIndex];
      const curIndex = parent.children?.findIndex((item) => item.id === editRow.value[1]);
      if (curIndex !== undefined && curIndex !== -1 && parent.children) {
        const cur = parent.children[curIndex];
        Object.assign(cur, row);
        cur.planTime = row.planTime;
        cur.startTime = row.stoneTime || row.planTime[0];
        cur.endTime = row.stoneTime || row.planTime[1];
        cur.left = computedTimeWidth(cur.startTime);
        cur.widthChild = cur.widthMe = computedTimeWidth(cur.startTime, cur.endTime);
        parent.children[curIndex] = cur; // 更新parent中children的数据
        setGroupWidth(editRow.value[0]);
      }
    }
  }
  editRow.value = [];
  if (dialogAddCom.value?.form) {
    dialogAddCom.value.form.per = 0;
  }
};
// 根据时间计算距离
const computedTimeWidth = (startTime: number, endTime?: number): number => {
  let left =
    (Math.floor(startTime - new Date(`${currentYear.value - 1}/01/01`).getTime()) / (1000 * 60 * 60 * 24)) *
    currentDaySize.value;
  let width =
    (Math.floor((endTime || new Date().getTime()) - startTime) / (1000 * 60 * 60 * 24)) * currentDaySize.value +
    currentDaySize.value;
  return endTime ? width : left;
};
//新建保存
const handleSave = async (val: ListItem, isChildrenFlag: boolean) => {
  let obj = { ...val };
  let index = list.value.length;
  obj.startTime = obj.planTime.length > 0 ? obj.planTime[0] : obj.stoneTime;
  obj.endTime = obj.planTime.length > 0 ? obj.planTime[1] : obj.stoneTime;

  if (obj.type != "3") {
    obj.left = computedTimeWidth(obj.startTime);
    obj.widthMe = obj.widthChild = computedTimeWidth(obj.startTime, obj.endTime);
    if (index == 0) {
      obj.top = 15;
    } else {
      let childrenList = list.value?.[index - 1]?.children;
      if (childrenList?.length) {
        obj.top = childrenList[childrenList.length - 1].top + 40;
      } else {
        obj.top = list.value[index - 1].top + 40;
      }
    }
  }
  if (obj.type == "2") {
    obj.per = 100;
  }
  if (obj.type == "3") {
    obj.per = 0;
    obj.id = new Date().getTime();
    obj.expand = true;
    if (index == 0) {
      obj.top = 15;
    } else {
      let childrenList = list.value?.[index - 1]?.children;
      if (childrenList?.length) {
        obj.top = childrenList[childrenList.length - 1].top + 40;
      } else {
        obj.top = list.value[index - 1].top + 40;
      }
    }
  }
  obj.id = new Date().getTime();
  obj.isShow = true;
  if (isChildrenFlag && currentListIndex.value !== "") {
    let s = list.value[parseInt(currentListIndex.value)];
    s.children = s.children ? s.children : [];
    let cindex = s.children.length;
    obj.top = 40 + cindex * 40 + s.top;
    obj.parentId = s.id;
    s.children.push(obj);
    s.children.forEach((item) => {
      item.isShow = true;
    });
    setGroupWidth(s.id);
    setGroupPer(s.id);
    resetTop(Number(currentListIndex.value));
    list.value[parseInt(currentListIndex.value)] = s;
  } else {
    list.value.push(obj);
  }
  currentListIndex.value = "";
  isChildren.value = false;
  if (dialogAddCom.value) {
    dialogAddCom.value.resetFields();
    dialogAddCom.value.form.per = 0;
  }
  handlerRowClick(obj);
  handlerCheckIsExpandRow();
};
const handlerCheckIsExpandRow = () => {
  nextTick(() => {
    if (expandArr.value.length == 0) return;
    expandArr.value.forEach((i) => {
      leftMenuCom.value?.refs.tableMenu.toggleRowExpansion(list.value[i], false);
    });
    list.value.forEach((i, index) => {
      if (index > expandArr.value[0]) {
        i.top = i.top + 40;
        if (i.children && i.children.length > 0 && i.expand) {
          i.children.forEach((z) => {
            z.top = z.top + 40;
          });
        }
      }
    });
  });
};

const resetTop = (zindex: number, reduce?: boolean, isexpand?: boolean) => {
  let num = reduce ? -40 : 40;
  if (!reduce && !isexpand) {
    list.value.forEach((item, index) => {
      if (index > zindex) {
        item.top += 40;
        if (item.children && item.children.length > 0) {
          item.children.forEach((k, i) => {
            k.top = item.top + 40 * (i + 1);
          });
        }
      }
    });
  } else {
    list.value.forEach((item, index) => {
      if (index > zindex) {
        item.top += num * (list.value[zindex].children?.length || 0);
        if (item.children && item.children.length > 0) {
          item.children.forEach((k, i) => {
            k.top = item.top + 40 * (i + 1);
          });
        }
      }
    });
  }
};
const retDelTop = (zindex: number, length: number) => {
  list.value.forEach((item, index) => {
    if (index >= zindex) {
      item.top -= 40 * length;
      if (item.children && item.children.length > 0) {
        item.children.forEach((k, i) => {
          k.top = item.top + 40 * (i + 1);
        });
      }
    }
  });
};
//根据id设置group的宽度
const setGroupWidth = (id: number | string, lists?: any[]) => {
  let parent;
  if (lists) {
    parent = lists.find((item) => item.id === id);
  } else {
    parent = list.value.find((item) => item.id === id);
  }
  if (!parent || !parent.children) return;

  const left = Math.min(...parent.children.map((o) => o.left));
  const widths = parent.children.map((item) => item.left + item.widthMe);
  const width = Math.max(...widths);
  const widthMe = width - left;

  parent.widthMe = parent.widthChild = widthMe;
  parent.left = left;
};
//新建项目
const handlerAddGantt = () => {
  dialogVal.value = true;
  title.value = "新建";
  let arr: number[] = [];
  list.value.forEach((item, index) => {
    if (item?.children?.length && item.expand === false) {
      console.log(item.children && item.children.length > 0 && item.expand === false);
      arr.push(index);
    }
  });
  expandArr.value = arr;
  nextTick(() => {
    dialogAddCom.value?.resetFields();
  });
};
// 转为分组
const handlerGroup = (row: ListItem) => {
  const index = list.value.findIndex((item) => item.id === row.id);
  if (index !== -1) {
    const updatedRow = {
      ...list.value[index],
      type: "3",
      per: 0,
      id: Date.now(),
      left: 0,
      widthMe: 0,
      widthChild: 0,
    };
    list.value[index] = updatedRow;
  }
};
//里程碑去掉mouseenter显示
const stoneLineMouseenter = () => {
  isShowMsg.value = false;
  currentLineDay.value = {
    start: 0,
    end: 0,
  };
};
//转化为里程碑
const handlerPlanProject = (row: any) => {
  if (!row.parentId) {
    let index = list.value.findIndex((item) => item.id == row.id);
    if (index !== -1) {
      list.value[index].type = "1";
      list.value[index].stoneTime = 0;
      list.value[index].per = 0;
      list.value[index].left = row.left + row.widthMe - currentDaySize.value;
      list.value[index].widthMe = currentDaySize.value;
      list.value[index].widthChild = currentDaySize.value;
    }
  } else {
    let cindex = list.value.findIndex((item) => item.id == row.parentId);
    if (cindex !== -1 && list.value[cindex].children) {
      list.value[cindex].children.forEach((cl: ListItem) => {
        if (cl.id == row.id) {
          cl.type = "1";
          cl.per = 0;
          cl.stoneTime = 0;
          cl.left = row.left + row.widthMe - currentDaySize.value;
          cl.widthMe = cl.widthChild = currentDaySize.value;
        }
      });
      setGroupPer(row.parentId);
    }
  }
};
//转化为里程碑
const handlerMilestone = (row: any) => {
  if (!row.parentId) {
    let index = list.value.findIndex((item) => item.id == row.id);
    if (index !== -1) {
      list.value[index].per = 100;
      list.value[index].type = "2";
      list.value[index].left = row.left + row.widthMe - currentDaySize.value;
      list.value[index].widthMe = currentDaySize.value;
      list.value[index].widthChild = currentDaySize.value;
    }
    setStoneLine();
  } else {
    let cindex = list.value.findIndex((item) => item.id == row.parentId);
    let cur = list.value[cindex];
    if (cindex !== -1 && cur.children?.length) {
      let clIndex = cur.children.findIndex((item) => item.id == row.id);
      if (clIndex !== -1) {
        let cl = cur.children[clIndex];
        cl.type = "2";
        cl.per = 100;
        cl.left = row.left + row.widthMe - currentDaySize.value;
        cl.widthMe = currentDaySize.value;
        cl.widthChild = currentDaySize.value;
        setGroupPer(row.parentId);
        setGroupWidth(row.parentId);
      }
    }
    setStoneLine();
  }
};
//leftMenu宽度设置
const rightLineMousedown = (e: MouseEvent) => {
  let cx = e.clientX;
  let result: number;

  const mousemoveHandler = (event: MouseEvent) => {
    result = event.clientX - cx;
    if (cx + result <= 441) return;
    if (rightLineCom.value) rightLineCom.value.style.left = `${cx + result}px`;
  };

  const mouseupHandler = () => {
    document.removeEventListener("mousemove", mousemoveHandler);
    document.removeEventListener("mouseup", mouseupHandler);
    if (cx + result <= 441) {
      rightLineX.value = 441;
      return;
    }
    rightLineX.value = cx + result;
  };

  document.addEventListener("mousemove", mousemoveHandler);
  document.addEventListener("mouseup", mouseupHandler);
  onUnmounted(() => {
    document.removeEventListener("mousemove", mousemoveHandler);
    document.removeEventListener("mouseup", mouseupHandler);
  });
};
//rowClick事件
const handlerRowClick = (row: ListItem) => {
  currentRow.value = row;
  window.scrollTo({
    top: 0,
    left: row?.left || 0 - 100,
    behavior: "smooth",
  });
};
//更改daySize
const handleSetDaySize = (item: CurrentDaySize) => {
  currentDaySize.value = item.value;
  currentDaySize.label = item.label;
  days.value.forEach((i, index) => {
    i.width = (index + 1) * currentDaySize.value;
  });
  handleScroll();
  if (currentRow.value) {
    let rs = computedList.value.find((o) => o.id == currentRow.value.id);
    if (rs) {
      nextTick(() => {
        window.scrollTo(rs?.left || 0 - 100, 0);
      });
    }
  }
};
//滑动进度条事件
const thunkMousemove = () => {
  isShowMsg.value = false;
};
//滑动进度条事件
const thunkMousedown = () => {
  isShowMsg.value = false;
};
//滑动进度条事件
const thunkMouseup = (per: number, e: MouseEvent, id: number, parentId?: number) => {
  let cindex = computedList.value.findIndex((z) => z.id === id);
  if (parentId) {
    let index = list.value.findIndex((k) => k.id === parentId);
    list.value.forEach((item) => {
      if (item.id === parentId) {
        item.children?.forEach((k) => {
          if (k.id === id) {
            k.per = per;
          }
        });
      }
    });
    setGroupPer(parentId);
    // emit("update:list", list.value); // 假设父组件监听了 `update:list` 事件来更新 list
  } else {
    list.value.forEach((item) => {
      if (item.id === id) {
        item.per = per;
      }
    });
  }
  checkIsin(`line${id}`, e, id, parentId, cindex);
};
//设置分组百分比
const setGroupPer = (id: number, lists?: ListItem[]) => {
  let z: ListItem | undefined;
  if (lists) {
    z = lists.find((o) => o.id === id);
  } else {
    z = list.value.find((o) => o.id === id);
  }
  if (!z || !z.children) return;

  let count = 0;
  let length = z.children.length;
  z.children.forEach((item) => {
    count += (item.per / 100) * (1 / length);
  });
  z.per = Math.round(count * 100);
};
//回到今天
const handleGoToday = () => {
  let s = Math.round(window.innerWidth / currentDaySize.value / 2) * currentDaySize.value - rightLineX.value;
  let width =
    (Math.floor(
      new Date(`${currentYear.value}/${currentMonth.value}/${currentDay.value}`).getTime() -
        new Date(`${currentYear.value - 1}/01/01`).getTime()
    ) /
      (1000 * 60 * 60 * 24)) *
      currentDaySize.value -
    s;
  window.scrollTo({
    top: 0,
    left: width,
    behavior: "smooth",
  });
};
let timer: ReturnType<typeof setInterval> | null | number = null;
//左侧拖拽增加
/**
 * @param  {String} dom ref
 * @param  {Object} e $event
 * @param  {Number} id id
 * @param  {Number} parentId parentId
 * @param  {Number} index index
 */
const leftCurDragMounsedown = (dom: string, e: MouseEvent, id: number, parentId: number | undefined, index: number) => {
  let line;
  if (Array.isArray(_this?.refs?.[dom])) {
    line = _this?.refs?.[dom][0] as HTMLElement;
  } else {
    line = _this?.refs?.[dom] as HTMLElement;
  }
  let cx = e.pageX;
  let result: number;
  let result1: number;
  let z = 0;
  let x = 0;
  let addwidth: number;
  let timers: ReturnType<typeof setInterval> | null | number = null;
  const moveHandler = (event: MouseEvent) => {
    if (event.clientX <= rightLineX.value + 80 && event.pageX >= rightLineX.value + 80) {
      if (!timer) {
        timer = window.setInterval(() => {
          z = window.scrollX - currentDaySize.value;
          window.scrollTo({
            top: 0,
            left: z,
            behavior: "smooth",
          });
          addwidth = cx - event.pageX;
        }, 50);
      }
    } else if (event.clientX >= window.innerWidth - 80) {
      if (!timers) {
        timers = window.setInterval(() => {
          x = window.scrollX + currentDaySize.value;
          window.scrollTo({
            top: 0,
            left: x,
            behavior: "smooth",
          });
          addwidth = -(event.pageX - cx);
        }, 50);
      }
    } else {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
      if (timers !== null) {
        window.clearInterval(timers);
        timers = null;
      }
      if (event.pageX <= rightLineX.value) {
        addwidth = -(rightLineX.value - 2 - cx);
      } else {
        addwidth = -(event.pageX - cx);
      }
    }
    result = computedList[index].widthMe + addwidth;
    result1 = computedList[index].left - addwidth;
    if (result <= currentDaySize.value) {
      result = currentDaySize.value;
      result1 = computedList[index].left + computedList[index].widthMe - currentDaySize.value;
    } else if (result1 <= 0) {
      result1 = 0;
    }
    line.style.width = result + "px";
    line.style.left = result1 + "px";
    // computedList[index].widthChild = result;
    let res = listFindIndex(computedList[index].id);
    res && (res.widthChild = result);
    lineMouseover(dom, e, id, parentId, index);
    lineMouseleave(e, true);
  };

  const upHandler = (events: MouseEvent) => {
    if (!result) {
      document.onmousemove = document.onmouseup = null;
      return;
    }
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    if (timers !== null) {
      window.clearInterval(timers);
      timers = null;
    }
    result = Math.round(result / currentDaySize.value) * currentDaySize.value;
    result1 = Math.round(parseInt(line.style.left) / currentDaySize.value) * currentDaySize.value;
    // computedList[index].widthMe = result;
    // computedList[index].widthChild = result;
    let res = listFindIndex(computedList[index].id);
    res && (res.widthMe = res.widthChild = result);
    line.style.width = result + "px";
    computedList[index].left = result1;
    line.style.left = result1 + "px";
    checkIsin(dom, events, id, parentId, index);
    if (parentId) {
      list.value.forEach((item) => {
        if (item.id == parentId && item.children) {
          item.children.forEach((k) => {
            if (k.id == id) {
              k.widthMe = k.widthChild = result;
              k.left = result1;
            }
          });
        }
      });
      setGroupWidth(parentId);
    } else {
      list.value.forEach((item) => {
        if (item.id == id) {
          item.widthMe = item.widthChild = result;
          item.left = result1;
        }
      });
    }
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", upHandler);
  };

  document.addEventListener("mousemove", moveHandler);
  document.addEventListener("mouseup", upHandler);

  onUnmounted(() => {
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", upHandler);
  });
};
//右侧边缘增加
/**
 * @param  {String} dom ref
 * @param  {Object} e $event
 * @param  {Number} id id
 * @param  {Number} parentId parentId
 * @param  {Number} index index
 */
const rightCurDragMounsedown = (
  dom: string,
  e: MouseEvent,
  id: number,
  parentId: number | undefined,
  index: number
) => {
  let line;
  if (Array.isArray(_this?.refs?.[dom])) {
    line = _this?.refs?.[dom][0] as HTMLElement;
  } else {
    line = _this?.refs?.[dom] as HTMLElement;
  }
  let cx = e.pageX;
  let result;
  let z = 0;
  let x = 0;
  let wx = window.scrollX;
  let addwidth;
  let timers;
  const mousemoveHandler = (event: MouseEvent) => {
    if (event.clientX >= window.innerWidth - 80) {
      if (!timer) {
        z = 0;
        wx = window.scrollX;
        timer = window.setInterval(() => {
          z += currentDaySize.value;
          window.scrollTo({
            top: 0,
            left: z + wx,
            behavior: "smooth",
          });
          addwidth = event.pageX - cx + z;
        }, 50);
      }
    } else if (event.clientX <= rightLineX.value + 80) {
      if (!timers) {
        timers = window.setInterval(() => {
          x = window.scrollX - currentDaySize.value;
          window.scrollTo({
            top: 0,
            left: x,
            behavior: "smooth",
          });
          addwidth = event.pageX - cx;
        }, 50);
      }
    } else {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
      if (timers !== null) {
        window.clearInterval(timers);
        timers = null;
      }
      addwidth = event.pageX - cx;
    }

    result = computedList[index].widthMe + addwidth;
    if (result + parseInt(line.style.left) >= days.value.length * currentDaySize.value) {
      result = days.value.length * currentDaySize.value - parseInt(line.style.left);
    }
    line.style.width = result + "px";
    // computedList[index].widthChild = result;
    let res = listFindIndex(computedList[index].id);
    res && (res.widthChild = result);
    if (result <= currentDaySize.value) {
      result = currentDaySize.value;
      line.style.width = result + "px";
      // computedList[index].widthMe = result;
      // computedList[index].widthChild = result;
      res && (res.widthMe = res.widthChild = result);
    }
    lineMouseover(dom, e, id, parentId, index);
    lineMouseleave(e, true);
  };

  const mouseupHandler = (events: MouseEvent) => {
    if (!result) {
      document.onmousemove = document.onmouseup = null;
      return;
    }
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    if (timers !== null) {
      window.clearInterval(timers);
      timers = null;
    }
    result = Math.round(result / currentDaySize.value) * currentDaySize.value;
    // computedList[index].widthMe = result;
    // computedList[index].widthChild = result;
    let res = listFindIndex(computedList[index].id);
    res && (res.widthMe = res.widthChild = result);
    line.style.width = result + "px";
    checkIsin(dom, events, id, parentId, index);
    if (parentId) {
      list.value.forEach((item) => {
        if (item.id === parentId && item.children) {
          item.children.forEach((k: any) => {
            if (k.id === id) {
              k.widthMe = k.widthChild = result;
            }
          });
        }
      });
      setGroupWidth(parentId);
    } else {
      list.value.forEach((item) => {
        if (item.id === id) {
          item.widthMe = item.widthChild = result;
        }
      });
    }
    document.removeEventListener("mousemove", mousemoveHandler);
    document.removeEventListener("mouseup", mouseupHandler);
  };

  document.addEventListener("mousemove", mousemoveHandler);
  document.addEventListener("mouseup", mouseupHandler);

  onUnmounted(() => {
    document.removeEventListener("mousemove", mousemoveHandler);
    document.removeEventListener("mouseup", mouseupHandler);
  });
};
//根据距离计算时间
const computedWithTime = (width: number, time?: boolean | string) => {
  let startTime =
    (width / currentDaySize.value) * (1000 * 60 * 60 * 24) + new Date(`${currentYear.value - 1}/01/01`).getTime();
  let s = new Date(startTime);
  if (time) {
    return s.getTime();
  } else if (time === "YD") {
    return `${s.getFullYear()}年${s.getMonth() + 1}月`;
  } else {
    return `${s.getFullYear()}年${s.getMonth() + 1}月${s.getDate()}日`;
  }
};
//根据index值和e判断是否在当前line的范围里，是否展示时间和msg框
const checkIsin = (
  dom: string,
  events: MouseEvent,
  id: string | number,
  parentId: string | number | undefined,
  index: number
) => {
  let line;
  if (Array.isArray(_this?.refs?.[dom])) {
    line = _this?.refs?.[dom][0] as HTMLElement;
  } else {
    line = _this?.refs?.[dom] as HTMLElement;
  }
  const lineTop = parseInt(line.style.top);
  const lineDown = lineTop + 16;
  const lineLeft = parseInt(line.style.left);
  const lineRight = parseInt(computedList.value[index]?.widthMe + "") + lineLeft;
  if (
    events.pageX - rightLineX.value >= lineLeft &&
    events.pageX - rightLineX.value <= lineRight &&
    events.y - 40 >= lineTop &&
    events.y - 40 <= lineDown
  ) {
    // 假设 lineMouseover 和 lineMouseenter 是其他定义的方法
    lineMouseover(dom, events, id, parentId, index);
    lineMouseenter(dom, events, id, parentId, index);
  } else {
    isShowMsg.value = false;
    currentLineDay.value = {
      start: 0,
      end: 0,
    };
  }
};
//鼠标悬停展示上部日期
const lineMouseover = (
  dom: string, // 使用 Ref 类型来处理 $refs
  e: MouseEvent,
  id: string | number,
  parentId: string | number | undefined,
  index: number
) => {
  let line;
  if (Array.isArray(_this?.refs?.[dom])) {
    line = _this?.refs?.[dom][0] as HTMLElement;
  } else {
    line = _this?.refs?.[dom] as HTMLElement;
  }
  let start =
    Math.round(parseInt(line.style.left) / currentDaySize.value) * currentDaySize.value + currentDaySize.value;
  let end = parseInt(line.style.left) + parseInt(line.style.width);
  end = Math.round(end / currentDaySize.value) * currentDaySize.value;

  currentLineDay.value = { start, end };
  isHover.value = true;

  handlerSelect(computedList.value[index]);
  lineMouseenter(dom, e, id, parentId, index);
};
//鼠标进入显示当前项目的基本信息框
const lineMouseenter = (
  dom: string,
  e: MouseEvent,
  id: string | number,
  parentId: string | number | undefined,
  index: number
) => {
  let line;
  if (Array.isArray(_this?.refs?.[dom])) {
    line = _this?.refs?.[dom][0] as HTMLElement;
  } else {
    line = _this?.refs?.[dom] as HTMLElement;
  }
  if (!line) return; // 检查 dom 是否存在

  let start = Math.round(parseInt(line.style.left) / currentDaySize.value) * currentDaySize.value;
  let end = parseInt(line.style.left) + parseInt(line.style.width);
  end = Math.round(end / currentDaySize.value) * currentDaySize.value - currentDaySize.value;

  currentProjectMsg.value = {
    name: computedList.value[index].name,
    allTime: (end - start) / currentDaySize.value + 1,
    per: computedList.value[index].per,
    startTime: computedWithTime(start),
    endTime: computedWithTime(end),
    left: e.pageX + 220 - window.scrollX >= window.innerWidth ? e.pageX - 220 - 600 : e.pageX + 50 - 600,
    top: e.pageY + 20,
  };
  isShowMsg.value = true;
};
//鼠标离开信息消失，时间显示消失
const lineMouseleave = (e: MouseEvent, move: boolean) => {
  if (move) {
    isShowMsg.value = false;
    currentProjectMsg.value = {
      name: "",
      allTime: 0,
      per: 0,
      startTime: 0,
      endTime: 0,
      left: 0,
      top: 0,
    };
    // handlerSelect(); // 根据需要取消注释
    return;
  }
  currentLineDay.value = {
    start: 0,
    end: 0,
  };
  isHover.value = false;
  isShowMsg.value = false;
  currentProjectMsg.value = {
    name: "",
    allTime: 0,
    per: 0,
    startTime: 0,
    endTime: 0,
    left: 0,
    top: 0,
  };
  handlerSelect();
};
//每一行拖拽
const lineMousedown = (
  dom: string,
  e: MouseEvent,
  id: string | number,
  parentId: string | number | undefined,
  index: number
) => {
  // const line = ref<HTMLElement | null>(null); // 假设 dom 是 ref 名称
  // line.value = document.querySelector(`#${dom}`); // 假设 dom 是元素的 ID
  let line;
  if (Array.isArray(_this?.refs?.[dom])) {
    line = _this?.refs?.[dom][0] as HTMLElement;
  } else {
    line = _this?.refs?.[dom] as HTMLElement;
  }
  let cp = e.pageX;
  let result: number;
  let z = 0;
  let left: number;

  document.onmousemove = (event: MouseEvent) => {
    if (event.clientX >= window.innerWidth - 40) {
      z = window.scrollX + currentDaySize.value;
      window.scrollTo({
        top: 0,
        left: z,
        behavior: "smooth",
      });
      let newWidth = event.pageX - cp;
      result = computedList.value[index].left || 0 + newWidth;
      if (result <= 0) result = 0;
      if (line.value) line.value.style.left = `${result}px`;
    } else if (event.clientX <= 40 + rightLineX.value) {
      z = window.scrollX - currentDaySize.value;
      window.scrollTo({
        top: 0,
        left: z,
        behavior: "smooth",
      });
      let newWidth = event.pageX - cp;
      result = computedList.value[index].left || 0 + newWidth;
      if (result <= 0) result = 0;
      if (line.value) line.value.style.left = `${result}px`;
    } else {
      let newWidth = event.pageX - cp;
      result = computedList.value[index].left || 0 + newWidth;
      if (result <= 0) result = 0;
      if (line.value) line.value.style.left = `${result}px`;
    }
    lineMouseover(dom, e, id, parentId, index);
    lineMouseleave(e, true);
  };

  document.onmouseup = (events: MouseEvent) => {
    if (!result) {
      document.onmousemove = document.onmouseup = null;
      return;
    }
    left = Math.round(result / currentDaySize.value) * currentDaySize.value;
    computedList.value[index].left = left;
    if (line.value) line.value.style.left = `${left}px`;
    // checkIsin 方法假设已定义
    // checkIsin(dom, events, id, parentId, index);
    if (parentId) {
      list.value.forEach((item) => {
        if (item.id == parentId && item.children) {
          item.children.forEach((k) => {
            if (k.id == id) {
              k.left = left;
            }
          });
        }
      });
      setGroupWidth(parentId);
    } else {
      list.value.forEach((item) => {
        if (item.id == id) {
          item.left = left;
        }
      });
    }
    document.onmousemove = document.onmouseup = null;
  };
};
//获取近三年的所有天数
const getDay = () => {
  getAllDate();
};
//判断是否为闰年
/**
 * @param  {Number} year 传入年份
 */
const isLeapYear = (year: number) => {
  if (year % 4 > 0) {
    return true;
  }
  return false;
};
const getAllDate = () => {
  let arr = [currentYear.value - 1, currentYear.value, currentYear.value + 1];
  arr.forEach((item) => {
    let obj = { year: item, days: isLeapYear(item) ? 366 : 365 };
    allDays.value.push(obj);
  });
  checkDate();
};
//根据年份天数创建月份及月份天数数组

const checkDate = () => {
  allDays.value.forEach((item) => {
    item.month = handleMonthDay(item.days, item.year);
  });

  allDays.value.forEach((element) => {
    if (element.year === currentYear.value) {
      element.month?.[0][currentMonth.value].forEach((k) => {
        if (k.date === currentDay.value) {
          k.today = true;
        }
      });
    }
  });

  let arr = [];
  allDays.value.forEach((item) => {
    if (item.month) {
      arr = arr.concat(item.month);
    }
  });

  arr.forEach((item) => {
    for (const j in item) {
      days.value = days.value.concat(item[j]);
    }
  });

  days.value.forEach((item, index) => {
    item.width = (index + 1) * currentDaySize.value;
  });
};
const handleMonthDay = (days: number, year: number) => {
  let arr = new Array();
  let obj = {};
  monthArr.value.forEach((item) => {
    obj[item] = checkMonthDays(item, days);
  });
  arr.push(obj);
  let s = arr[0];
  for (let item in s) {
    s[item] = addNum(s[item], item, year);
  }
  return arr;
};
const addNum = (num: number, month: number | string, year: number | string) => {
  let arr = new Array();
  let obj = {};
  for (let i = 1; i <= num; i++) {
    obj["date"] = i;
    obj["weekday"] = new Date(`${year}/ ${month} / ${i}`).getDay();
    arr.push(obj);
    obj = {};
  }
  return arr;
};
//根据月份返回天数
/**
 * @param  {Number} month 月份
 * @param  {Number} days 天数
 */
const checkMonthDays = (month: number, days: number) => {
  let day: number;
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      day = days == 365 ? 28 : 29;
      return day;
  }
};
//设置里程碑线的高度
const setStoneLine = () => {
  nextTick(() => {
    const height = window.getComputedStyle(document.getElementsByClassName("lineBG")[0]).height;
    lineBGHeight.value = height;
  });
};
//顶部固定时间
const handleScroll = () => {
  let w = window.scrollX;
  showFixdTopMonth.value = w > 62;
  let time = computedWithTime(w, "YD");
  fixdTopMonth.value = time;
};
onMounted(() => {
  document.addEventListener("scroll", handleScroll);
  getDay();
  // setList();
  setStoneLine();
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.onmousemove = document.onmouseup = null;
});
watch(currentDaySize, (newValue, oldValue) => {
  list.value.forEach((item) => {
    item.left = (item.left || 0 / oldValue.value) * newValue.value;
    item.widthMe = item.widthChild = (item.widthMe || 0 / oldValue.value) * newValue.value;
    if (item.children && item.children.length > 0) {
      item.children.forEach((k) => {
        k.left = (k.left || 0 / oldValue.value) * newValue.value;
        k.widthMe = k.widthChild = (k.widthMe || 0 / oldValue.value) * newValue.value;
      });
    }
  });
});
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
        box-shadow:
          0 3px 12px 0 rgba(48, 48, 48, 0.05),
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
      clip-path: polygon(100% 0, 100% 100%, calc(100% - 8px) 60%, 8px 60%, 0 100%, 0 0);
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
