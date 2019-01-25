<template>
    <input type="text" v-model="addClassName" placeholder="Ajouter une classe...">
</template>

<script>
export default {
    data() {
        return {
            addClassName: null
        };
    }
};
</script>
