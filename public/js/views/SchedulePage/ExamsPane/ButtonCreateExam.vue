<template>
    <PopperButton ref="popper" @show="opened" :disabled="disabled">
        <template slot="button-text">
            <i class="fas fa-plus"></i>&nbsp; Matière
        </template>
        <template slot="popper-content">
            <div class="p-2">
                <input
                    type="text"
                    v-model="name"
                    placeholder="Nom de la matière"
                    ref="input"
                    class="form-control"
                    @keydown.enter="m_saver_save"
                >

                <button
                    v-if="!m_saver_saving"
                    @click="m_saver_save"
                    class="btn btn-primary d-block w-100 mt-2"
                >Enregistrer</button>
                <button v-else class="btn btn-secondary d-block w-100 mt-2">Enregistrer</button>
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
    props: ['schedule', 'disabled'],

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

            const resource = await api.post(
                '/exams',
                {},
                {
                    name: this.name,
                    length: 4,
                    schedule_id: this.schedule.id
                }
            )

            this.$refs.popper.doClose()
            this.$emit('saved', resource)

            this.$nextTick(() => {
                this.name = ''
            })
        },

        opened() {
            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        }
    }
}
</script>
