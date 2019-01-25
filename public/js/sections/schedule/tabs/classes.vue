<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Classes</h2>

            <loading v-if="loading" padding="5"></loading>

            <div v-else class="advanced-table">
                <div class="advanced-table-header with-bottom-shadow">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ groups.length }} groupe{{ groups.length !== 1 ? 's' : '' }}, {{ classes.length }} classe{{ classes.length !== 1 ? 's' : '' }}</h3>

                        <div class="ml-auto">
                            <add-group-button :schedule="schedule" @saved="groupAdded"/>
                        </div>
                    </div>
                </div>

                <div class="advanced-table-content">
                    <div
                        v-for="(group, i) in groups"
                        :key="i"
                        @click="editingGroupId = group.id"
                        class="advanced-table-content-line with-border-between actionable"
                    >
                        <div class="advanced-table-content-cell no-border">{{ group.name }}</div>
                        <div
                            class="advanced-table-content-cell ml-auto text-right text-color-primary"
                        >
                            <span
                                v-for="(cls, i) in groupClasses[group.id]"
                                :key="i"
                                class="badge badge-secondary ml-1"
                            >{{ cls.name }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <group-editor-modal
                v-if="editingGroupId !== null"
                :groupId="editingGroupId"
                :schedule="schedule"
                @closed="editingGroupId = null"
                @saved="groupSaved"
                @deleted="groupDeleted"
            ></group-editor-modal>
        </div>
    </div>
</template>

<script>
import addGroupButton from "../modals/add-group-button.vue";
import groupEditorModal from "../modals/group-editor-modal.vue";
import loading from "../../../components/loading.vue";
import api from "../../../api";

export default {
    props: ["schedule"],

    components: {
        loading,
        addGroupButton,
        groupEditorModal
    },

    data() {
        return {
            loading: false,
            groups: [],
            classes: [],
            editingGroupId: null
        };
    },

    async created() {
        this.loading = true;

        await Promise.all([this.loadClassGroups(), this.loadClasses()]);

        this.loading = false;
    },

    computed: {
        groupClasses() {
            let groupClasses = {};

            for (let cls of this.classes) {
                if (groupClasses[cls.group_id] === undefined) {
                    groupClasses[cls.group_id] = [cls];
                } else {
                    groupClasses[cls.group_id].push(cls);
                }
            }

            return groupClasses;
        }
    },

    methods: {
        async loadClassGroups() {
            let res = await api.getScheduleClassGroups(this.schedule.id);

            if (res.status === 200) {
                this.$set(this, "groups", res.data);
            } else {
                console.error("Error:", res.error);
            }
        },

        async loadClasses() {
            let res = await api.getScheduleClasses(this.schedule.id);

            if (res.status === 200) {
                this.$set(this, "classes", res.data);
            } else {
                console.error("Error:", res.error);
            }
        },

        groupAdded(group) {
            this.groups.push(group);
        },

        groupDeleted(group) {
            this.$set(
                this,
                "groups",
                this.groups.filter(g => g.id !== group.id)
            );
        },

        groupSaved() {
            this.loadClassGroups();
            this.loadClasses();
        }
    }
};
</script>
