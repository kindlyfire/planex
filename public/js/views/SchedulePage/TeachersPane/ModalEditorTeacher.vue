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
    </Modal>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'
import saver from '&/mixins/saver'

import Modal from '&/components/Modal'
import LoadingBar from '&/components/LoadingBar'
import PopperButton from '&/components/PopperButton'

export default {
    mixins: [loader, saver],
    props: ['teacherId', 'schedule'],

    components: {
        Modal,
        LoadingBar,
        PopperButton
    },

    data() {
        return {
            teacher: {
                id: null,
                name: '',
                email: '',
                size: 1,
                schedule_id: this.schedule.id
            }
        }
    },

    methods: {
        close() {
            // Parent removes this component to close it
            this.$emit('closed')
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

            this.$emit('saved')
        },

        async m_loader_loader() {
            if (this.teacherId === -1) {
                return
            }

            this.teacher = await api.get('/teacher/' + this.teacherId)
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
