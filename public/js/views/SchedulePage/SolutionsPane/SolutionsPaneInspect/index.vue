<template>
    <div class>
        <div class="pl-2 pr-2">
            <div class="d-flex flex-row align-items-center">
                <div>
                    <h2 class="mb-0">Solution</h2>
                    <p class="mt-0 mb-0">{{ solution.name }}</p>
                </div>
                <div class="ml-auto" style="min-width: 300px;">
                    <VSelect
                        v-model="selectedResource"
                        :options="resources"
                        track-by="trackBy"
                        label="name"
                        group-values="classes"
                        group-label="name"
                    ></VSelect>
                </div>
            </div>

            <div class="p-2 pl-3 pr-3 c-card">
                <div class="schedule-display-container" v-if="selectedData">
                    <!-- Information columns (days) -->
                    <div class="column" style="width: 10%">
                        <div class="text-center">&nbsp;</div>
                        <div class="column-inner">
                            <div
                                v-for="i in schedule.days"
                                :key="i"
                                class="line double-line"
                            >{{ i }}</div>
                        </div>
                    </div>

                    <!-- Schedule columns -->
                    <div
                        v-for="(cls, i) in selectedData.classes"
                        :key="i"
                        :style="{ 'width': (85 / (selectedData.classes.length)) + '%' }"
                        class="column"
                    >
                        <div class="text-center">{{ cls.class.name }}</div>
                        <div class="column-inner">
                            <template v-for="(day, j) in cls.schedule">
                                <template v-for="k in 2">
                                    <div
                                        :key="`${j}_${k}`"
                                        :class="{ 'line-occupied': day[(k - 1) * 2].exam, 'day-separator': j > 0 && k === 1 }"
                                        class="line"
                                    >
                                        <template v-if="day[(k - 1) * 2].exam">
                                            <p class="m-0 nowrap">{{ day[(k - 1) * 2].exam.name }}</p>
                                            <small class="nowrap">
                                                <abbr
                                                    :title="day[(k - 1) * 2].teachers.map(t => t.name).join(', ')"
                                                    class="hidden-abbr"
                                                >{{ day[(k - 1) * 2].teachers.map(t => t.name).join(', ') }}</abbr>
                                            </small>
                                        </template>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import VSelect from 'vue-multiselect'

export default {
    mixins: [loader],

    props: {
        schedule: Object
    },

    components: {
        VSelect
    },

    data() {
        return {
            solution: { name: '', solution_data: '' },
            selectedResource: null
        }
    },

    computed: {
        solutionData() {
            return this.solution.solution_data
                ? JSON.parse(this.solution.solution_data)
                : {
                      classGroups: [],
                      teachers: []
                  }
        },

        // Used in class/teacher selector
        resources() {
            return [
                {
                    name: 'Classes',
                    classes: this.solutionData.classGroups.map((cg, i) => {
                        return {
                            type: 'group',
                            trackBy: 'group_' + i,
                            i,
                            name: cg.group.name
                        }
                    })
                }
            ]
        },

        selectedData() {
            if (!this.selectedResource) {
                return null
            }

            let res =
                this.selectedResource.type === 'group'
                    ? this.solutionData.classGroups[this.selectedResource.i]
                    : null

            console.log(JSON.parse(JSON.stringify(res)))

            return res
        }
    },

    methods: {
        async m_loader_loader() {
            this.solution = await api.get(
                '/solution/' + this.$route.params.solutionId
            )

            this.$nextTick(() => {
                if (!this.selectedResource) {
                    this.selectedResource = this.resources[0].classes[0]
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.schedule-display-container {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
}

.c-card {
    background-color: white;
    border: 1px solid transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    border-radius: 5px;
}

.column {
    width: 100%;
    max-width: 200px;

    flex: 0 0 auto;
    margin-right: 10px;
}

.column-inner {
    border: 1px solid rgba(black, 0.1);
    border-radius: 5px;

    background-color: rgba(black, 0.05);
}

.line {
    height: 50px;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0 10px;

    &.double-line {
        height: 100px;
    }

    &:not(:first-child) {
        border-top: 1px solid rgba(black, 0.1);
    }

    &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    &.line-occupied {
        background-color: rgba(black, 0);
    }

    &.day-separator {
        border-top: 1px solid rgba(black, 0.3);
    }
}

.nowrap {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hidden-abbr {
    text-decoration: none;
    border-bottom: 0;
}
</style>