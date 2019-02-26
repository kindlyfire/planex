<template>
    <div class="advanced-table-content-line with-border-between w-100">
        <div style="width: 30%" class="advanced-table-content-cell no-border">Synchronisation</div>
        <div class="advanced-table-content-cell no-border text-muted">{{ resourcesRepr }}</div>
    </div>
</template>

<script>
import loader from '&/mixins/loader'
import api from '&/utils/api'

export default {
    mixins: [loader],
    props: ['constraint'],

    data() {
        return {
            examInstances: []
        }
    },

    methods: {
        async m_loader_loader() {
            try {
                let json = JSON.parse(this.constraint.data_json)

                this.examInstances = await Promise.all([
                    json.selectedInstance1
                        ? api.get('/exam-instance/' + json.selectedInstance1, {
                              $include: 'exams,class-groups'
                          })
                        : null,
                    json.selectedInstance2
                        ? api.get('/exam-instance/' + json.selectedInstance2, {
                              $include: 'exams,class-groups'
                          })
                        : null
                ])
                this.examInstances = this.examInstances.filter((r) => !!r)
            } catch (e) {}
        }
    },

    computed: {
        resourcesRepr() {
            return this.examInstances
                .map((ei) => `${ei['class-group'].name} (${ei.exam.name})`)
                .join(', ')
        }
    }
}
</script>
