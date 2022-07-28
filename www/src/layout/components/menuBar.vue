<template>
  <el-row class="container">
    <el-col :span="7">
      <!-- <svg-icon class="logo" icon-class="police badge" /> -->
      <img class="logo" :src="logoSrc" alt="" />
      <span class="title">{{ title }}</span>
    </el-col>
    <el-col :span="15">
      <ul>
        <li style="width: 100px" :class="{ active: activeMenu.indexOf('/home/') > -1 }">
          <app-link to="/home"> <i class="el-icon-s-platform"></i> 首页 </app-link>
        </li>
        <li :class="{ active: activeMenu.indexOf('/basicinfo/') > -1 }">
          <app-link to="/basicinfomg"> <i class="el-icon-s-claim"></i> 基础信息管理 </app-link>
        </li>
        <li :class="{ active: activeMenu.indexOf('/generalinfo/') > -1 }">
          <app-link to="/generalinfo"><i class="el-icon-files"></i> 综合信息查询 </app-link>
        </li>
        <li :class="{ active: activeMenu.indexOf('/analysis/') > -1 }">
          <app-link to="/analysis"><i class="el-icon-data-analysis"></i> 智能研判分析 </app-link>
        </li>
        <li :class="{ active: activeMenu.indexOf('/datacount/') > -1 }">
          <app-link to="/datacount"><i class="el-icon-s-data"></i> 数据统计分析 </app-link>
        </li>
        <li :class="{ active: activeMenu.indexOf('/systemmanage/') > -1 }">
          <app-link to="/systemmanage"><i class="el-icon-setting"></i> 系统管理 </app-link>
        </li>
      </ul>
    </el-col>
    <el-col :span="2">
      <div class="userinfo">
        <svg-icon icon-class="user" />
        <span>{{ username }}</span>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import defaultSettings from '@/settings'
import { logout, pwdvalid, changepwd } from '@/api/auth'
import { userinfo } from '@/api/home'
import { mapGetters } from 'vuex'
import AppLink from './Sidebar/Link'
import logoSrc from '@/assets/logo.png'
import { setToken } from '@/utils/auth'
export default {
  components: { AppLink },
  data() {
    const validateOldpwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入旧密码'))
      } else {
        pwdvalid({ password: value })
          .then(res => {
            if (res.code === 20000) {
              if (res.data) {
                return callback()
              } else {
                return callback(new Error('旧密码输入错误!'))
              }
            } else {
              return callback(new Error('旧密码验证失败!'))
            }
          })
          .catch(e => {
            console.error(e)
          })
      }
    }
    const validateNewPwd1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入新密码'))
      } else {
        if (value.length < 6) {
          return callback(new Error('新密码至少要6位以上'))
        } else {
          return callback()
        }
      }
    }
    const validateNewPwd2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入确认密码'))
      } else {
        if (value.length < 6) {
          return callback(new Error('新密码至少要6位以上'))
        } else if (value !== this.form.newpwd1) {
          return callback(new Error('两次输入的密码不一致'))
        } else {
          return callback()
        }
      }
    }
    return {
      title: defaultSettings.title,
      logoSrc: logoSrc,
      dialogFormVisible: false,
      route: this.$route,
      form: {
        oldpwd: '',
        newpwd1: '',
        newpwd2: ''
      },
      formRules: {
        oldpwd: [{ required: true, trigger: 'blur', validator: validateOldpwd }],
        newpwd1: [{ required: true, trigger: 'blur', validator: validateNewPwd1 }],
        newpwd2: [{ required: true, trigger: 'blur', validator: validateNewPwd2 }]
      },
      username: ''
    }
  },
  computed: {
    ...mapGetters(['avatar']),
    routes() {
      console.log(this.$router.options.routes)
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { path } = route
      return path
    }
  },
  created() {
    this.initUser()
  },
  methods: {
    initUser() {
      userinfo({})
        .then(res => {
          if (res.code === 200) {
            this.username = res.data.name + '(' + res.data.code + ')'
            setToken(res.data.code)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    logout() {
      this.$confirm('是否确认退出系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          logout().then(async () => {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
        })
        .catch(() => {})
    },
    changePwd() {
      this.dialogFormVisible = true
      const that = this
      this.$nextTick(function () {
        that.$refs.form.resetFields()
      })
    },
    handleModifyPwd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          changepwd({ oldpwd: this.form.oldpwd, newpwd: this.form.newpwd1 })
            .then(res => {
              if (res.code === 20000) {
                if (res.data) {
                  const that = this
                  this.dialogFormVisible = false
                  this.$alert('密码修改成功,需要重新登录系统', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      that.$router.push(`/login?redirect=${that.$route.fullPath}`)
                    }
                  })
                } else {
                  this.$message({
                    message: '密码修改失败!',
                    type: 'warning'
                  })
                }
              }
            })
            .catch(e => {})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: $menuHover;
  color: $menuText;

  .logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-left: 8px;
    margin-right: 8px;
  }

  .title {
    display: inline-block;
    margin: 0;
    color: #fff;
    font-weight: 400;
    line-height: 60px;
    font-size: 18px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-left: 5px;

    li {
      margin: 0;
      float: left;
      text-align: center;
      width: 165px;
      font-weight: 600;
      line-height: 60px;
      font-size: 20px;
    }

    li:hover {
      background-color: $menuBg;
      cursor: pointer;
      text-decoration: none;
      color: $menuActiveText;
    }
  }

  .active {
    color: $menuActiveText;
    background-color: $menuBg;
  }
}

.userinfo {
  display: flex;
  height: 60px;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 24px;
  }
}
</style>
