<template>
    <div class="pmodal">
        <div class="pmodal-window-container">
            <div class="pmodal-window">
                <div class="pmodal-header">
                    <h3 class="mb-0">Examen</h3>

                    <div class="ml-auto">
                        <popper-with-button v-if="!loading">
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
                    >Sauvegarder</button>
                    <button v-if="saving && !loading" class="btn ml-2">Sauvegarder</button>
                </div>

                <div class="pmodal-content">
                    <loading padding="5" v-if="loading"></loading>

                    <div v-else>
                        <div class="d-flex flex-row">
                            <div
                                style="width: 60%; border-right: 1px solid rgba(0, 0, 0, 0.15)"
                                class="p-3"
                            >
                                <div class="form-group">
                                    <label for="i_exameditor_name" class="mb-0">Nom</label>
                                    <input
                                        v-model="exam.name"
                                        type="text"
                                        class="form-control"
                                        id="i_exameditor_name"
                                    >
                                </div>
                            </div>
                            <div
                                style="width: 40%;"
                                class="p-3 text-muted"
                            >Liste des groupes et classes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../../api";

import popperWithButton from "../../../components/popper-with-button.vue";

export default {
    components: {
        popperWithButton
    },

    data() {
        return {
            loading: false,
            saving: false,
            exam: {}
        };
    },

    created() {
        this.loadExam();
    },

    methods: {
        close() {
            this.$emit("closed");
        },

        _delete() {
            // Should confirm obviously !
            // This resource is too much of a hassle to add again
        },

        save() {},

        loadExam() {
            this.loading = true;
            try {
                this.exam = api.get("/exam/" + this.examId, {
                    $include: [
                        "exam-instances",
                        "exam-instances.teachers",
                        "exam-instances.class-groups",
                        "exam-instances.class-groups.classes"
                    ].join(",")
                });

                console.log(this.exam.name);
            } catch (e) {}
            this.loading = false;
        }
    }
};
</script>
