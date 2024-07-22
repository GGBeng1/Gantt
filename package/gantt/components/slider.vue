<template>
  <div class="slider" ref="slider" :style="{ width: '100%' }">
    <div class="process" :style="{ width }"></div>
    <div class="thunk" ref="trunk" :style="{ left }">
      <div class="block">
        <i class="el-icon-caret-top" @mousedown.stop="thunkMousedown"></i>
      </div>
      <div class="tips" v-if="isMove">
        <span>{{ parseInt(scale * 100) }}</span>
        <i class="fas fa-caret-down"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["min", "max", "value", "widths", "id", "parentId"],
  data() {
    return {
      //滚动条DOM元素
      slider: null,
      //拖拽DOM元素
      thunk: null,
      //当前值
      per: this.value,
      //当前是否拖拽tip
      isMove: false
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.per = newValue;
    }
  },
  methods: {
    thunkMousedown(e) {
      let width = parseInt(this.width);
      let disX = e.clientX;
      this.$emit("thunkMousedown");
      this.isMove = true;
      console.log(this.isMove);
      document.onmousemove = e => {
        let newWidth = e.clientX - disX + width;
        let scale = newWidth / this.slider.offsetWidth;
        this.per = Math.ceil((this.max - this.min) * scale + this.min);
        this.per = Math.max(this.per, this.min);
        this.per = Math.min(this.per, this.max);
        this.$emit("thunkMousemove", e, this.index);
      };
      document.onmouseup = event => {
        this.isMove = false;
        this.$emit(
          "thunkMouseup",
          parseInt(this.scale * 100),
          event,
          this.id,
          this.parentId
        );
        document.onmousemove = document.onmouseup = null;
      };
      return false;
    }
  },
  //渲染到页面的时候
  mounted() {
    this.slider = this.$refs.slider;
    this.thunk = this.$refs.trunk;
  },
  computed: {
    scale() {
      return (this.per - this.min) / (this.max - this.min);
    },
    width() {
      if (this.slider) {
        return this.widths * this.scale + "px";
      } else {
        return 0 + "px";
      }
    },
    left() {
      if (this.slider) {
        return this.widths * this.scale - this.thunk.offsetWidth / 2 + "px";
      } else {
        return 0 + "px";
      }
    }
  }
};
</script>
<style>
.box {
  margin: 100px auto 0;
  width: 80%;
}
.clear:after {
  content: "";
  display: block;
  clear: both;
}
.slider {
  position: relative;
  height: 16px;
  background: #e4e7ed;
  border-radius: 3px;
  cursor: move;
  user-select: none;
}
.slider .process {
  position: absolute;
  left: 0;
  top: 0;
  width: 112px;
  height: 16px;
  border-radius: 3px;
  background: #409eff;
}
.slider .thunk {
  position: absolute;
  left: 100px;
  top: -7px;
  width: 20px;
  height: 20px;
}
.slider .block {
  transition: 0.2s all;
}
.slider .block i {
  font-size: 25px;
  position: relative;
  left: -3px;
  top: 15px;
  cursor: pointer;
}
.slider .tips {
  position: absolute;
  left: -3px;
  bottom: 0px;
  font-size: 12px;
  line-height: 24px;
  min-width: 15px;
  text-align: center;
  padding: 1px 5px;
  background: #000;
  border-radius: 5px;
  height: 24px;
  color: #fff;
}
.slider .tips i {
  position: absolute;
  margin-left: -5px;
  left: 50%;
  bottom: -9px;
  font-size: 16px;
  color: #000;
}
.slider .block:hover {
  transform: scale(1.1);
  opacity: 0.6;
}
</style>