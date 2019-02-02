<template>
    <div class="schedule-list">
        <a
            v-for="schedule in schedules"
            :key="schedule.id"
            href
            class="schedule-list-item"
            @click.prevent="$emit('click', schedule)"
        >
            <div class="schedule-list-item-title">{{ schedule.name }}</div>
            <div class="schedule-list-item-description">Dernière modification le 21/01/2019 à 22:39</div>
        </a>
    </div>
</template>

<script>
export default {
    props: {
        schedules: Array
    }
};
</script>
