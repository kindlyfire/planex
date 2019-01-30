<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Examens</h2>

            <loading v-if="loading" padding="5"></loading>

            <div v-else class="advanced-table exams-table">
                <div class="advanced-table-header with-bottom-shadow">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ examCount }} matière{{ examCount === 1 ? '' : 's' }}, {{ examInstancesCount }} examen{{ examInstancesCount === 1 ? '' : 's' }}</h3>

                        <div class="ml-auto d-flex flex-row">
                            <select v-model="displayType" class="mr-2 pl-1 pr-4">
                                <option value="exams">Matières</option>
                                <option value="class-groups" selected>Classes</option>
                            </select>

                            <add-exam-button
                                :schedule="schedule"
                                :disabled="displayType !== 'exams'"
                                @saved="examAdded"
                            />
                        </div>
                    </div>
                </div>

                <div class="advanced-table-content">
                    <div v-for="(entry, i) in tableData" :key="i">
                        <div
                            class="advanced-table-content-line actionable no-select can-be-clicked"
                            @click="examNameClicked(entry, $event)"
                        >
                            <div
                                class="advanced-table-content-cell no-border can-be-clicked"
                            >{{ entry.name }}</div>

                            <div
                                class="advanced-table-content-cell no-border ml-auto pr-2"
                                v-if="entry.id === openedResourceId"
                            >
                                <button
                                    v-if="displayType === 'exams'"
                                    class="btn btn-secondary"
                                    @click.prevent="showEditor"
                                >
                                    <i class="fas fa-cog"></i>
                                </button>
                                <button
                                    class="btn btn-secondary"
                                    @click.prevent="editorExamInstanceId = -1"
                                >
                                    <i class="fas fa-plus"></i> Examen
                                </button>
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
                                        style="width: 15%;"
                                    >{{ displayType === 'exams' ? instance['class-group'].name : instance.exam.name }}</div>

                                    <div
                                        class="advanced-table-content-cell no-border text-muted text-truncate"
                                        style="width: 40%;"
                                    >{{ instance.description }}</div>

                                    <div class="advanced-table-content-cell no-border">
                                        <template v-if="instance.teachers">
                                            <span
                                                v-if="instance.teachers.length === 1"
                                            >{{ instance.teachers[0].name }}</span>
                                            <span
                                                v-else-if="instance.teachers.length === 2"
                                            >{{ instance.teachers[0].name }}, {{ instance.teachers[1].name }}</span>
                                            <span
                                                v-else-if="instance.teachers.length >= 2"
                                            >{{ instance.teachers.length }} professeurs</span>
                                        </template>
                                    </div>

                                    <div
                                        class="advanced-table-content-cell ml-auto text-right text-color-primary"
                                    >
                                        <span
                                            class="badge badge-secondary ml-1"
                                            v-for="(cls, i) in instance['class-group'].classes"
                                            :key="i"
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
        <exam-editor-modal
            v-if="editorResourceId !== null"
            :schedule="schedule"
            :exam-id="editorResourceId"
            @saved="loadResources"
            @deleted="examDeleted"
            @closed="editorResourceId = null"
        ></exam-editor-modal>

        <!-- Exam instance editor modal -->
        <exam-instance-editor-modal
            v-if="editorExamInstanceId !== null"
            :schedule="schedule"
            :exam-instance-id="editorExamInstanceId"
            :exam="displayType === 'exams' ? tableData.find(t => t.id === openedResourceId) : null"
            :class-group="displayType === 'class-groups' ? tableData.find(t => t.id === openedResourceId) : null"
            :class-group-is-fixed="displayType === 'class-groups'"
            :exam-is-fixed="displayType === 'exams'"
            @saved="loadResources"
            @closed="editorExamInstanceId = null"
        ></exam-instance-editor-modal>
    </div>
</template>

<script>
import loading from "../../../components/loading.vue";
import api from "../../../api";

import addExamButton from "../modals/add-exam-button.vue";
import examEditorModal from "../modals/exam-editor-modal.vue";
import examInstanceEditorModal from "../modals/exam-instance-editor-modal.vue";

export default {
    props: ["schedule"],

    components: {
        loading,
        addExamButton,
        examEditorModal,
        examInstanceEditorModal
    },

    data() {
        return {
            loading: false,

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
            displayType: "class-groups"
        };
    },

    created() {
        this.loadResources();
    },

    watch: {
        displayType() {
            this.openedResourceId = null;
            this.loadResources();
        }
    },

    methods: {
        async examAdded(exam) {
            await this.loadResources();
            this.openedResourceId = exam.id;
        },

        examNameClicked(exam, ev) {
            if (!ev.target.classList.contains("can-be-clicked")) {
                return false;
            }

            if (this.openedResourceId === exam.id) {
                this.openedResourceId = null;
            } else {
                this.openedResourceId = null;

                setTimeout(() => (this.openedResourceId = exam.id), 20);
            }
        },

        showEditor(ev) {
            this.editorResourceId = this.openedResourceId;
        },

        editorClosed() {
            this.editorResourceId = null;
        },

        async examDeleted(exam) {
            await this.loadResources();
            this.openedResourceId = null;
            this.editorResourceId = null;
        },

        // Open exam instance creator for currently opened exam
        openExamInstanceEditor() {
            this.editorExamInstanceId = this.openedResourceId;
        },

        // Loading
        async loadResources() {
            // Update exam count in bg
            api.get("/exams", {
                schedule_id: this.schedule.id,
                $count: 1,
                $limit: 1
            }).then(data => {
                this.examCount = data[0].count;
            });

            api.get("/exam-instances", {
                "exams.schedule_id": this.schedule.id,
                $include: "exams",
                $count: 1,
                $limit: 1
            }).then(data => {
                this.examInstancesCount = data[0].count;
            });

            // Load good data depending on what is going to be displayed
            if (this.displayType === "exams") {
                this.tableData = await api.get("/exams", {
                    schedule_id: this.schedule.id,
                    $include: [
                        "exam-instances",
                        "exam-instances.exams",
                        "exam-instances.teachers",
                        "exam-instances.class-groups",
                        "exam-instances.class-groups.classes"
                    ].join(",")
                });
            } else if (this.displayType === "class-groups") {
                this.tableData = await api.get("/class-groups", {
                    schedule_id: this.schedule.id,
                    $include: [
                        "exam-instances",
                        "exam-instances.exams",
                        "exam-instances.teachers",
                        "exam-instances.class-groups",
                        "exam-instances.class-groups.classes"
                    ].join(",")
                });
            } else {
                throw new Error("Unknown displayType [tabs/exams.vue]");
            }
        }
    }
};
</script>

