<template>
    <div class>
        <div class="pl-2 pr-2">
            <div class="d-flex flex-row align-items-center">
                <div>
                    <h2 class="mb-0">Solution</h2>
                    <p class="mt-0 mb-0">{{ solution.name }}</p>
                </div>
                <div class="ml-auto selector-container" style="min-width: 300px;">
                    <VSelect
                        v-model="selectedResource"
                        :options="resources"
                        :allow-empty="false"
                        track-by="trackBy"
                        label="name"
                        group-values="classes"
                        group-label="name"
                    ></VSelect>
                </div>
            </div>

            <div class="p-2 pl-3 pr-3 c-card">
                <div class="schedule-display-container" v-if="selectedData">
                    <div class="title-line">
                        <div class="cell invisible" style="width: 10%">&nbsp;</div>
                        <div
                            class="cell-sizer cell-center"
                            v-for="(cls, i) in selectedData.classes"
                            :key="i"
                        >{{ cls.class.name }}</div>
                    </div>

                    <div>
                        <div
                            v-for="j in solution.days"
                            :key="j"
                            class="line"
                            :class="{ 'line-collapsed': singleLines.includes(j - 1) }"
                        >
                            <div class="cell cell-center" style="width: 10%">{{ j-- }}</div>

                            <div v-for="(cls, i) in selectedData.classes" :key="i" class="cell">
                                <!-- <div class="text-center">{{ cls.class.name || '&nbsp;' }}</div> -->
                                <template v-if="cls.schedule[j]">
                                    <template
                                        v-for="k in (deepeq(cls.schedule[j][0], cls.schedule[j][2]) ? 1 : 2)"
                                    >
                                        <div
                                            :key="`${j}_${k}`"
                                            :class="{ 'line-occupied': cls.schedule[j][(k - 1) * 2] && cls.schedule[j][(k - 1) * 2].exam, 'day-separator': j > 0 && k === 1, 'cell-part-blocked': cls.schedule[j][(k - 1) * 2] && cls.schedule[j][(k - 1) * 2].blocked }"
                                            class="cell-part text-center"
                                        >
                                            <template
                                                v-if="cls.schedule[j][(k - 1) * 2] && cls.schedule[j][(k - 1) * 2].exam"
                                            >
                                                <p
                                                    style="font-size: 16px"
                                                    class="m-0 nowrap"
                                                >{{ cls.schedule[j][(k - 1) * 2].exam.name }}</p>
                                                <p
                                                    style="font-size: 13px; color: rgba(0, 0, 0, 0.7);"
                                                    class="m-0"
                                                >{{ cls.schedule[j][(k - 1) * 2].teachers.map(t => t.name).join(', ') }}</p>
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
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import { sortAlpha } from '&/utils'

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
            solution: { name: '', solution_data: '', days: 0 },
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
                    classes: sortAlpha(
                        this.solutionData.classGroups.map((cg, i) => {
                            return {
                                type: 'group',
                                trackBy: 'group_' + i,
                                i,
                                name: cg.group.name
                            }
                        }),
                        'name'
                    )
                },
                {
                    name: 'Professeurs',
                    classes: sortAlpha(
                        this.solutionData.teachers.map((t, i) => {
                            return {
                                type: 'teacher',
                                trackBy: 'teacher_' + i,
                                i,
                                name: t.name
                            }
                        }),
                        'name'
                    )
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
                    : this.solutionData.teachers[this.selectedResource.i]

            res.classes = res.classes.sort((a, b) =>
                ('' + a.class.name).localeCompare(b.class.name)
            )

            return res
        },

        // Days that never have two different values
        singleLines() {
            if (!this.selectedResource) {
                return []
            }

            let singleLines = []

            for (let i = 0; i < this.solution.days; i += 1) {
                let alleq = true
                let ref = this.selectedData.classes[0]

                for (let cls of this.selectedData.classes) {
                    if (
                        !cls.schedule[i][0] ||
                        !cls.schedule[i][2] ||
                        !cls.schedule[i][0].blocked ||
                        !cls.schedule[i][2].blocked
                    ) {
                        alleq = false
                        break
                    }
                }

                if (alleq) {
                    singleLines.push(i)
                }
            }

            return singleLines
        }
    },

    methods: {
        deepeq(a, b) {
            return JSON.stringify(a) === JSON.stringify(b)
        },

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
.c-card {
    background-color: white;
    border: 1px solid transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    border-radius: 5px;
}

.line {
    min-height: 90px;

    display: flex;
    flex-direction: row;
}

.title-line {
    display: flex;
    flex-direction: row;
}

.line-collapsed {
    min-height: auto;
}

.cell {
    border: 1px solid rgba(black, 0.3);
    border-top: 0;
    margin-right: 10px;

    width: 100%;
    max-width: 200px;

    background-color: rgba(black, 0.05);

    display: flex;
    flex-direction: column;
}

.cell-sizer {
    margin-right: 10px;
    display: flex;

    width: 100%;
    max-width: 200px;
}

.cell-center {
    align-items: center;
    justify-content: center;
}

.line:first-child .cell,
.line:first-child .cell .cell-part-blocked:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border: 1px solid rgba(black, 0.3);
}

.line:last-child .cell,
.line:last-child .cell .cell-part-blocked:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.cell-part {
    min-height: 45px;
    width: 100%;
    border-top: 1px solid rgba(black, 0.1);

    flex: 1 0 auto;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.cell-part:first-child {
    border: 0;
}

@media only screen {
    .cell-part-blocked {
        background-color: rgba(black, 0.7);
        margin: -1px;
    }
}
</style>
