<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Classes</h2>

            <div class="advanced-table">
                <div class="advanced-table-header with-bottom-shadow">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ groups.length }} groupe{{ groups.length !== 1 ? 's' : '' }}, {{ classes.length }} classe{{ classes.length !== 1 ? 's' : '' }}</h3>

                        <div class="ml-auto">
                            <ButtonCreateGroup :schedule="schedule" @saved="m_loader_loader"></ButtonCreateGroup>
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
                    <div
                        v-if="m_loader_loading && groups.length === 0"
                        class="advanced-table-content-line"
                    >
                        <div class="advanced-table-content-cell no-border">
                            <i>Chargement...</i>
                        </div>
                    </div>
                </div>
            </div>

            <ModalEditorGroup
                v-if="editingGroupId !== null"
                :group-id="editingGroupId"
                :schedule="schedule"
                @closed="editingGroupId = null"
                @saved="(group) => { editingGroupId = group.id; m_loader_load() }"
                @deleted="m_loader_load"
            ></ModalEditorGroup>
        </div>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'
import saver from '&/mixins/saver'

import ButtonCreateGroup from './ButtonCreateGroup'
import ModalEditorGroup from './ModalEditorGroup'

export default {
    mixins: [loader],
    props: ['schedule'],

    components: {
        ButtonCreateGroup,
        ModalEditorGroup
    },

    data() {
        return {
            groups: [],
            classes: [],
            editingGroupId: null
        }
    },

    computed: {
        groupClasses() {
            let groupClasses = {}

            for (let cls of this.classes) {
                if (groupClasses[cls.group_id] === undefined) {
                    groupClasses[cls.group_id] = [cls]
                } else {
                    groupClasses[cls.group_id].push(cls)
                }
            }

            return groupClasses
        }
    },

    methods: {
        async m_loader_loader() {
            // @TODO: Could be converted to using associations in the API
            //        We wouldn't need the computed groupClasses anymore
            let res = await Promise.all([
                await api.get('/class-groups', {
                    schedule_id: this.schedule.id
                }),
                await api.get('/classes', {
                    schedule_id: this.schedule.id,
                    $order: 'name'
                })
            ])

            this.groups = res[0]
            this.classes = res[1]
        }
    }
}
</script>
