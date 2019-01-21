<template>
    <panel>
        <template slot="sidebar">
            <h2>
                <wbr>
            </h2>

            <div class="sidebar-link-list">
                <a href>Résumé</a>
                <a href>Solutions</a>
                <a href>Examens</a>
                <a href>Profs</a>
                <a href>Classes</a>
                <a href>Contraintes</a>
                <a href>Paramètres</a>
            </div>
        </template>

        <template slot="content">
            <router-view></router-view>
        </template>
    </panel>
</template>

<script>
import panel from "../../panel.vue";

export default {
    components: {
        panel
    },

    methods: {
        pushRouterState(location) {
            this.$router.push(location);
        }
    }
};
</script>
