<template>
    <div class="loader">
        <div class="loader-inner" :style="style" :class="{ hidden }"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            width: 0,
            hidden: true,
            stack: 0,

            interval: null,
            timeout: null,
            timeout2: null
        }
    },

    computed: {
        style() {
            return {
                transform: `scaleX(${this.width / 100})`
            }
        }
    },

    created() {
        this.$root.$on('loader_push', this.push)
        this.$root.$on('loader_pop', this.pop)
    },

    methods: {
        push() {
            this.hidden = false
            this.stack += 1

            clearTimeout(this.timeout)
            clearTimeout(this.timeout2)

            if (this.stack === 1) {
                this.width = 0
            }

            if (!this.interval) {
                this.interval = setInterval(() => this.update(), 300)
                this.update()
            }
        },

        pop() {
            if (this.stack > 0) this.stack -= 1

            if (this.stack === 0) {
                this.width = 100

                clearInterval(this.interval)
                clearTimeout(this.timeout)
                clearTimeout(this.timeout2)
                this.interval = this.timeout = this.timeout2 = null

                this.timeout = setTimeout(() => {
                    this.hidden = true
                }, 400)
                this.timeout2 = setTimeout(() => {
                    this.width = 0
                }, 700)
            }
        },

        update() {
            let rate = (80 - this.width) / 5

            if (this.width > 79) {
                rate = 0.6
            }
            if (this.width > 95) {
                rate = 0
            }

            this.width += rate

            if (this.width > 100) {
                this.width = 100
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.loader {
    position: absolute;
    z-index: 99999999;

    left: 0;
    top: 0;

    width: 100%;
    height: 3px;
}

.loader-inner {
    width: 100%;
    height: 100%;

    background-color: lighten(#2b579a, 30%);

    transition: transform 0.3s, opacity 0.3s;
    transform: scaleX(0);
    transform-origin: top left;
    opacity: 1;
}

.loader-inner.hidden {
    opacity: 0;
}
</style>
