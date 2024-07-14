/* eslint-disable class-methods-use-this */
import _axios, { get, put, _delete } from '@/lin/plugin/axios'

class AppointmentModel {

  // 类中的方法可以代表一个用户行为
  async createAppointment(data) {
    return _axios({
      method: 'post',
      url: 'v1/appointments',
      data,
    })
  }

  async getAllAppointments() {
    return await get(`v1/appointments/`)
  }

  async getAppointmentsGoupByPage(pageNumber, rowsPerPage, dateTime, userId, memberId) {
    return await get('v1/appointments/results/group/by/page', { pageNumber, rowsPerPage, dateTime, userId, memberId })
  }

  async updateAppointment(appointmentId, info) {
    return await put(`v1/appointments/${appointmentId}`, info)
  }

  async deleteAppointment(appointmentId) {
    return await _delete(`v1/appointments/${appointmentId}`)
  }
}

export default new AppointmentModel()
