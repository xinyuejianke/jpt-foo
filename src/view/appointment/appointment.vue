<template>
  <div class="container">
    <div class="title" >新增排班</div>

    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="appointment" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">

            <el-form-item label="工作人员ID" prop="user_id">
              <el-dropdown @command="handleEmployeeId">
                <el-button>
                  {{ appointment.employee_id ? `${appointment.employee_id} : ${appointment.employee_nickname}`: 'ID : 员工昵称'}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-model="appointment.employee_id" icon="el-icon-user-solid" 
                    v-for="(employee, index) in employees" :key="index" :command="employee" >
                      {{employee.id}} : {{ employee.nickname }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>

            <el-form-item label="顾客ID" prop="member_id">
              <el-input v-model="appointment.member_id" placeholder="请填写顾客ID"></el-input>
            </el-form-item>
            <el-form-item label="日期和时间" prop="date_time">
              <el-input v-model="appointment.date_time" placeholder="请填写排班日期（格式：YYYY-MM-DD hh:mm e.g. 2023-01-31）"></el-input>
            </el-form-item>
            <el-form-item label="附言" prop="comment">
              <el-input v-model="appointment.comment" clearable placeholder="请填写附言（e.g. 发烧）"></el-input>
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
import appointmentModel from '../../model/appointment-model'
import userModel from '../../lin/model/user'

export default {
  props: {

    editAppointmentId: {
      type: Number,
      default: null,
    },
  },
  setup(props, context) {
    const form = ref(null)
    const loading = ref(false)
    const employees = ref([])
    const appointment = reactive({ member_id: '', date_time: '', employee_id: '', employee_nickname: '',  comment:'', advice:''})
    

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    onMounted(() => {
      loadEmployees()
    })

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
      loadEmployees()
    }

    const loadEmployees = async() => {
      employees.value = await userModel.getAllEmployees()
    }

    const submitForm = async formName => {
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          res = await appointmentModel.createAppointment(appointment)
          resetForm(formName)
          if (res.code < window.MAX_SUCCESS_CODE) {
            ElMessage.success(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }
    
    const handleEmployeeId = employee => {
      appointment.employee_id = employee.id
      appointment.employee_nickname = employee.nickname
    }

    const back = () => {
      context.emit('editClose')
    }

    return {
      back,
      appointment,
      form,
      rules,
      resetForm,
      submitForm,
      employees,
      loadEmployees,
      handleEmployeeId,
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
    member_id: [{ validator: checkInfo, trigger: 'blur', required: true }],
    employee_id: [{ validator: checkInfo, trigger: 'blur', required: true }],
    date_time: [{ validator: checkInfo, trigger: 'blur', required: true }],
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
