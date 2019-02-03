<template>
    <div style="height: 100%; width: 100%">
        <RouterView></RouterView>

        <TheLoader></TheLoader>
    </div>
</template>

<script>
import TheLoader from '&/components/TheLoader'

export default {
    components: {
        TheLoader
    }
}
</script>
