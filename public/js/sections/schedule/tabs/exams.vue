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
                        >{{ exams.length }} examen{{ exams.length === 1 ? '' : 's' }}</h3>

                        <div class="ml-auto">
                            <add-exam-button :schedule="schedule" @saved="examAdded"/>
                        </div>
                    </div>
                </div>

                <div class="advanced-table-content">
                    <div v-for="(exam, i) in exams" :key="i">
                        <div
                            class="advanced-table-content-line actionable no-select can-be-clicked"
                            @click="examNameClicked(exam, $event)"
                        >
                            <div
                                class="advanced-table-content-cell no-border can-be-clicked"
                            >{{ exam.name }}</div>
                            <div
                                class="advanced-table-content-cell no-border ml-auto pr-2"
                                v-if="exam.id === openedExamId"
                            >
                                <button class="btn btn-secondary" @click.prevent="showEditor">
                                    <i class="fas fa-cog"></i>
                                </button>
                                <button
                                    class="btn btn-secondary"
                                    @click.prevent="editorExamInstanceId = -1"
                                >Ajouter</button>
                            </div>
                        </div>

                        <transition name="anim-show">
                            <div v-if="exam.id === openedExamId">
                                <div
                                    class="advanced-table-content-line align-items-center actionable"
                                    v-for="(instance, i) in exam['exam-instances']"
                                    :key="i"
                                    @click="editorExamInstanceId = instance.id"
                                >
                                    <div class="advanced-table-content-cell tree-cell no-border"></div>

                                    <div
                                        class="advanced-table-content-cell no-border"
                                        style="width: 8%;"
                                    >{{ instance['class-group'].name }}</div>

                                    <div
                                        class="advanced-table-content-cell no-border text-muted text-truncate"
                                        style="width: 50%;"
                                    >{{ instance.description }}</div>

                                    <div
                                        class="advanced-table-content-cell no-border"
                                    >{{ instance.teacher.name }}</div>

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
                                    v-if="exam['exam-instances'].length === 0"
                                    class="advanced-table-content-line"
                                >
                                    <div class="advanced-table-content-cell tree-cell no-border"></div>

                                    <div
                                        class="advanced-table-content-cell no-border"
                                    >Pas de groupes</div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>

        <!-- Exam editor modal -->
        <exam-editor-modal
            v-if="editorExamId !== null"
            :schedule="schedule"
            :exam-id="editorExamId"
            @saved="loadExams"
            @deleted="examDeleted"
            @closed="editorExamId = null"
        ></exam-editor-modal>

        <!-- Exam instance editor modal -->
        <exam-instance-editor-modal
            v-if="editorExamInstanceId !== null"
            :schedule="schedule"
            :exam="exams.find(e => e.id === editorExamInstanceId)"
            :exam-instance-id="editorExamInstanceId"
            @saved="loadExams"
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
            exams: [],

            // ID of exam corrently unfolded
            openedExamId: null,

            // ID of exam open in exam editor
            editorExamId: null,

            // ID of exam instance open in editor
            editorExamInstanceId: null
        };
    },

    created() {
        this.loadExams();
    },

    methods: {
        async examAdded(exam) {
            await this.loadExams();
            this.openedExamId = exam.id;
        },

        examNameClicked(exam, ev) {
            if (!ev.target.classList.contains("can-be-clicked")) {
                return false;
            }

            if (this.openedExamId === exam.id) {
                this.openedExamId = null;
            } else {
                this.openedExamId = null;

                setTimeout(() => (this.openedExamId = exam.id), 20);
            }
        },

        showEditor(ev) {
            this.editorExamId = this.openedExamId;
        },

        editorClosed() {
            this.editorExamId = null;
        },

        examDeleted(exam) {
            this.$set(this, "exams", this.exams.filter(e => e.id !== exam.id));
            this.openedExamId = null;
            this.editorExamId = null;
        },

        // Open exam instance creator for currently opened exam
        openExamInstanceEditor() {
            this.editorExamInstanceId = this.openedExamId;
        },

        // Loading
        async loadExams() {
            try {
                this.exams = await api.get("/exams", {
                    schedule_id: this.schedule.id,
                    $include: [
                        "exam-instances",
                        "exam-instances.teachers",
                        "exam-instances.class-groups",
                        "exam-instances.class-groups.classes"
                    ].join(",")
                });
            } catch (e) {}
        }
    }
};
</script>

