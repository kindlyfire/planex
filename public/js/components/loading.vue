<template>
    <div :class="classes">
        <loading-progress
            shape="line"
            :indeterminate="true"
            fill-duration="1.2"
            size="200"
            width="200"
            height="6"
        ></loading-progress>
    </div>
</template>

<script>
export default {
    props: {
        padding: {
            type: String,
            default: "0"
        }
    },

    computed: {
        classes() {
            return [
                "d-flex",
                "align-items-center",
                "justify-content-center",
                "pt-" + (this.padding || 0),
                "pb-" + (this.padding || 0)
            ];
        }
    }
};
</script>
