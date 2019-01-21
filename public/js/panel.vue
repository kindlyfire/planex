<template>
    <div class="main-layout">
        <div class="main-layout-sidebar">
            <div class="main-layout-navbar-container">
                <span
                    class="navbar-title cursor-pointer"
                    @click.prevent="pushRouterState('/')"
                >Planex</span>
            </div>

            <slot name="sidebar"></slot>
        </div>
        <div class="main-layout-content">
            <div class="main-layout-content-inner">
                <div class="main-layout-navbar-container"></div>

                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        pushRouterState(location) {
            this.$router.push(location);
        }
    }
};
</script>
