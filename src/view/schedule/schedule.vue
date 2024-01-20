<template>
  <div class="container">
    <div class="title" v-if="!editScheduleId">新增排班{{ editScheduleId }}</div>
    <div class="title" v-else>
      <span>修改排班</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="schedule" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
            <el-form-item label="工作人员ID" prop="user_id">
              <el-dropdown v-if="!editScheduleId" @command="handleCommand">
                <el-button>
                  {{ schedule.user_id ? `${schedule.user_id} : ${schedule.nickname}`: 'ID : 员工昵称'}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-model="schedule.user_id" icon="el-icon-user-solid" v-for="(employee, index) in employees" :key="index" :command="employee" >
                      {{employee.id}} : {{ employee.nickname }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <!-- 编辑模式 -->
              <el-input v-else disabled v-model="schedule.user.id"></el-input>
            </el-form-item>

            <el-form-item label="日期" prop="date">
              <el-input disabled v-model="schedule.date" placeholder="请填写排班日期（格式：yyyy-mm-dd）"></el-input>
            </el-form-item>

            <el-form-item label="时间" prop="times">
              <el-input v-model="schedule.times" placeholder="请填写排班时间（时间格式为24小时制，用英文逗号隔开。例如：13:30,14:00）"></el-input>
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
import scheduleModel from '../../model/schedule-model'
import userModel from '../../lin/model/user'

export default {
  props: {
    editScheduleId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const form = ref(null)
    const loading = ref(false)
    const schedule = reactive({ user_id: '', date: '', times: '', user: ''})
    const employees = ref([])

    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    onMounted(async () => {
      // load available employees info
      try {
        loading.value = true
        employees.value = await userModel.getAllEmployees()
        loading.value = false
      } catch (err) {
        loading.value = false
        console.error(err.data)
      }
      if (props.editScheduleId) {
        getSchedule()
      }
    })


    const getSchedule = async () => {
      loading.value = true
      const res = await scheduleModel.getSchedule(props.editScheduleId)
      listAssign(schedule, res)
      if (props.editScheduleId) {
        schedule.user_id = props.editScheduleId
      }
      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    const submitForm = async formName => {
      console.log(schedule)
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          if (props.editScheduleId) {
            res = await scheduleModel.updateSchedule(props.editScheduleId, schedule)
            context.emit('editClose')
          } else {
            res = await scheduleModel.createSchedule(schedule)
            resetForm(formName)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const back = () => {
      context.emit('editClose')
    }

    const handleCommand = targetEmployee => {
      //set schedule user to selected employee's id
      schedule.user_id = targetEmployee.id
      schedule.nickname = targetEmployee.nickname
    }

    return {
      back,
      schedule,
      form,
      rules,
      resetForm,
      submitForm,
      employees,
      handleCommand,
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
    user_id: [{ validator: checkInfo, trigger: 'blur', required: true }],
    date: [{ validator: checkInfo, trigger: 'blur', required: true }],
    times: [{ validator: checkInfo, trigger: 'blur', required: true }],
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
