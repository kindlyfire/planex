<template>
    <div class="pmodal">
        <div class="pmodal-window-container">
            <div class="pmodal-window">
                <div class="pmodal-header">
                    <h3 class="mb-0">Groupe</h3>

                    <div class="ml-auto">
                        <popper-with-button v-if="!loading && groupId !== -1">
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
                    <loading-bar padding="5" v-if="loading"></loading-bar>

                    <div v-else>
                        <div class="d-flex flex-row">
                            <div
                                style="width: 60%; border-right: 1px solid rgba(0, 0, 0, 0.15)"
                                class="p-3"
                            >
                                <div class="form-group">
                                    <label for="i_groupeditor_name" class="mb-0">Nom</label>
                                    <input
                                        v-model="group.name"
                                        type="text"
                                        class="form-control"
                                        id="i_groupeditor_name"
                                    >
                                </div>
                            </div>
                            <div style="width: 40%" class="text-muted comp-group-class-list">
                                <div class="gcl-list-container">
                                    <div>
                                        <div
                                            v-for="(cls, i) in classes"
                                            :key="i"
                                            class="gcl-list-item"
                                        >
                                            <div>{{ cls.name }}</div>
                                            <div
                                                class="actions cursor-pointer"
                                                @click="removeClass(cls)"
                                            >x</div>
                                        </div>
                                    </div>

                                    <div
                                        v-for="(cls, i) in addedClasses"
                                        :key="i"
                                        class="gcl-list-item"
                                    >
                                        <div>{{ cls }}</div>
                                        <div
                                            class="actions cursor-pointer"
                                            @click="removeAddedClass(i)"
                                        >x</div>
                                    </div>
                                </div>

                                <div class="gcl-input-container">
                                    <input
                                        type="text"
                                        v-model="addClassName"
                                        placeholder="Ajouter une classe..."
                                        @keydown.enter="addClass"
                                    >
                                    <button class="cursor-pointer" @click="addClass">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { HollowDotsSpinner } from "epic-spinners";
import loadingBar from "../../../components/loading.vue";
import popperWithButton from "../../../components/popper-with-button.vue";
import api from "../../../api";

export default {
    props: ["schedule", "groupId"],

    components: {
        HollowDotsSpinner,
        loadingBar,
        popperWithButton
    },

    data() {
        return {
            loading: false,
            saving: false,
            group: {
                name: null
            },
            classes: [],
            addedClasses: [],
            addClassName: null
        };
    },

    mounted() {
        this.loadGroup();
    },

    methods: {
        close() {
            this.$emit("closed");
        },

        async loadGroup() {
            this.loading = true;

            let res = await api.getClassGroup(this.groupId);

            if (res.status === 200) {
                this.group = res.data.group;
                this.classes = res.data.classes;
            } else {
                console.error("Error: ", res.error);
            }

            this.loading = false;
        },

        async save() {
            this.saving = true;

            // Get classes again, sync changes
            let res = await api.getClassGroup(this.groupId);

            // Save classes
            await (async () => {
                if (res.status !== 200) {
                    console.error("Error:", res.error);
                    return;
                }

                let deletedClasses = res.data.classes.filter(
                    c => this.classes.findIndex(d => d.id == c.id) === -1
                );

                res = await Promise.all([
                    ...deletedClasses.map(async cls => {
                        return api.deleteClass(cls.id);
                    }),
                    ...this.addedClasses.map(async cls => {
                        return api.createClass(this.schedule.id, {
                            name: cls,
                            group_id: this.group.id
                        });
                    })
                ]);
            })();

            // Update group
            res = await api.updateClassGroup(this.group);

            if (res.status !== 200) {
                console.error("Error:", res.error);
            }

            this.$emit("saved");

            this.saving = false;
        },

        // Pressing "Effacer" inside popper submenu
        async _delete() {
            this.saving = true;

            let res = await api.deleteClassGroup(this.groupId);

            if (res.status === 200) {
                this.$emit("deleted", this.group);
                this.close();
            }

            this.saving = false;
        },

        addClass() {
            if (!this.addClassName) {
                return;
            }

            this.addedClasses.push(this.addClassName + "");
            this.addClassName = "";
        },

        removeClass(cls) {
            this.$set(
                this,
                "classes",
                this.classes.filter(c => c.id !== cls.id)
            );
        },

        removeAddedClass(i) {
            this.addedClasses.splice(i, 1);
        }
    }
};
</script>
