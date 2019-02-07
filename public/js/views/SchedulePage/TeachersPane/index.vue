<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Professeurs</h2>

            <AdvancedTable
                :items="teachers"
                :columns="columns"
                :actionable="true"
                @click="onItemClick"
                v-if="!m_loader_loading"
            >
                <template slot="header">
                    <div class="p-3 pl-4 pr-4 d-flex align-items-center">
                        <h3
                            class="font-weight-normal mb-0"
                        >{{ teachers.length }} professeur{{ teachers.length !== 1 ? 's' : '' }} enregistré{{ teachers.length !== 1 ? 's' : '' }}</h3>

                        <button class="btn btn-secondary ml-auto" @click="addTeacher">Ajouter</button>
                    </div>
                </template>
            </AdvancedTable>

            <ModalEditorTeacher
                v-if="editingTeacherId !== null"
                :teacher-id="editingTeacherId"
                :schedule="schedule"
                @closed="editingTeacherId = null"
                @saved="(t) => { editingTeacherId = t.id; m_loader_load() }"
                @deleted="m_loader_load"
            ></ModalEditorTeacher>
        </div>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import LoadingBar from '&/components/LoadingBar'
import AdvancedTable from '&/components/AdvancedTable'

import ModalEditorTeacher from './ModalEditorTeacher'

export default {
    mixins: [loader],
    props: ['schedule'],

    components: {
        LoadingBar,
        AdvancedTable,

        ModalEditorTeacher
    },

    data() {
        return {
            editingTeacherId: null,
            teachers: [],
            columns: [
                {
                    label: 'Nom',
                    width: '30%',
                    key: 'name'
                },
                {
                    label: 'Email',
                    width: '30%',
                    key: 'email'
                },
                {
                    label: 'Taille',
                    width: '20%',
                    key: 'size'
                }
            ]
        }
    },

    methods: {
        onItemClick(e) {
            this.editingTeacherId = e.id
        },

        async m_loader_loader() {
            this.teachers = await api.get('/teachers', {
                schedule_id: this.schedule.id,
                $order: 'name'
            })
        },

        addTeacher() {
            this.editingTeacherId = -1
        }
    }
}
</script>
