<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Professeurs</h2>

            <advanced-table
                :items="teachers"
                :columns="columns"
                :actionable="true"
                @click="onItemClick"
                v-if="!loading"
            >
                <template slot="header">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ teachers.length }} professeur{{ teachers.length !== 1 ? 's' : '' }} enregistré{{ teachers.length !== 1 ? 's' : '' }}</h3>

                        <button class="btn btn-secondary ml-auto" @click="addTeacher">Ajouter</button>
                    </div>
                </template>
            </advanced-table>

            <loading v-if="loading" padding="5"></loading>

            <teacher-editor
                v-if="editingTeacherId !== null"
                :teacherId="editingTeacherId"
                :schedule="schedule"
                @closed="editingTeacherId = null"
                @saved="teacherSaved"
                @deleted="teacherDeleted"
            ></teacher-editor>
        </div>
    </div>
</template>

<script>
import advancedTable from "../../../components/advanced-table.vue";
import loading from "../../../components/loading.vue";
import teacherEditor from "../modals/teacher-editor.vue";
import api from "../../../api";

export default {
    props: ["schedule"],

    components: {
        advancedTable,
        loading,
        teacherEditor
    },

    data() {
        return {
            loading: true,
            editingTeacherId: null,
            teachers: [],
            columns: [
                {
                    label: "Nom",
                    width: "30%",
                    key: "name"
                },
                {
                    label: "Email",
                    width: "30%",
                    key: "email"
                },
                {
                    label: "Taille",
                    width: "20%",
                    key: "size"
                }
            ]
        };
    },

    created() {
        this.loadTeachers();
    },

    methods: {
        onItemClick(e) {
            this.editingTeacherId = e.id;
        },

        async loadTeachers() {
            this.loading = true;

            let res = await api.getScheduleTeachers(this.schedule.id);

            if (res.status === 200) {
                this.teachers = res.data;
            } else {
                console.error("Error: " + res.error);
            }

            this.loading = false;
        },

        teacherSaved(teacher) {
            let index = this.teachers.findIndex(t => t.id === teacher.id);

            if (index === -1) {
                this.teachers.push(teacher);
            } else {
                this.$set(this.teachers, index, teacher);
            }

            if (this.editingTeacherId === -1) {
                this.editingTeacherId = teacher.id;
            }
        },

        teacherDeleted() {
            this.$set(
                this,
                "teachers",
                this.teachers.filter(t => t.id !== this.editingTeacherId)
            );
        },

        addTeacher() {
            this.editingTeacherId = -1;
        }
    }
};
</script>
