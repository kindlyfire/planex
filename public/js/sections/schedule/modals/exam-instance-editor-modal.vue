<template>
    <div class="pmodal">
        <div class="pmodal-window-container">
            <div class="pmodal-window">
                <!-- === Header === -->
                <div class="pmodal-header">
                    <h3 class="mb-0">Examen</h3>

                    <div class="ml-auto">
                        <popper-with-button v-if="!loading && examInstanceId !== -1">
                            <template slot="button-text">+</template>
                            <template slot="popper-content">
                                <button
                                    v-if="!saving"
                                    class="btn btn-danger cursor-pointer m-1"
                                    style="min-width: 150px"
                                    @click="_delete"
                                >Effacer</button>
                                <button v-else class="btn m-1" style="min-width: 150px">Effacer</button>
                            </template>
                        </popper-with-button>
                    </div>

                    <button class="btn ml-2 cursor-pointer" @click="close">Fermer</button>
                    
                    <button
                        v-if="!saving && !loading"
                        class="btn btn-primary cursor-pointer ml-2"
                        @click="save"
                    >{{ examInstanceId === -1 ? 'Ajouter' : 'Sauvegarder' }}</button>
                    <button
                        v-if="saving && !loading"
                        class="btn ml-2"
                    >{{ examInstanceId === -1 ? 'Ajouter' : 'Sauvegarder' }}</button>
                </div>

                <!-- === Content === -->
                <div class="pmodal-content">
                    <loading padding="5" v-if="loading"></loading>

                    <div v-else class="d-flex flex-row">
                        <div style="width: 65%; border-right: 1px solid rgba(0, 0, 0, 0.15)">
                            <div class="p-3">
                                <template v-if="!examIsFixed">
                                    <label class="mb-0">Examen</label>
                                    <v-select
                                        v-model="selectedExam"
                                        :options="exams"
                                        :allow-empty="false"
                                        track-by="id"
                                        label="name"
                                        deselect-label
                                    >
                                        <template slot="noResult">Pas de résultats.</template>
                                    </v-select>
                                </template>

                                <template v-if="!classGroupIsFixed">
                                    <!-- @TODO -->
                                    <label class="mb-0">Groupe</label>
                                    <v-select
                                        v-model="selectedClassGroup"
                                        :options="classGroups"
                                        :allow-empty="false"
                                        track-by="id"
                                        label="name"
                                        deselect-label
                                    >
                                        <template slot="noResult">Pas de résultats.</template>
                                    </v-select>
                                </template>

                                <label class="mb-0 mt-2">Professeurs</label>
                                <v-select
                                    v-model="selectedTeachers"
                                    :options="teachers"
                                    :allow-empty="true"
                                    :multiple="true"
                                    track-by="id"
                                    label="name"
                                    deselect-label
                                    placeholder="Sélectionner un professeur..."
                                >
                                    <template slot="noResult">Pas de résultats.</template>
                                </v-select>

                                <div class="form-group mt-2">
                                    <label for="i_exameditor_name" class="mb-0">Description</label>
                                    <input
                                        v-model="instance.description"
                                        type="text"
                                        class="form-control"
                                        id="i_exameditor_name"
                                    >
                                </div>
                            </div>
                        </div>

                        <div style="width: 35%">
                            <p
                                class="p-3"
                                v-for="(cls, i) of (selectedClassGroup || []).classes"
                                :key="i"
                            >{{ cls.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../../api";

import loading from "../../../components/loading.vue";
import popperWithButton from "../../../components/popper-with-button.vue";
import vSelect from "vue-multiselect";

export default {
    props: [
        "schedule",
        "examInstanceId",

        "exam",
        "examIsFixed",

        "classGroup",
        "classGroupIsFixed"
    ],

    components: {
        popperWithButton,
        loading,
        vSelect
    },

    data() {
        return {
            loading: false,
            saving: false,

            instance: {
                exam_id: null,
                group_id: this.classGroupId,
                teacher_id: null,
                description: "",
                teachers: [],
                exam: {}
            },

            exams: [],
            teachers: [],
            classGroups: [],

            // Selected exam in the exam dropdown
            selectedExam: null,

            // Selected teachers in the teachers dropdown
            selectedTeachers: null,

            // Selected class group in the class groups dropdown
            selectedClassGroup: null
        };
    },

    created() {
        this.loadResources();
    },

    methods: {
        close() {
            this.$emit("closed");
        },

        async _delete() {
            // Should confirm obviously !
            // This resource is too much of a hassle to add again
            // @TODO
            this.saving = true;
            try {
                await api.delete("/exam-instance/" + this.instance.id);
                this.$emit("deleted", this.instance);
                this.close();
            } catch (e) {
                console.log(e);
            }
            this.saving = false;
        },

        async loadResources() {
            this.loading = true;
            try {
                let res = await Promise.all([
                    this.examInstanceId !== -1
                        ? api.get("/exam-instance/" + this.examInstanceId, {
                              $include: ["exams", "teachers"].join(",")
                          })
                        : this.instance,
                    api.get("/exams", {
                        schedule_id: this.schedule.id
                    }),
                    api.get("/teachers", {
                        schedule_id: this.schedule.id
                    }),
                    api.get("/class-groups", {
                        schedule_id: this.schedule.id,
                        $inlude: "classes"
                    })
                ]);
                this.instance = res[0];
                this.exams = res[1];
                this.teachers = res[2];
                this.classGroups = res[3];

                if (this.exam) {
                    console.log("From selectedExam");
                    this.selectedExam = this.exams.find(
                        e => e.id === this.exam.id
                    );
                } else {
                    this.selectedExam = this.exams.find(
                        e => e.id === this.instance.exam_id
                    );
                }

                if (this.classGroup) {
                    this.selectedClassGroup = this.classGroups.find(
                        e => e.id === this.classGroup.id
                    );
                } else {
                    this.selectedClassGroup = this.classGroups.find(
                        e => e.id === this.instance.group_id
                    );
                }

                this.selectedTeachers = this.teachers.filter(
                    t => !!this.instance.teachers.find(t2 => t.id === t2.id)
                );
            } catch (e) {}
            this.loading = false;
        },

        async save() {
            this.saving = true;
            try {
                // Update props on exam
                this.instance.schedule_id = this.schedule.id;
                this.instance.exam_id = this.selectedExam.id;
                this.instance.group_id = this.selectedClassGroup.id;

                // Either update or create instance
                if (this.examInstanceId === -1) {
                    // Create
                    let tmpInstance = await api.post(
                        "/exam-instances",
                        {},
                        this.instance
                    );

                    // Get again, this time with associations
                    // Because api.post doesn't return any associations
                    this.instance = await api.get(
                        "/exam-instance/" + tmpInstance.id,
                        {
                            $include: ["exams", "teachers"].join(",")
                        }
                    );
                } else {
                    // Update
                    await api.put(
                        "/exam-instance/" + this.examInstanceId,
                        {},
                        this.instance
                    );
                }

                // Update teachers list
                // Basically, fetch then diff
                let deletedTeachers = this.instance.teachers.filter(
                    t => !this.selectedTeachers.find(t2 => t.id === t2.id)
                );
                let addedTeachers = this.selectedTeachers.filter(
                    t => !this.instance.teachers.find(t2 => t.id === t2.id)
                );

                await Promise.all([
                    ...deletedTeachers.map(t => {
                        return api.delete(
                            `/exam-instance/${this.instance.id}/teachers/${
                                t.id
                            }`
                        );
                    }),
                    ...addedTeachers.map(t => {
                        return api.post(
                            `/exam-instance/${this.instance.id}/teachers/${
                                t.id
                            }`
                        );
                    })
                ]);

                this.$emit("saved", this.instance);
            } catch (e) {
                console.log(e);
            }
            this.saving = false;
        }
    }
};
</script>
