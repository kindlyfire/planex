<template>
    <div class="advanced-table-content-line with-border-between w-100">
        <div style="width: 30%" class="advanced-table-content-cell no-border">Capacité</div>
        <div
            class="advanced-table-content-cell no-border text-muted"
        >{{ resources.map(r => r.name).join(', ') }}</div>
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
            resources: []
        }
    },

    methods: {
        async m_loader_loader() {
            try {
                let json = JSON.parse(this.constraint.data_json)

                this.resources = await Promise.all([
                    api.get('/teacher/' + json.teacherId),

                    ...(json.groups || []).map((g) => {
                        return api.get('/class-group/' + g)
                    })
                ])
                this.resources = this.resources.filter((r) => !!r)
            } catch (e) {}
        }
    }
}
</script>
