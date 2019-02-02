<template>
    <popper-with-button ref="popper">
        <template slot="button-text">Créer</template>
        <template slot="popper-content">
            <div class="p-2">
                <input type="text" v-model="name" placeholder="Nom de l'horaire">
                
                <button
                    v-if="!saving"
                    @click="save"
                    class="btn btn-primary d-block w-100 mt-2"
                >Enregistrer</button>
                
                <button
                    v-if="saving"
                    class="btn btn-secondary d-block w-100 mt-2 d-flex justify-content-center align-items-center"
                >
                    <p>
                        <hollow-dots-spinner
                            :animation-duration="800"
                            :dot-size="8"
                            :dots-num="3"
                            color="inherit"
                        ></hollow-dots-spinner>
                    </p>
                </button>
            </div>
        </template>
    </popper-with-button>
</template>

<script>
import { HollowDotsSpinner } from "epic-spinners";
import popperWithButton from "../../components/popper-with-button.vue";
import api from "../../utils/api";
import { setTimeout } from "timers";

export default {
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
                await api.post("/schedules", {}, { name: this.name });

                this.$refs.popper.doClose();
                this.$emit("saved");

                this.$nextTick(() => {
                    this.saving = false;
                    this.name = "";
                });
            } catch (e) {}
        }
    }
};
</script>
