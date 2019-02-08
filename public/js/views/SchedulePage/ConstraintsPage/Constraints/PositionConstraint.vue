<template>
    <div class="m-3">
        <div class="row">
            <div class="col-lg-6">
                <p class="m-0">Matière</p>
                <VSelect
                    v-model="selectedExam"
                    :options="exams"
                    :allow-empty="false"
                    track-by="id"
                    label="name"
                ></VSelect>
            </div>
            <div class="col-lg-6">
                <p class="m-0">Classe</p>
                <VSelect
                    v-model="selectedExamInstance"
                    :options="selectedExam ? selectedExam['exam-instances'] : []"
                    :allow-empty="false"
                    :show-labels="false"
                    track-by="id"
                >
                    <template slot="option" slot-scope="props">
                        <div class="d-flex">
                            <span>{{ props.option['class-group'].name }}</span>
                            <span class="ml-auto">
                                <span
                                    v-for="(cls, i) in props.option.classes"
                                    :key="i"
                                    class="badge badge-secondary ml-1"
                                >{{ cls.name }}</span>
                            </span>
                        </div>
                    </template>
                    <template slot="singleLabel" slot-scope="props">
                        <div class="d-flex">
                            <span>{{ props.option['class-group'].name }}</span>
                            <span class="ml-auto">
                                <span
                                    v-for="(cls, i) in props.option.classes"
                                    :key="i"
                                    class="badge badge-secondary ml-1"
                                >{{ cls.name }}</span>
                            </span>
                        </div>
                    </template>
                </VSelect>
            </div>
        </div>

        <p class="m-0 mt-3">Période</p>

        <ScheduleRenderAndAvailability
            :schedule="schedule"
            :columns="availabilityData"
            :exam="selectedExam"
            :exam-instance="selectedExamInstance"
            :start-time="selectedStartTime"
            @start-time="setStartTime"
        ></ScheduleRenderAndAvailability>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import ScheduleRenderAndAvailability from './ScheduleRenderAndAvailability'

import VSelect from 'vue-multiselect'

export default {
    mixins: [loader],
    props: {
        constraint: Object,
        schedule: Object
    },

    components: { VSelect, ScheduleRenderAndAvailability },

    data() {
        let rc = JSON.parse(JSON.stringify(this.constraint))

        return {
            rConstraint: rc,
            exams: [],
            selectedExam:
                rc['exam-instances'].length > 0
                    ? rc['exam-instances'][0].exam
                    : null,
            selectedExamInstance:
                rc['exam-instances'].length > 0 ? rc['exam-instances'][0] : null
        }
    },

    watch: {
        constraint(v) {
            let rc = JSON.parse(JSON.stringify(v))

            this.rConstraint = rc
            this.selectedExamInstance =
                rc['exam-instances'].length > 0 ? rc['exam-instances'][0] : null
            this.selectedExam = this.selectedExamInstance
                ? this.selectedExamInstance.exam
                : null
        },

        selectedExam: {
            handler() {
                this.selectedExamInstance = null
            }
        },

        selectedExamInstance: {
            handler(v) {
                this.rConstraint['exam-instances'] = v ? [v] : []
                this.rConstraint.data_json = JSON.stringify({
                    startTime: []
                })

                this.$emit(
                    'changed',
                    JSON.parse(JSON.stringify(this.rConstraint))
                )
            }
        }
    },

    computed: {
        availabilityData() {
            if (!this.selectedExamInstance) {
                return []
            }

            return JSON.parse(
                this.selectedExamInstance['class-group'].availability_json
            )
        },

        constraintData() {
            return JSON.parse(this.rConstraint.data_json || '{}')
        },

        selectedStartTime() {
            return this.constraintData.startTime || []
        }
    },

    methods: {
        setStartTime(st) {
            this.rConstraint.data_json = JSON.stringify({
                startTime: st
            })
            this.$emit('changed', JSON.parse(JSON.stringify(this.rConstraint)))
        },

        async m_loader_load() {
            this.exams = await api.get('/exams', {
                schedule_id: this.constraint.schedule_id,
                $include: [
                    'exam-instances',
                    'exam-instances.class-groups',
                    'exam-instances.classes'
                ].join(',')
            })
        }
    }
}
</script>
