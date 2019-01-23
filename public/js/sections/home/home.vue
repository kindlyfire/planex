<template>
    <panel>
        <template slot="content">
            <div class="main-layout-content-center">
                <div class="pl-2 pr-2">
                    <div class="d-flex flex-row align-items-end">
                        <h1>Horaires</h1>

                        <div class="ml-auto" style="margin-bottom: .5rem;">
                            <create-schedule @saved="loadSchedules"></create-schedule>
                        </div>
                    </div>

                    <template v-if="loading">
                        <loading padding="5"/>
                    </template>
                    <template v-else>
                        <div class="schedule-list">
                            <a
                                v-for="schedule in schedules"
                                :key="schedule.id"
                                href
                                class="schedule-list-item"
                                @click.prevent="pushRouterState('/schedule/' + schedule.id)"
                            >
                                <div class="schedule-list-item-title">{{ schedule.name }}</div>
                                <div
                                    class="schedule-list-item-description"
                                >Dernière modification le 21/01/2019 à 22:39</div>
                            </a>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </panel>
</template>

<script>
import panel from "../../panel.vue";
import api from "../../api";
import loading from "../../components/loading.vue";
import { setTimeout } from "timers";
import createSchedule from "./create-schedule.vue";

export default {
    components: {
        panel,
        loading,
        createSchedule
    },

    data() {
        return {
            loading: false,
            schedules: []
        };
    },

    created() {
        this.loading = true;
        setTimeout(() => {
            this.loadSchedules();
        }, 250);
    },

    methods: {
        pushRouterState(location) {
            this.$router.push(location);
        },

        async loadSchedules() {
            this.loading = true;

            this.schedules = (await api.getSchedules()).data;
            this.loading = false;
        }
    }
};
</script>
