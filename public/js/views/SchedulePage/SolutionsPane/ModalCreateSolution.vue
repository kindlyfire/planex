<template>
    <Modal>
        <template slot="header">
            <h3 class="mb-0">Créer une solution</h3>

            <button class="btn ml-auto cursor-pointer" @click="close">Fermer</button>
        </template>

        <div class="p-3">
            <p>Appuiez sur le bouton "Lancer" ci-dessous pour créer une solution. Il ne sera pas possible de créer une nouvelle solution tant que celle-ci est en cours.</p>

            <div class="text-center">
                <PrimaryButton @click="launch" :disabled="disabled">Lancer</PrimaryButton>
            </div>
        </div>
    </Modal>
</template>

<script>
import api from '&/utils/api'

import Modal from '&/components/Modal'

export default {
    props: ['schedule'],

    components: {
        Modal
    },

    data() {
        return {
            disabled: false
        }
    },

    methods: {
        close() {
            this.$emit('closed')
        },

        // Send request to start solving
        async launch() {
            this.disabled = true
            this.$root.$emit('loader_push')

            await Promise.all([
                api.post('/actions/start_solver', {
                    schedule_id: this.schedule.id
                }),
                new Promise((resolve) => setTimeout(resolve, 1000))
            ])

            this.$root.$emit('loader_pop')
            this.close()
        }
    }
}
</script>
