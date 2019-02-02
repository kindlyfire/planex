<template>
    <div class="main-layout">
        <div class="main-layout-sidebar">
            <div class="main-layout-navbar-container">
                <span class="navbar-title cursor-pointer" @click.prevent="$router.push('/')">Planex</span>
            </div>

            <slot name="sidebar"></slot>
        </div>
        <div class="main-layout-content">
            <div class="main-layout-content-inner">
                <div class="main-layout-navbar-container">
                    <slot name="header"></slot>
                </div>

                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>
