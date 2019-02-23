<template>
    <PopperButton ref="popper" @show="opened" :disabled="disabled" :width="300">
        <template slot="button-text">
            <i class="fas fa-plus"></i>&nbsp; Matière
        </template>
        <template slot="popper-content">
            <div class="p-2">
                <input
                    type="text"
                    v-model="name"
                    v-validate="'required'"
                    data-vv-as="Nom"
                    placeholder="Nom de la matière"
                    ref="input"
                    class="form-control"
                    name="exam_name"
                    @keydown.enter="m_saver_save"
                >
                <span class="d-block text-left">{{ errors.first('exam_name') }}</span>

                <input
                    type="number"
                    v-model="length"
                    v-validate="'required|integer|included:2,4'"
                    data-vv-as="Nombre d'heures"
                    placeholder="Nombre d'heures"
                    class="form-control mt-2"
                    name="exam_length"
                    @keydown.enter="m_saver_save"
                >
                <span class="d-block text-left">{{ errors.first('exam_length') }}</span>

                <button
                    v-if="!m_saver_saving && !errors.any()"
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
            name: '',
            length: 4
        }
    },

    methods: {
        async m_saver_saver() {
            if (
                !this.name ||
                !this.length ||
                ![2, 4].includes(parseInt(this.length))
            ) {
                return
            }

            const resource = await api.post(
                '/exams',
                {},
                {
                    name: this.name,
                    length: this.length || 4,
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
