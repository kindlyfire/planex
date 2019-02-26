<template>
    <AppModal>
        <template slot="header">
            <h3
                class="mb-0"
            >Contrainte {{ this.constraint.type ? 'de '+ mapTypeToName[this.constraint.type].toLowerCase() : '' }}</h3>

            <div class="ml-auto">
                <PopperButton v-if="!m_loader_loading && constraintId !== -1">
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
            >{{ constraintId === -1 ? 'Ajouter' : 'Sauvegarder' }}</PrimaryButton>
        </template>

        <component
            v-if="!m_loader_loading"
            :is="activeComponent"
            :constraint="constraint"
            :json-data="jsonData"
            :schedule="schedule"
        ></component>
    </AppModal>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'
import saver from '&/mixins/saver'

import PopperButton from '&/components/PopperButton'
import AppModal from '&/components/Modal'

import PositionConstraint from './Constraints/PositionConstraint'
import SyncConstraint from './Constraints/SyncConstraint'
import CapacityConstraint from './Constraints/CapacityConstraint'

const compByType = {
    position: PositionConstraint,
    sync: SyncConstraint,
    capacity: CapacityConstraint
}

export default {
    mixins: [loader, saver],
    props: ['schedule', 'constraintId'],

    components: {
        AppModal,
        PopperButton
    },

    data() {
        return {
            constraint: {},

            mapTypeToName: {
                position: 'Position',
                capacity: 'Capacité',
                sync: 'Synchronisation'
            },

            jsonData: {}
        }
    },

    computed: {
        activeComponent() {
            return this.constraint.type
                ? compByType[this.constraint.type]
                : null
        }
    },

    watch: {
        // constraint: {
        //     deep: true,
        //     handler(v) {
        //         console.log('Constraint update', JSON.parse(JSON.stringify(v)))
        //     }
        // },

        jsonData: {
            deep: true,
            handler(v) {
                this.constraint.data_json = JSON.stringify(v)
            }
        }
    },

    methods: {
        close() {
            this.$emit('closed')
        },

        async _delete() {
            this.$root.$emit('loader_push')

            await api.delete('/constraint/' + this.constraintId)
            this.close()

            this.$root.$emit('loader_pop')
        },

        async m_loader_loader() {
            this.constraint = await api.get(
                '/constraint/' + this.constraintId,
                {
                    $include: [
                        'teachers',
                        'exam-instances',
                        'exam-instances.exams',
                        'exam-instances.class-groups',

                        // There's another way to do it
                        'exam-instances.exams.exam-instances',
                        'exam-instances.exams.exam-instances.class-groups'
                    ].join(',')
                }
            )

            try {
                this.jsonData = JSON.parse(this.constraint.data_json || '{}')
            } catch (e) {
                this.jsonData = {}
            }
        },

        async m_saver_saver() {
            await api.put(
                '/constraint/' + this.constraint.id,
                {},
                this.constraint
            )
            this.close()
        }
    }
}
</script>
