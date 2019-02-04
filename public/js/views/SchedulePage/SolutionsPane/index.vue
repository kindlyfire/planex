<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2 class="d-flex flex-row">
                <div>Solutions</div>
                <div class="ml-auto">
                    <button class="btn btn-secondary" @click="showCreator = true">Créer</button>
                </div>
            </h2>

            <div v-if="lastSolution" class="last-solution">
                <h3 class="font-weight-normal mb-0">Last solution</h3>
            </div>
            <div v-else class="last-solution">
                <h3 class="font-weight-normal">Pas de solutions</h3>
                <p
                    class="mb-0"
                >Veuillez créer une solution en utilisant le bouton "Créer" ci-dessus à droite.</p>
            </div>
        </div>

        <ModalCreateSolution v-if="showCreator" :schedule="schedule"></ModalCreateSolution>
    </div>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import ModalCreateSolution from './ModalCreateSolution'

export default {
    mixins: [loader],
    props: ['schedule'],

    components: {
        ModalCreateSolution
    },

    data() {
        return {
            showCreator: false,

            lastSolution: null,
            favoritedSolutions: []
        }
    },

    methods: {
        async m_loader_loader() {
            let solutions = await api.get('/solutions', {
                schedule_id: this.schedule.id,
                $order: 'created_at'
            })

            if (solutions && solutions.length > 0) {
                this.lastSolution = solutions[0]
                this.favoritedSolutions = solutions.slice(1)
            }
        }
    }
}
</script>

<style scoped>
.last-solution {
    background-color: white;
    /* border: 1px solid rgba(black, 0.15); */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    padding: 10px 15px;
    border-radius: 5px;
}

.solution-title {
    font-size: 2em;
}
</style>
