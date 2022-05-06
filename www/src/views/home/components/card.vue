<template>
  <div style="display: inline-flex; margin-right: 3px; min-width: 137px">
    <div class="icon">
      <i v-if="id === 1" class="el-icon-office-building"></i>
      <i v-if="id === 2" class="el-icon-wallet"></i>
      <i v-if="id === 3" class="el-icon-setting"></i>
      <i v-if="id === 4" class="el-icon-shopping-cart-full"></i>
      <i v-if="id === 5" class="el-icon-s-check"></i>
      <i v-if="id === 6" class="el-icon-mic"></i>
      <i v-if="id === 7" class="el-icon-cold-drink"></i>
    </div>
    <div class="text">
      <div>
        {{ enterprise }}:<router-link :to="to"
          ><el-link type="primary">{{ count }}</el-link></router-link
        >
      </div>
      <div>
        从业人员:<router-link :to="'/basicinfo/employees/domestic?trade_type=' + id"
          ><el-link type="primary">{{ abroad_persons + domestic_persons }}</el-link></router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: {
    id: {
      type: Number,
      default: 0
    },
    to: {
      type: String,
      default: ''
    },
    enterprise: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    },
    abroad_persons: {
      type: Number,
      default: 0
    },
    domestic_persons: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style scoped>
.icon {
  font-size: 38px;
  color: #409eff;
  text-align: center;
  margin-right: 10px;
}
.text {
  font-size: 14px;
  min-width: 100px;
  text-align: left;
  line-height: 22px;
}
</style>
