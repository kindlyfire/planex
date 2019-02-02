<template>
    <ThePanel>
        <div class="main-layout-content-center">
            <div class="pl-2 pr-2">
                <div class="d-flex flex-row align-items-end">
                    <h1>Horaires</h1>

                    <div class="ml-auto" style="margin-bottom: .7rem;">
                        <CreateScheduleButton @saved="m_loader_load"/>
                    </div>
                </div>

                <LoadingBar v-if="m_loader_loading" padding="5"/>

                <ScheduleList
                    v-else
                    :schedules="schedules"
                    @click="$router.push('/schedule/' + $event.id)"
                />
            </div>
        </div>
    </ThePanel>
</template>

<script>
import api from "&/utils/api";

import loader from "&/mixins/loader";
import ThePanel from "&/components/ThePanel";
import LoadingBar from "&/components/LoadingBar";

import CreateScheduleButton from "./CreateScheduleButton";
import ScheduleList from "./ScheduleList";

export default {
    mixins: [loader],

    components: {
        ThePanel,
        LoadingBar,
        CreateScheduleButton,
        ScheduleList
    },

    data() {
        return {
            schedules: []
        };
    },

    methods: {
        async m_loader_loader() {
            this.schedules = await api.get("/schedules");
        }
    }
};
</script>
