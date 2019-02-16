<template>
    <Modal>
        <template slot="header">
            <h3 class="mb-0">Examen</h3>

            <div class="ml-auto">
                <PopperButton v-if="!m_loader_loading">
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

            <button
                v-if="!m_saver_saving && !m_loader_loading"
                class="btn btn-primary cursor-pointer ml-2"
                @click="m_saver_save"
            >Sauvegarder</button>
            <button v-if="m_saver_saving && !m_loader_loading" class="btn ml-2">Sauvegarder</button>
        </template>

        <LoadingBar padding="5" v-if="m_loader_loading"></LoadingBar>

        <div v-else>
            <div class="p-3">
                <div class="form-group">
                    <label for="i_exameditor_name" class="mb-0">Nom</label>
                    <input
                        v-model="exam.name"
                        type="text"
                        class="form-control"
                        id="i_exameditor_name"
                    >
                </div>

                <div class="form-group">
                    <label for="i_exameditor_length" class="mb-0">Longueur</label>
                    <input
                        v-model="exam.length"
                        type="text"
                        class="form-control"
                        id="i_exameditor_length"
                    >
                </div>
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
    props: ['schedule', 'examId'],

    components: {
        Modal,
        LoadingBar,
        PopperButton
    },

    data() {
        return {
            exam: {}
        }
    },

    methods: {
        close() {
            this.$emit('closed')
        },

        async _delete() {
            // Should confirm obviously !
            // This resource is too much of a hassle to add again
            // @TODO

            this.saving = true
            try {
                await api.delete('/exam/' + this.examId)
                this.$emit('deleted', this.exam)
            } catch (e) {}
            this.saving = false
        },

        async m_loader_loader() {
            this.exam = await api.get('/exam/' + this.examId)
        },

        async m_saver_save() {
            await api.put('/exam/' + this.examId, {}, this.exam)
            this.$emit('saved')
            this.close()
        }
    }
}
</script>
