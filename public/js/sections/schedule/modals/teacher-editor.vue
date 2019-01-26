<template>
    <div class="pmodal">
        <div class="pmodal-window-container">
            <div class="pmodal-window">
                <div class="pmodal-header">
                    <h3 class="mb-0">{{ teacherId === -1 ? 'Ajouter un professeur' : 'Détails' }}</h3>

                    <div class="ml-auto">
                        <popper-with-button v-if="!loading && teacherId !== -1">
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
                    >{{ teacherId === -1 ? 'Ajouter' : 'Sauvegarder' }}</button>
                    <button
                        v-if="saving && !loading"
                        class="btn ml-2"
                    >{{ teacherId === -1 ? 'Ajouter' : 'Sauvegarder' }}</button>
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
                                    <label for="i_teachereditor_name" class="mb-0">Nom</label>
                                    <input
                                        v-model="teacher.name"
                                        type="text"
                                        class="form-control"
                                        id="i_teachereditor_name"
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="i_teachereditor_email" class="mb-0">Adresse email</label>
                                    <input
                                        v-model="teacher.email"
                                        type="text"
                                        class="form-control"
                                        id="i_teachereditor_name"
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="i_teachereditor_size" class="mb-0">Taille</label>
                                    <input
                                        v-model="teacher.size"
                                        type="text"
                                        class="form-control"
                                        id="i_teachereditor_size"
                                    >
                                    <small v-if="teacher.size > 1" class="form-text text-muted">
                                        <a>Éditer les contraintes de capacité</a>
                                    </small>
                                </div>
                            </div>
                            <div
                                style="width: 40%;"
                                class="p-3 text-muted"
                            >Ce professeur ne donne actuellement pas d'examens</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { HollowDotsSpinner } from "epic-spinners";
import loading from "../../../components/loading.vue";
import popperWithButton from "../../../components/popper-with-button.vue";
import api from "../../../api";

export default {
    props: ["teacherId", "schedule"],

    components: {
        HollowDotsSpinner,
        loading,
        popperWithButton
    },

    data() {
        return {
            loading: false,
            saving: false,
            teacher: {}
        };
    },

    created() {
        if (this.teacherId === -1) {
            this.teacher = {
                id: null,
                name: "",
                email: "",
                size: 1,
                schedule_id: this.schedule.id
            };
        } else {
            this.loadTeacher();
        }
    },

    methods: {
        close() {
            // Parent removes this component to close it
            this.$emit("closed");
        },

        async save() {
            this.saving = true;

            let res;

            try {
                if (this.teacherId === -1) {
                    this.teacher = await api.post(
                        "/teachers",
                        {},
                        this.teacher
                    );
                } else {
                    this.teacher = await api.put(
                        "/teacher/" + this.teacher.id,
                        {},
                        this.teacher
                    );
                }

                this.$emit("saved", { ...this.teacher });
            } catch (e) {}

            this.saving = false;
        },

        async loadTeacher() {
            this.loading = true;

            try {
                this.teacher = await api.get("/teacher/" + this.teacherId);
            } catch (e) {}

            this.loading = false;
        },

        async _delete() {
            this.saving = true;

            try {
                await api.delete("/teacher/" + this.teacherId);

                this.$emit("deleted");
                this.close();
            } catch (e) {}

            this.saving = false;
        }
    }
};
</script>
