<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2 class="d-flex flex-row">
                <div>Solutions</div>
                <div class="ml-auto">
                    <button
                        class="btn btn-secondary"
                        @click="showCreator = true"
                        :disabled="lastSolution && lastSolution.status === 'running'"
                    >Créer</button>
                </div>
            </h2>

            <div
                v-if="lastSolution"
                :class="{ 'solution-is-running': lastSolution.status === 'running' }"
                class="last-solution p-3 pl-4 pr-4"
            >
                <div class="d-flex flex-row align-items-center">
                    <h3 class="font-weight-normal mb-0 mt-0">{{ lastSolution.name }}</h3>

                    <template v-if="lastSolution.status !== 'running'">
                        <div class="ml-auto">
                            <i
                                :class="{ 'favorite-mark-active': lastSolution.starred }"
                                class="fas fa-star favorite-mark cursor-pointer"
                                @click="toggleStarred(lastSolution)"
                            ></i>
                        </div>

                        <PrimaryButton
                            @click="$router.push(`/schedule/${schedule.id}/solutions/${lastSolution.id}`)"
                        >Inspecter</PrimaryButton>
                    </template>
                </div>

                <p
                    v-if="lastSolution.status === 'running'"
                    class="mb-0"
                >Cette solution est en cours de création</p>
            </div>
            <div v-else class="last-solution p-3 pl-4 pr-4">
                <h3 class="font-weight-normal">Pas de solutions</h3>
                <p
                    class="mb-0"
                >Veuillez créer une solution en utilisant le bouton "Créer" ci-dessus à droite.</p>
            </div>

            <div class="solutions-container mt-3">
                <div v-for="(sol, i) in favoritedSolutions" :key="i" class="solution">
                    <div class="d-flex flex-row align-items-center">
                        <span>{{ sol.name }}</span>

                        <div class="ml-auto">
                            <i
                                :class="{ 'favorite-mark-active': sol.starred }"
                                class="fas fa-star favorite-mark cursor-pointer"
                                @click="toggleStarred(sol)"
                            ></i>

                            <i
                                class="fas fa-angle-right cursor-pointer"
                                @click="$router.push(`/schedule/${schedule.id}/solutions/${sol.id}`)"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalCreateSolution
            v-if="showCreator"
            :schedule="schedule"
            @closed="() => { m_loader_load(); showCreator = false }"
        ></ModalCreateSolution>
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
        async toggleStarred(solution) {
            this.$root.$emit('loader_push')

            // Toggle between 0 and 1
            solution.starred = Math.abs(solution.starred - 1)

            await api.put('/solution/' + solution.id, {}, solution)

            this.$root.$emit('loader_pop')
        },

        async m_loader_loader() {
            let solutions = await api.get('/solutions', {
                schedule_id: this.schedule.id,
                $order: 'created_at:DESC'
            })

            if (solutions && solutions.length > 0) {
                this.lastSolution = solutions[0]
                this.favoritedSolutions = solutions.slice(1)
            }
        }
    }
}
</script>

<style lang='scss' scoped>
.last-solution {
    background-color: white;
    border: 1px solid transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    border-radius: 5px;

    &.solution-is-running {
        box-shadow: 0 2px 8px rgba(206, 145, 31, 0.25);
        border: 1px solid rgba(206, 145, 31, 0.25);
    }
}

.solution-title {
    font-size: 2em;
}

.solutions-container {
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    border-radius: 5px;

    .solution {
        padding: 10px 15px;

        &:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }

        &:last-child {
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }

        &:not(:last-child) {
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        &:hover {
            background-color: rgba(0, 0, 0, 0.01);
        }
    }
}

.favorite-mark {
    color: rgba(black, 0.2);
    display: inline-block;
    margin-right: 10px;

    &.favorite-mark-active {
        color: #ffd700;
    }
}
</style>
