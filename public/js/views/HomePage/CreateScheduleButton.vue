<template>
    <PopperButton ref="popper">
        <template slot="button-text">Créer</template>
        <template slot="popper-content">
            <div class="p-2">
                <input
                    v-model="name"
                    class="form-control"
                    type="text"
                    placeholder="Nom de l'horaire"
                >

                <button
                    v-if="!m_saver_saving"
                    @click="m_saver_save"
                    class="btn btn-primary d-block w-100 mt-2"
                >Enregistrer</button>

                <button
                    v-else
                    class="btn btn-secondary d-block w-100 mt-2 d-flex justify-content-center align-items-center"
                >Sauvegarde...</button>
            </div>
        </template>
    </PopperButton>
</template>

<script>
import api from '&/utils/api'
import saver from '&/mixins/saver'

import PopperButton from '&/components/PopperButton'

export default {
    mixins: [saver],

    components: {
        PopperButton
    },

    data() {
        return {
            name: ''
        }
    },

    methods: {
        async m_saver_saver() {
            if (!this.name) {
                return
            }

            await api.post('/schedules', {}, { name: this.name })

            this.$refs.popper.doClose()
            this.$emit('saved')

            this.$nextTick(() => {
                this.name = ''
            })
        }
    }
}
</script>
