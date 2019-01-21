<template>
    <panel>
        <template slot="content">
            <div class="main-layout-content-center">
                <div class="pl-2 pr-2">
                    <h2>Horaires</h2>

                    <div class="schedule-list">
                        <a
                            href
                            class="schedule-list-item"
                            @click.prevent="pushRouterState('/schedule/1')"
                        >
                            <div class="schedule-list-item-title">Juin 2018/2019</div>
                            <div
                                class="schedule-list-item-description"
                            >Dernière modification le 21/01/2019 à 22:39</div>
                        </a>
                    </div>
                </div>
            </div>
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
