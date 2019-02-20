<template>
    <div class="p-3">
        <div class="d-flex align-items-center">
            <div class="mr-3">Professeur&nbsp;:</div>
            <VSelect :options="teachers" v-model="selectedTeacher" label="name" track-by="id"></VSelect>
        </div>

        <div class="d-flex align-items-center mt-3">
            <div class="mr-3">Groupes&nbsp;:</div>
            <VSelect
                :options="groups"
                v-model="selectedGroups"
                label="name"
                track-by="id"
                :multiple="true"
            ></VSelect>
        </div>

        <p
            class="m-0 pt-3 text-muted"
        >Le professeur pourra donner jusqu'à deux examens en même temps dans ces groupes.</p>
    </div>
</template>

<script>
import loader from '&/mixins/loader'
import api from '&/utils/api'

import VSelect from 'vue-multiselect'

export default {
    mixins: [loader],

    props: {
        constraint: Object,
        schedule: Object,
        jsonData: Object
    },

    components: {
        VSelect
    },

    data() {
        return {
            teachers: [],
            selectedTeacher: null,

            groups: [],
            selectedGroups: []
        }
    },

    methods: {
        async m_loader_loader() {
            this.teachers = await api.get('/teachers', {
                schedule_id: this.schedule.id
            })

            this.groups = await api.get('/class-groups', {
                schedule_id: this.schedule.id,
                $order: 'name:ASC',
                $include: ['classes'].join(',')
            })

            if (this.jsonData.teacherId) {
                this.selectedTeacher = this.teachers.find(
                    (t) => t.id === this.jsonData.teacherId
                )
            }

            if (this.jsonData.groups) {
                this.selectedGroups = this.groups.filter((g) =>
                    (this.jsonData.groups || []).includes(g.id)
                )
            }
        }
    },

    watch: {
        selectedTeacher: {
            deep: true,
            handler(v) {
                this.$set(this.jsonData, 'teacherId', v ? v.id : null)
            }
        },

        selectedGroups: {
            deep: true,
            handler(v) {
                this.$set(this.jsonData, 'groups', v.map((g) => g.id))
            }
        }
    }
}
</script>
