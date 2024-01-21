<template>
  <div class="container">
    <div class="title" v-if="!editMemberId">新建成员{{ editMemberId }}</div>
    <div class="title" v-else>
      <span>修改成员</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="member" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="member.nickname" placeholder="请填写昵称"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="member.gender">
                <el-radio label="m">男</el-radio>
                <el-radio label="f">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
              <el-input v-model="member.birthday" placeholder="请填成员生日（格式：yyyy-mm-dd）"></el-input>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import memberModel from '../../model/member-model'

export default {
  props: {
    editMemberId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const form = ref(null)
    const loading = ref(false)
    const member = reactive({ nickname: '', gender: '', birthday: '' })

    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    onMounted(() => {
      if (props.editMemberId) {
        getMember()
      }
    })

    const getMember = async () => {
      loading.value = true
      const res = await memberModel.getMember(props.editMemberId)
      listAssign(member, res)
      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    const submitForm = async formName => {
      console.log('>>>')
      console.log(member)
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          if (props.editMemberId) {
            res = await memberModel.updateMember(props.editMemberId, member)
            context.emit('editClose')
          } else {
            res = await memberModel.createMember(member)
            resetForm(formName)
          }
          ElMessage.success('操作成功')
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const back = () => {
      context.emit('editClose')
    }

    return {
      back,
      member,
      form,
      rules,
      resetForm,
      submitForm,
    }
  },
}

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    nickname: [{ validator: checkInfo, trigger: 'blur', required: true }],
    gender: [{ validator: checkInfo, trigger: 'blur', required: true }],
    birthday: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
