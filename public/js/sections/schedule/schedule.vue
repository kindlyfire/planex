<template>
    <panel>
        <template slot="sidebar">
            <h2>
                <wbr>
            </h2>

            <div class="sidebar-link-list" v-if="!loading">
                <a href @click.prevent="changeTab('')">Résumé</a>
                <a href @click.prevent="changeTab('solutions')">Solutions</a>
                <a href @click.prevent="changeTab('exams')">Examens</a>
                <a href @click.prevent="changeTab('teachers')">Profs</a>
                <a href @click.prevent="changeTab('classes')">Classes</a>
                <a href @click.prevent="changeTab('constraints')">Contraintes</a>
                <a href @click.prevent="changeTab('settings')">Paramètres</a>
            </div>
        </template>

        <template slot="header">
            <div class="main-layout-content-center">
                <span class="text-muted">
                    <hollow-dots-spinner
                        v-if="loading"
                        :animation-duration="1000"
                        :dot-size="8"
                        :dots-num="3"
                        color="inherit"
                    />

                    <span v-if="!loading">{{ schedule.name }}</span>
                </span>
            </div>
        </template>

        <template slot="content">
            <router-view v-if="!loading" :schedule="schedule"></router-view>
        </template>
    </panel>
</template>

<script>
import { HollowDotsSpinner } from "epic-spinners";

import api from "../../api";
import panel from "../../panel.vue";

export default {
    components: {
        panel,
        HollowDotsSpinner
    },

    data() {
        return {
            loading: true,
            schedule: {}
        };
    },

    async created() {
        let res = await api.getSchedule(this.$route.params.id);

        if (res.status !== 200) {
            this.pushRouterState("/");
            return;
        }

        this.schedule = res.data;
        this.loading = false;
    },

    methods: {
        pushRouterState(location) {
            this.$router.push(location);
        },

        changeTab(name) {
            this.pushRouterState(
                "/schedule/" + this.$route.params.id + "/" + name
            );
        }
    }
};
</script>
