<template>
    <div class="pmodal">
        <div class="pmodal-window-container">
            <div class="pmodal-window" style="width: 500px;">
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
                        <div class="p-3">
                            <div class="form-group">
                                <label for="i_exameditor_name" class="mb-0">Nom</label>
                                <input
                                    v-model="exam.name"
                                    type="text"
                                    class="form-control"
                                    id="i_exameditor_name"
                                >
                            </div>

                            <div class="form-group">
                                <label for="i_exameditor_length" class="mb-0">Longueur</label>
                                <input
                                    v-model="exam.length"
                                    type="text"
                                    class="form-control"
                                    id="i_exameditor_length"
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../../utils/api";

import loading from "../../../components/loading.vue";
import popperWithButton from "../../../components/popper-with-button.vue";

export default {
    props: ["schedule", "examId"],

    components: {
        popperWithButton,
        loading
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

        async _delete() {
            // Should confirm obviously !
            // This resource is too much of a hassle to add again
            // @TODO

            this.saving = true;
            try {
                await api.delete("/exam/" + this.examId);
                this.$emit("deleted", this.exam);
            } catch (e) {}
            this.saving = false;
        },

        async loadExam() {
            this.loading = true;
            try {
                this.exam = await api.get("/exam/" + this.examId);
            } catch (e) {}
            this.loading = false;
        },

        async save() {
            this.saving = true;
            try {
                await api.put("/exam/" + this.examId, {}, this.exam);
                this.$emit("saved");
            } catch (e) {}
            this.saving = false;
        }
    }
};
</script>
