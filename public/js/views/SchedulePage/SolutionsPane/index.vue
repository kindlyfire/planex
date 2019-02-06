<template>
    <RouterView :schedule="schedule"></RouterView>
</template>

<script>
export default {
    props: {
        schedule: Object
    }
}
</script>
