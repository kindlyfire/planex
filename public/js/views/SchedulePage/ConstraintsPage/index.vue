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
                        <component :is="mapTypeToComp[constraint.type]" :constraint="constraint"></component>
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

import CapLine from './table-lines/CapLine'
import PositionLine from './table-lines/PositionLine'
import SyncLine from './table-lines/SyncLine'

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

            mapTypeToComp: {
                capacity: CapLine,
                position: PositionLine,
                sync: SyncLine
            }
        }
    },

    methods: {
        async m_loader_loader() {
            this.constraints = await api.get('/constraints', {
                schedule_id: this.schedule.id,
                $include: [
                    'teachers',
                    'exam-instances',
                    'exam-instances.exams',
                    'exam-instances.class-groups'
                ].join(','),
                $order: 'type'
            })
        }
    }
}
</script>

<style scoped>
</style>
