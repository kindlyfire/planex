<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2 class="d-flex flex-row">Contraintes</h2>

            <div class="advanced-table">
                <div class="advanced-table-header with-bottom-shadow">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ constraints.length }} contrainte{{ constraints.length !== 1 ? 's' : '' }}</h3>

                        <div class="ml-auto">
                            <CreateConstraintButton
                                :schedule="schedule"
                                @saved="(c) => { editorConstraintId = c.id; m_loader_load() }"
                            ></CreateConstraintButton>
                        </div>
                    </div>
                </div>

                <div class="advanced-table-content">
                    <div
                        v-for="(constraint, i) in constraints"
                        :key="i"
                        @click="editorConstraintId = constraint.id"
                        class="advanced-table-content-line with-border-between actionable"
                    >
                        <div
                            class="advanced-table-content-cell no-border"
                        >{{ mapTypeToName[constraint.type] }}</div>
                    </div>

                    <div v-if="constraints.length === 0" class="advanced-table-content-line">
                        <div class="advanced-table-content-cell no-border">
                            <i v-if="m_loader_loading">Chargement...</i>
                            <span v-else>Pas de contraintes à afficher.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalEditorConstraint
            v-if="editorConstraintId !== null"
            :constraint-id="editorConstraintId"
            :schedule="schedule"
            @closed="() => { editorConstraintId = null; m_loader_load() }"
        ></ModalEditorConstraint>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import ModalEditorConstraint from './ModalEditorConstraint'
import CreateConstraintButton from './CreateConstraintButton'

export default {
    mixins: [loader],
    props: ['schedule'],

    components: {
        ModalEditorConstraint,
        CreateConstraintButton
    },

    data() {
        return {
            editorConstraintId: null,

            constraints: [],

            mapTypeToName: {
                position: 'Position',
                capacity: 'Capacité',
                sync: 'Synchronisation'
            }
        }
    },

    methods: {
        async m_loader_loader() {
            this.constraints = await api.get('/constraints', {
                schedule_id: this.schedule.id,
                $include: ['teachers', 'exam-instances'].join(','),
                $order: 'type'
            })
        }
    }
}
</script>

<style scoped>
</style>
