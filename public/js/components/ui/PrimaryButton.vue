<template>
    <button
        v-if="!disabled"
        class="btn btn-primary cursor-pointer"
        :class="className"
        @click="$emit('click')"
    >
        <slot></slot>
    </button>
    <button v-else class="btn" :class="className" disabled>
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        className: String,
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>
