<template>
    <popper-with-button ref="popper" @show="opened">
        <template slot="button-text">Ajouter</template>
        <template slot="popper-content">
            <div class="p-2">
                <input
                    type="text"
                    v-model="name"
                    placeholder="Nom de l'examen"
                    ref="input"
                    @keydown.enter="save"
                >
                
                <button
                    v-if="!saving"
                    @click="save"
                    class="btn btn-primary d-block w-100 mt-2"
                >Enregistrer</button>
                <button v-else class="btn btn-secondary d-block w-100 mt-2">Enregistrer</button>
            </div>
        </template>
    </popper-with-button>
</template>

<script>
import { HollowDotsSpinner } from "epic-spinners";
import popperWithButton from "../../../components/popper-with-button.vue";
import api from "../../../api";
import { setTimeout } from "timers";

export default {
    props: ["schedule"],

    components: {
        popperWithButton,
        HollowDotsSpinner
    },

    data() {
        return {
            name: "",
            saving: false
        };
    },

    methods: {
        async save() {
            if (!this.name) {
                return;
            }

            this.saving = true;

            try {
                let resource = await api.post(
                    "/exams",
                    {},
                    {
                        name: this.name,
                        length: 4,
                        schedule_id: this.schedule.id
                    }
                );

                this.$refs.popper.doClose();
                this.$emit("saved", resource);

                this.$nextTick(() => {
                    this.saving = false;
                    this.name = "";
                });
            } catch (e) {}

            this.saving = false;
        },

        opened() {
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        }
    }
};
</script>
