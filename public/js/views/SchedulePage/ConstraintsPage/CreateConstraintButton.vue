<template>
    <PopperButton ref="popper">
        <template slot="button-text">Ajouter</template>

        <div class="p-2" style="min-width: 260px">
            <VSelect
                :options="constraintTypes"
                label="label"
                v-model="selectedConstraint"
                :allow-empty="false"
                placeholder="Type de contrainte"
                select-label
            ></VSelect>

            <AppButton
                type="primary"
                :disabled="m_saver_saving"
                @click="m_saver_save"
                class="w-100 mt-2"
            >Ajouter</AppButton>
        </div>
    </PopperButton>
</template>

<script>
import api from '&/utils/api'
import saver from '&/mixins/saver'

import PopperButton from '&/components/PopperButton'

import VSelect from 'vue-multiselect'

export default {
    mixins: [saver],
    props: {
        schedule: Object
    },

    components: {
        PopperButton,
        VSelect
    },

    data() {
        return {
            constraintTypes: [
                {
                    type: 'sync',
                    label: 'Synchronisation'
                },
                {
                    type: 'position',
                    label: 'Position'
                },
                {
                    type: 'capacity',
                    label: 'Capacité'
                }
            ],
            selectedConstraint: null
        }
    },

    methods: {
        async m_saver_saver() {
            if (!this.selectedConstraint) {
                return
            }

            let constraint = await api.post(
                '/constraints',
                {},
                {
                    schedule_id: this.schedule.id,
                    type: this.selectedConstraint.type
                }
            )

            this.$refs.popper.doClose()
            this.$emit('saved', constraint)
        }
    }
}
</script>
