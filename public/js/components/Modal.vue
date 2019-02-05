<template>
    <div class="pmodal">
        <div class="pmodal-window-container">
            <div class="pmodal-window" :style="{ 'width': (width || 800) + 'px' }">
                <div class="pmodal-header">
                    <slot name="header"></slot>
                </div>

                <div class="pmodal-content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        width: Number
    }
}
</script>
