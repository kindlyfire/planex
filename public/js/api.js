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
    },

    async getScheduleClassGroups(scheduleId) {
        return (await axios.get('/api/schedule/class-groups', {
            params: {
                scheduleId
            }
        })).data
    },

    async getScheduleClasses(scheduleId) {
        return (await axios.get('/api/schedule/classes', {
            params: {
                scheduleId
            }
        })).data
    },

    async createClassGroup(scheduleId, group) {
        return (await axios.post(
            '/api/schedule/class-groups',
            { group },
            { params: { scheduleId } }
        )).data
    },

    async getClassGroup(groupId) {
        return (await axios.get('/api/class-group', {
            params: {
                groupId
            }
        })).data
    },

    async deleteClassGroup(groupId) {
        return (await axios.delete('/api/class-group', {
            params: {
                groupId
            }
        })).data
    },

    async updateClassGroup(group) {
        return (await axios.put('/api/class-group', {
            group
        })).data
    },

    async createClass(scheduleId, cls) {
        return (await axios.post(
            '/api/schedule/classes',
            { class: cls },
            { params: { scheduleId } }
        )).data
    },

    async deleteClass(classId) {
        return (await axios.delete('/api/class', {
            params: {
                classId
            }
        })).data
    }
}
