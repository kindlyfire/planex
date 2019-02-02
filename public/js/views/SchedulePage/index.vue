<template>
    <ThePanel>
        <template slot="sidebar">
            <h2>
                <wbr>
            </h2>

            <div class="sidebar-link-list" v-if="!m_loader_loading">
                <a
                    v-for="(child, i) in children"
                    :key="i"
                    @click.prevent="changeTab(child.path)"
                    href
                >{{ child.name }}</a>

                <!-- <a href @click.prevent="changeTab('')">Résumé (~)</a>
                <a href @click.prevent="changeTab('solutions')">Solutions</a>
                <a href @click.prevent="changeTab('exams')">Examens (fait)</a>
                <a href @click.prevent="changeTab('teachers')">Profs (fait)</a>
                <a href @click.prevent="changeTab('classes')">Classes (fait)</a>
                <a href @click.prevent="changeTab('courses')">Cours</a>
                <a href @click.prevent="changeTab('constraints')">Contraintes</a>
                <a href @click.prevent="changeTab('settings')">Paramètres</a>-->
            </div>
        </template>

        <template slot="header">
            <div class="main-layout-content-center">
                <span class="text-muted">
                    <span v-if="m_loader_loading">
                        <i>Chargement...</i>
                    </span>
                    
                    <span v-else>{{ schedule.name }}</span>
                </span>
            </div>
        </template>

        <RouterView v-if="!m_loader_loading" :schedule="schedule"></RouterView>
    </ThePanel>
</template>

<script>
import api from '&/utils/api'
import loader from '&/mixins/loader'

import ThePanel from '&/components/ThePanel'

// Import and re-export child panes
import children from './children'
export { children }

export default {
    mixins: [loader],

    components: {
        ThePanel
    },

    data() {
        return {
            schedule: {},
            children
        }
    },

    methods: {
        async m_loader_loader() {
            this.schedule = await api.get('/schedule/' + this.$route.params.id)

            if (!this.schedule) {
                this.$router.push('/')
            }
        },

        changeTab(name) {
            this.$router.push('/schedule/' + this.$route.params.id + '/' + name)
        }
    }
}
</script>
