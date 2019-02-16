<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Examens</h2>

            <div class="advanced-table exams-table">
                <div class="advanced-table-header with-bottom-shadow">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ examCount }} matière{{ examCount === 1 ? '' : 's' }}, {{ examInstancesCount }} examen{{ examInstancesCount === 1 ? '' : 's' }}</h3>

                        <div class="ml-auto d-flex flex-row">
                            <select v-model="displayType" class="mr-2 pl-1 pr-4 form-control">
                                <option value="exams">Matières</option>
                                <option value="class-groups" selected>Classes</option>
                            </select>

                            <ButtonCreateExam
                                :schedule="schedule"
                                :disabled="displayType !== 'exams'"
                                @saved="examAdded"
                            ></ButtonCreateExam>
                        </div>
                    </div>
                </div>

                <div class="advanced-table-content">
                    <div
                        v-if="m_loader_loading && tableData.length === 0"
                        class="advanced-table-content-line"
                    >
                        <div class="advanced-table-content-cell no-border">
                            <i>Chargement...</i>
                        </div>
                    </div>

                    <div v-for="(entry, i) in tableData" :key="i">
                        <div
                            class="advanced-table-content-line actionable no-select can-be-clicked d-flex align-items-center"
                            style="height: 50px;"
                            @click="examNameClicked(entry, $event)"
                        >
                            <div
                                class="advanced-table-content-cell no-border can-be-clicked"
                                style="width: 75%"
                            >{{ entry.name }}</div>

                            <div
                                v-if="displayType === 'exams' && !m_loader_loading"
                                class="advanced-table-content-cell no-border can-be-clicked"
                            >{{ entry.length }}h</div>

                            <div
                                class="advanced-table-content-cell no-border ml-auto pr-2"
                                v-if="entry.id === openedResourceId"
                            >
                                <button
                                    v-if="displayType === 'exams'"
                                    class="btn btn-secondary btn-sm"
                                    @click.prevent="showEditor"
                                >
                                    <i class="fas fa-cog"></i>
                                </button>
                                <button
                                    class="btn btn-secondary btn-sm"
                                    @click.prevent="showExamInstanceCreator"
                                >
                                    <i class="fas fa-plus"></i> Examen
                                </button>
                            </div>
                            <div v-else class="advanced-table-content-cell no-border ml-auto pr-2">
                                <span
                                    class="badge badge-primary"
                                >{{ entry['exam-instances'].length }}</span>
                            </div>
                        </div>

                        <transition name="anim-show">
                            <div v-if="entry.id === openedResourceId">
                                <div
                                    class="advanced-table-content-line align-items-center actionable"
                                    v-for="(instance, i) in entry['exam-instances']"
                                    :key="i"
                                    @click="editorExamInstanceId = instance.id"
                                >
                                    <div class="advanced-table-content-cell tree-cell no-border"></div>

                                    <div
                                        class="advanced-table-content-cell no-border"
                                        style="width: 25%;"
                                    >{{ displayType === 'exams' ? instance['class-group'].name : instance.exam.name }}</div>

                                    <div
                                        v-if="displayType === 'class-groups'"
                                        style="width: 15%;"
                                        class="advanced-table-content-cell no-border can-be-clicked"
                                    >{{ instance.exam.length }}h</div>

                                    <div class="advanced-table-content-cell no-border">
                                        <template v-if="instance.teachers">
                                            <span
                                                v-if="instance.teachers.length === 1"
                                            >{{ instance.teachers[0].name }}</span>
                                            <span v-else-if="instance.teachers.length >= 1">
                                                <small
                                                    v-for="(teacher, i) in instance.teachers"
                                                    :key="i"
                                                    class="d-block"
                                                >{{ teacher.name }}</small>
                                            </span>
                                        </template>
                                    </div>

                                    <div class="advanced-table-content-cell ml-auto text-right">
                                        <span
                                            v-for="(cls, i) in instance.classes"
                                            :key="i"
                                            :class="[instance.classes.length === instance['class-group'].classes.length ? 'badge-secondary' : 'badge-info']"
                                            class="badge ml-1"
                                        >{{ cls.name }}</span>
                                    </div>
                                </div>

                                <div
                                    v-if="entry['exam-instances'].length === 0"
                                    class="advanced-table-content-line"
                                >
                                    <div class="advanced-table-content-cell tree-cell no-border"></div>

                                    <div
                                        class="advanced-table-content-cell no-border"
                                    >{{ displayType === 'exams' ? 'Pas de groupes' : 'Pas d\'examens' }}</div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>

        <!-- Exam editor modal -->
        <ModalEditorExam
            v-if="editorResourceId !== null"
            :schedule="schedule"
            :exam-id="editorResourceId"
            @saved="m_loader_load"
            @deleted="examDeleted"
            @closed="editorResourceId = null"
        ></ModalEditorExam>

        <!-- Exam instance editor modal -->
        <ModalEditorExamInstance
            v-if="editorExamInstanceId !== null"
            :schedule="schedule"
            :exam-instance-id="editorExamInstanceId"
            :exam="displayType === 'exams' ? tableData.find(t => t.id === openedResourceId) : null"
            :class-group="displayType === 'class-groups' ? tableData.find(t => t.id === openedResourceId) : null"
            :class-group-is-fixed="displayType === 'class-groups'"
            :exam-is-fixed="displayType === 'exams'"
            @saved="examInstanceSaved"
            @deleted="m_loader_load"
            @closed="editorExamInstanceId = null"
        ></ModalEditorExamInstance>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import LoadingBar from '&/components/LoadingBar'

import ButtonCreateExam from './ButtonCreateExam'
import ModalEditorExam from './ModalEditorExam'
import ModalEditorExamInstance from './ModalEditorExamInstance'

export default {
    mixins: [loader],
    props: ['schedule'],

    components: {
        LoadingBar,
        ButtonCreateExam,
        ModalEditorExam,
        ModalEditorExamInstance
    },

    data() {
        return {
            // Data for exams of class-groups
            // See displayType
            tableData: [],

            // Number of exams
            examCount: 0,

            // Number of exam instances
            examInstancesCount: 0,

            // ID of exam/class-group corrently unfolded
            openedResourceId: null,

            // ID of exam/instance open in exam editor
            editorResourceId: null,

            // ID of exam instance open in editor
            editorExamInstanceId: null,

            // How to display data
            // * "exams": display exam list, sublist is class groups
            // * "class-groups": display class groups, sublist is exams
            displayType: 'class-groups'
        }
    },

    watch: {
        displayType() {
            this.openedResourceId = null
            this.m_loader_load()
        }
    },

    methods: {
        async examAdded(exam) {
            await this.m_loader_load()
            this.openedResourceId = exam.id
        },

        examNameClicked(exam, ev) {
            // Prevents clicking on the buttons to close everything
            if (!ev.target.classList.contains('can-be-clicked')) {
                return false
            }

            if (this.openedResourceId === exam.id) {
                this.openedResourceId = null
            } else {
                this.openedResourceId = null

                setTimeout(() => (this.openedResourceId = exam.id), 20)
            }
        },

        showEditor(ev) {
            this.editorResourceId = this.openedResourceId
        },

        editorClosed() {
            this.editorResourceId = null
        },

        async examDeleted(exam) {
            await this.m_loader_load()

            this.openedResourceId = null
            this.editorResourceId = null
        },

        // Open exam instance creator for currently opened exam
        openExamInstanceEditor() {
            this.editorExamInstanceId = this.openedResourceId
        },

        // Create new exam
        showExamInstanceCreator() {
            this.editorExamInstanceId = -1
        },

        examInstanceSaved(instance) {
            this.editorExamInstanceId = instance.id
            this.m_loader_load()
        },

        // Loading
        async m_loader_loader() {
            // Update exam count in bg
            api.get('/exams', {
                schedule_id: this.schedule.id,
                $count: 1,
                $limit: 1
            }).then((data) => {
                this.examCount = data[0].count
            })

            api.get('/exam-instances', {
                'exams.schedule_id': this.schedule.id,
                $include: 'exams',
                $count: 1,
                $limit: 1
            }).then((data) => {
                this.examInstancesCount = data[0].count
            })

            // Load good data depending on what is going to be displayed
            if (this.displayType === 'exams') {
                this.tableData = await api.get('/exams', {
                    schedule_id: this.schedule.id,
                    $order: ['name', 'exam-instances.classes.name'].join(','),
                    $include: [
                        'exam-instances',
                        'exam-instances.classes',
                        'exam-instances.exams',
                        'exam-instances.teachers',
                        'exam-instances.class-groups',
                        'exam-instances.class-groups.classes'
                    ].join(',')
                })
            } else if (this.displayType === 'class-groups') {
                this.tableData = await api.get('/class-groups', {
                    schedule_id: this.schedule.id,
                    $order: ['name', 'exam-instances.classes.name'].join(','),
                    $include: [
                        'exam-instances',
                        'exam-instances.classes',
                        'exam-instances.exams',
                        'exam-instances.teachers',
                        'exam-instances.class-groups',
                        'exam-instances.class-groups.classes'
                    ].join(',')
                })
            } else {
                throw new Error('Unknown displayType')
            }
        }
    }
}
</script>

