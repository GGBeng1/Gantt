<template>
  <div class="dialogAdd">
    <el-form
      :model="form"
      ref="form"
      label-width="80px"
      label-position="top"
      :rules="rules"
      size="mini"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="ower">
        <el-select v-model="form.ower" style="width:100%">
          <el-option
            v-for="item in owerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划周期" prop="planTime" v-show="form.type == 1">
        <el-date-picker
          v-model="form.planTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="里程碑时间" prop="stoneTime" v-show="form.type == 2">
        <el-date-picker
          v-model="form.stoneTime"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" style="width:100%">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="onCancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    dialogVal: Boolean,
    owerOptions: Array,
    isChildren: Boolean
  },
  data() {
    return {
      form: {
        name: "",
        ower: "",
        type: "1",
        planTime: [],
        stoneTime: ""
      },
      typeOptions: [
        {
          label: "计划项目",
          value: "1"
        },
        {
          label: "里程碑",
          value: "2"
        },
        {
          label: "分组",
          value: "3",
          disabled: false
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100个字符",
            trigger: "blur"
          }
        ],
        planTime: [{ required: true, message: "请输入时间", trigger: "blur" }],
        ower: [{ message: "请选择负责人", trigger: "blur" }]
      }
    };
  },
  watch: {
    "form.type"(val) {
      if (val == 1) {
        this.rules = {
          name: [
            { required: true, message: "请输入名称", trigger: "blur" },
            {
              min: 1,
              max: 100,
              message: "长度在 1 到 100个字符",
              trigger: "blur"
            }
          ],
          planTime: [
            { required: true, message: "请输入时间", trigger: "blur" }
          ],
          ower: [{ message: "请选择负责人", trigger: "blur" }]
        };
      } else if (val == 2) {
        this.rules = {
          name: [
            { required: true, message: "请输入名称", trigger: "blur" },
            {
              min: 1,
              max: 100,
              message: "长度在 1 到 100个字符",
              trigger: "blur"
            }
          ],
          stoneTime: [
            { required: true, message: "请输入时间", trigger: "blur" }
          ],
          ower: [{ message: "请选择负责人", trigger: "blur" }]
        };
      } else if (val == 3) {
        this.rules = {
          name: [
            { required: true, message: "请输入名称", trigger: "blur" },
            {
              min: 1,
              max: 100,
              message: "长度在 1 到 100个字符",
              trigger: "blur"
            }
          ],
          ower: [{ message: "请选择负责人", trigger: "blur" }]
        };
      }
    },
    isChildren: {
      handler: function(val) {
        this.$set(this.typeOptions, 2, {
          label: "分组",
          value: "3",
          disabled: val
        });
      },
      immediate: true
    }
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("update:dialogVal", false);
          if (this.isChildren) {
            this.$emit("submit", this.form, true);
          } else {
            this.$emit("submit", this.form);
          }
        } else {
          return false;
        }
      });

      // this.form.type = "1";
    },
    onCancle() {
      this.$emit("update:dialogVal", false);
      this.$refs.form.resetFields();
      this.form.type = "1";
      this.$emit("onCancle");
    },
    resetFields() {
      this.$refs.form.resetFields();
      this.form.type = "1";
    }
  }
};
</script>

<style lang="scss" scoped>
.dialogAdd {
  .el-form--label-top .el-form-item__label {
    padding: 0px;
  }
}
</style>