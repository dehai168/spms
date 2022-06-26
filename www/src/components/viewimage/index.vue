<template>
    <div style="text-align: center">
        <el-image fit="contain" class="image" :src="src">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
        <div class="title">{{ title }}</div>
        <el-divider></el-divider>
        <el-carousel :initial-index="playIndex" :autoplay="false" type="card" height="120px" @change="handleView">
            <el-carousel-item v-for="(item, index) in list" :key="index">
                <img :src="item.src" alt="" srcset="" />
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    name: 'markerdetail',
    props: {
        id: {
            type: Number,
            default: 0
        },
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            playIndex: 0,
            src: '',
            title: '',
            list: []
        }
    },
    methods: {
        load(list) {
            this.list = list;
            this.handleView(0);
        },
        handleView(index) {
            this.playIndex = index
            const item = this.list[index];
            if (item) {
                this.src = item.src;
                this.title = item.title
            }
        }
    }
}
</script>
<style scoped>
.image {
    opacity: 0.75;
    margin: 0 auto;
    min-height: 200px;
    min-width: 200px;
}

.title {
    font-size: 14px;
}

.el-carousel__item img {
    opacity: 0.75;
    height: 100%;
}

.image-slot {
    font-size: 80px;
}
</style>
