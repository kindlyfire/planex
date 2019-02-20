<template>
    <div class="main-layout-content-center">
        <div class="pl-2 pr-2">
            <h2>Résumé</h2>

            <div class="row pt-2">
                <div class="col-md-6">
                    <h5>Statistiques</h5>

                    <div class="card">
                        <div class="card-body">
                            <template v-if="!stats">Chargement...</template>
                            <template v-else>
                                <div class="d-flex">
                                    <div>Professeurs</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.teachers }}</span>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <div>Groupes</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.classGroups }}</span>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <div>Classes</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.classes }}</span>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <div>Contraintes</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.constraints }}</span>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <div>Matières</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.exams }}</span>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <div>Examens</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.examInstances }}</span>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <div>Solutions</div>
                                    <div class="ml-auto">
                                        <span class="badge badge-primary">{{ stats.solutions }}</span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <h5>Dernière solution</h5>

                    <div class="card">
                        <div class="card-body">
                            <template v-if="!lastSolution">Il n'y a pas encore de solutions</template>
                            <template v-else>
                                <p class="m-0">{{ lastSolution.name }}</p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loader from '&/mixins/loader'
import api from '&/utils/api'

export default {
    mixins: [loader],

    props: ['schedule'],

    data() {
        return {
            lastSolution: null,
            stats: null
        }
    },

    methods: {
        async m_loader_loader() {
            // Load last solution
            let res = await api.get('/solutions', {
                schedule_id: this.schedule.id,
                $order: 'created_at:DESC',
                $limit: 1
            })

            if (res.length > 0) {
                this.lastSolution = res[0]
            }

            // Load stats
            this.stats = await api.get('/actions/stats', {
                schedule_id: this.schedule.id
            })
        }
    }
}
</script>
