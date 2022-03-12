<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <svg-icon icon-class="user" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="changePwd">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" width="25%" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="formRules">
        <el-form-item prop="oldpwd" label="旧密码">
          <el-input v-model="form.oldpwd" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="newpwd1" label="新密码">
          <el-input v-model="form.newpwd1" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="newpwd2" label="确认新密码">
          <el-input v-model="form.newpwd2" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleModifyPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logout, pwdvalid, changepwd } from '@/api/auth'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
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
      dialogFormVisible: false,
      form: {
        oldpwd: '',
        newpwd1: '',
        newpwd2: ''
      },
      formRules: {
        oldpwd: [{ required: true, trigger: 'blur', validator: validateOldpwd }],
        newpwd1: [{ required: true, trigger: 'blur', validator: validateNewPwd1 }],
        newpwd2: [{ required: true, trigger: 'blur', validator: validateNewPwd2 }]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
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
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
