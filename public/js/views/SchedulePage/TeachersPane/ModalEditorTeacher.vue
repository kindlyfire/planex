<template>
    <Modal>
        <template slot="header">
            <h3 class="mb-0">{{ teacherId === -1 ? 'Ajouter un professeur' : 'Détails' }}</h3>

            <div class="ml-auto">
                <PopperButton v-if="!m_loader_loading && teacherId !== -1">
                    <template slot="button-text">+</template>
                    <template slot="popper-content">
                        <button
                            v-if="!m_saver_saving"
                            class="btn btn-danger cursor-pointer m-1"
                            style="min-width: 150px"
                            @click="_delete"
                        >Effacer</button>
                        <button v-else class="btn m-1" style="min-width: 150px">Effacer</button>
                    </template>
                </PopperButton>
            </div>

            <button class="btn ml-2 cursor-pointer" @click="close">Fermer</button>

            <PrimaryButton
                :disabled="m_loader_loading || m_saver_saving"
                class-name="ml-2"
                @click="m_saver_save"
            >{{ teacherId === -1 ? 'Ajouter' : 'Sauvegarder' }}</PrimaryButton>
        </template>

        <LoadingBar padding="5" v-if="m_loader_loading"></LoadingBar>

        <div v-else>
            <div class="d-flex flex-row">
                <div style="width: 60%; border-right: 1px solid rgba(0, 0, 0, 0.15)" class="p-3">
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
                    </div>

                    <p class="mb-0">
                        <a
                            href
                            @click.prevent="showAvailabilityEditor = true"
                        >Éditer les disponibilités</a>
                    </p>

                    <p class="mb-0">
                        <a href @click.prevent="() => {}">Éditer les contraintes de capacité</a>
                    </p>
                </div>
                <div style="width: 40%;" class="text-muted">
                    <template v-if="teacher['exam-instances'].length === 0">
                        <div class="p-3">Ce professeur ne donne actuellement pas d'examens</div>
                    </template>
                    <template v-else>
                        <p class="m-2 mb-0">Examens:</p>
                        <div class="simple-list simple-list-hover">
                            <div
                                v-for="(inst, i) in teacher['exam-instances']"
                                :key="i"
                                class="list-item d-flex align-items-center"
                            >
                                <div>{{ inst.exam.name }}</div>
                                <div class="ml-auto" v-if="inst['class-group']">
                                    <span
                                        class="badge badge-secondary"
                                    >{{ inst['class-group'].name }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <ModalEditorAvailability
            v-if="showAvailabilityEditor"
            :schedule="schedule"
            :columns="availabilityData"
            @closed="showAvailabilityEditor = false"
            @input="availabilitySaved"
        ></ModalEditorAvailability>
    </Modal>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'
import saver from '&/mixins/saver'

import Modal from '&/components/Modal'
import LoadingBar from '&/components/LoadingBar'
import PopperButton from '&/components/PopperButton'
import ModalEditorAvailability from '&/components/ModalEditorAvailability'

export default {
    mixins: [loader, saver],
    props: ['teacherId', 'schedule'],

    components: {
        Modal,
        LoadingBar,
        PopperButton,
        ModalEditorAvailability
    },

    data() {
        return {
            teacher: {
                id: null,
                name: '',
                email: '',
                size: 1,
                schedule_id: this.schedule.id,
                availability_json: '[]'
            },

            showAvailabilityEditor: false
        }
    },

    computed: {
        availabilityData() {
            return JSON.parse(this.teacher.availability_json)
        }
    },

    methods: {
        close() {
            // Parent removes this component to close it
            this.$emit('closed')
        },

        availabilitySaved(v) {
            this.teacher.availability_json = JSON.stringify(v)
        },

        async m_saver_saver() {
            if (this.teacherId === -1) {
                this.teacher = await api.post('/teachers', {}, this.teacher)
            } else {
                this.teacher = await api.put(
                    '/teacher/' + this.teacher.id,
                    {},
                    this.teacher
                )
            }

            this.$emit('saved', this.teacher)
        },

        async m_loader_loader() {
            if (this.teacherId === -1) {
                return
            }

            this.teacher = await api.get('/teacher/' + this.teacherId, {
                $include: [
                    'exam-instances',
                    'exam-instances.exams',
                    'exam-instances.class-groups'
                ].join(',')
            })
        },

        async _delete() {
            try {
                await api.delete('/teacher/' + this.teacherId)

                this.$emit('deleted')
                this.close()
            } catch (e) {}
        }
    }
}
</script>
