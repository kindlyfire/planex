import axios from 'axios'

export default {
    async getSchedules() {
        return (await axios.get('/api/schedules')).data
    },

    async createSchedule(name) {
        return (await axios.post('/api/schedules', {
            name
        })).data
    },

    async getSchedule(scheduleId) {
        return (await axios.get('/api/schedule', {
            params: {
                scheduleId
            }
        })).data
    },

    async getScheduleTeachers(scheduleId) {
        return (await axios.get('/api/schedule/teachers', {
            params: {
                scheduleId
            }
        })).data
    },

    async getTeacher(teacherId) {
        return (await axios.get('/api/teacher', {
            params: {
                teacherId
            }
        })).data
    },

    async updateTeacher(teacher) {
        return (await axios.put('/api/teacher', {
            teacher
        })).data
    },

    async deleteTeacher(teacherId) {
        return (await axios.delete('/api/teacher', {
            params: {
                teacherId
            }
        })).data
    },

    async createTeacher(scheduleId, teacher) {
        return (await axios.post(
            '/api/schedule/teachers',
            { teacher },
            { params: { scheduleId } }
        )).data
    }
}
