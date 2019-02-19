<template>
    <div>
        <VSelect
            :options="classGroups"
            v-model="realSelectedGroup"
            :allow-empty="false"
            :show-labels="false"
            track-by="id"
        >
            <template slot="option" slot-scope="props">
                <div class="d-flex">
                    <span>{{ props.option.name }}</span>
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
                    <span>{{ props.option.name }}</span>
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

        <VSelect
            :options="instances"
            v-model="realSelectedInstance"
            :allow-empty="false"
            :show-labels="false"
            track-by="id"
            class="mt-2"
        >
            <template slot="option" slot-scope="props">
                <div class="d-flex">
                    <span>{{ props.option.exam.name }}</span>
                    <span class="ml-auto">{{ props.option.exam.length }}h</span>
                </div>
            </template>
            <template slot="singleLabel" slot-scope="props">
                <div class="d-flex">
                    <span>{{ props.option.exam.name }}</span>
                    <span class="ml-auto">{{ props.option.exam.length }}h</span>
                </div>
            </template>
        </VSelect>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import VSelect from 'vue-multiselect'

export default {
    mixins: [loader],

    props: ['value', 'schedule'],

    components: {
        VSelect
    },

    data() {
        return {
            instances: [],
            classGroups: [],
            realSelectedGroup: null,
            realSelectedInstance: null
        }
    },

    methods: {
        async m_loader_loader() {
            this.classGroups = await api.get('/class-groups', {
                schedule_id: this.schedule.id,
                $include: ['classes'].join(',')
            })

            if (this.value) {
                await this.loadInstances()

                this.$nextTick(async () => {
                    this.realSelectedInstance = this.instances.find(
                        (i) => i.id === this.value
                    )

                    this.realSelectedGroup = this.realSelectedInstance
                        ? this.realSelectedInstance['class-group']
                        : null

                    await this.loadInstances()
                })
            }
        },

        async loadInstances() {
            this.instances = await api.get('/exam-instances', {
                'exams.schedule_id': this.schedule.id,
                'class-groups.id': this.realSelectedGroup
                    ? this.realSelectedGroup.id
                    : undefined,
                $include: [
                    'exams',
                    'class-groups',
                    'class-groups.classes'
                ].join(',')
            })
        }
    },

    watch: {
        realSelectedGroup: {
            deep: true,
            async handler() {
                if (!this.m_loader_loading) {
                    await this.loadInstances()

                    this.$nextTick(() => {
                        this.realSelectedInstance = null
                    })
                }
            }
        },

        realSelectedInstance: {
            deep: true,
            handler(v) {
                this.$emit('input', v ? v.id : null)
            }
        }
    }
}
</script>
