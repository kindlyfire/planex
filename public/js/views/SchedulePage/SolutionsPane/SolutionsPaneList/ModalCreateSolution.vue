<template>
    <Modal>
        <template slot="header">
            <h3 class="mb-0">Créer une solution</h3>

            <button class="btn ml-auto cursor-pointer" @click="close">Fermer</button>
        </template>

        <div class="p-3">
            <div
                v-if="precheck === null"
                class="alert alert-secondary"
                role="alert"
            >Recherche d'erreurs communes en cours...</div>
            <div
                v-else-if="precheck.length === 0"
                class="alert alert-success"
                role="alert"
            >Pas d'erreurs trouvées !</div>
            <div v-else class="alert alert-danger" role="alert">
                <div v-for="(err, i) in precheck" :key="i" class="mb-2">
                    <p v-html="err[0]" class="m-0"></p>
                    <small v-html="err[1]"></small>
                </div>
            </div>

            <p>Appuiez sur le bouton "Lancer" ci-dessous pour créer une solution. Il ne sera pas possible de créer une nouvelle solution tant que celle-ci est en cours.</p>

            <div class="text-center">
                <PrimaryButton @click="launch" :disabled="disabled">Lancer</PrimaryButton>
            </div>
        </div>
    </Modal>
</template>

<script>
import loader from '&/mixins/loader'
import api from '&/utils/api'

import Modal from '&/components/Modal'

export default {
    mixins: [loader],
    props: ['schedule'],

    components: {
        Modal
    },

    data() {
        return {
            disabled: false,

            precheck: null
        }
    },

    methods: {
        close() {
            this.$emit('closed')
        },

        async m_loader_loader() {
            this.precheck = await api.get('/actions/precheck', {
                schedule_id: this.schedule.id
            })
        },

        // Send request to start solving
        async launch() {
            this.disabled = true
            this.$root.$emit('loader_push')

            await Promise.all([
                api.post('/actions/start_solver', {
                    schedule_id: this.schedule.id
                }),

                // Make request at least 1s long
                // Makes it feel better ?
                new Promise((resolve) => setTimeout(resolve, 1000))
            ])

            this.$root.$emit('loader_pop')
            this.close()
        }
    }
}
</script>
