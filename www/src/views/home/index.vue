<template>
  <div class="container map-container" id="spms_map">
    <el-card class="top-card">
      <card v-for="item in countList" v-bind:key="item.id" :id="item.id" :enterprise="item.enterprise" :count="item.count" :abroad_persons="item.abroad_persons" :domestic_persons="item.domestic_persons" />
    </el-card>
    <el-card class="right-card">
      <fieldset>
        <legend>特殊行业</legend>
        <ul>
          <li><el-checkbox v-model="checkList[0]" @change="handleCheck" class="marginRight">旅馆业</el-checkbox></li>
          <li><el-checkbox v-model="checkList[4]" @change="handleCheck" class="marginRight">公章刻制业</el-checkbox></li>
          <li><el-checkbox v-model="checkList[1]" @change="handleCheck" class="marginRight">旧货交易</el-checkbox></li>
          <li><el-checkbox v-model="checkList[2]" @change="handleCheck" class="marginRight">机动车维修</el-checkbox></li>
          <li><el-checkbox v-model="checkList[3]" @change="handleCheck" class="marginRight">废旧金属回收</el-checkbox></li>
        </ul>
      </fieldset>
      <fieldset>
        <legend>娱乐场所</legend>
        <ul>
          <li><el-checkbox v-model="checkList[6]" @change="handleCheck" class="marginRight">酒吧</el-checkbox></li>
          <li><el-checkbox v-model="checkList[5]" @change="handleCheck" class="marginRight">KTV</el-checkbox></li>
        </ul>
      </fieldset>
    </el-card>
    <el-card class="right-search-card">
      <!-- <el-input placeholder="搜索场所(企业)名称" v-model="keywords" style="width: 280px">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input> -->
      <el-select v-model="keywords" filterable remote placeholder="搜索场所(企业)名称" :remote-method="remoteMethod" :loading="loading" clearable @change="handleSelect" style="width: 280px; z-index: 999999">
        <el-option v-for="item in searchResultList" :key="item.systemid" :label="item.enterprise" :value="item.systemid">
          <div>
            <div>{{ item.enterprise }}</div>
            <div style="color: #8492a6; font-size: 12px">负责人:{{ item.chief_person }}</div>
            <div style="color: #8492a6; font-size: 12px">地址:{{ item.enterprise_address }}</div>
            <div style="color: #8492a6; font-size: 12px">电话:{{ item.enterprise_telephone }}</div>
          </div>
        </el-option>
      </el-select>
    </el-card>
  </div>
</template>
<script>
import defaultSettings from '@/settings'
import Vue from 'vue/dist/vue.js'
import { position, detail, list } from '@/api/home'
import location_1 from '@/assets/map/location_1.png'
import location_2 from '@/assets/map/location_2.png'
import location_3 from '@/assets/map/location_3.png'
import location_4 from '@/assets/map/location_4.png'
import location_5 from '@/assets/map/location_5.png'
import location_6 from '@/assets/map/location_6.png'
import location_7 from '@/assets/map/location_7.png'
import card from './components/card.vue'
import gcoodrd from 'gcoord'
export default {
  name: 'Home',
  components: {
    card
  },
  data() {
    return {
      map: null,
      popup: null,
      imgList: [location_1, location_2, location_3, location_4, location_5, location_6, location_7],
      checkList: [true, true, true, true, true, true, true],
      infoList: [],
      keywords: '',
      loading: false,
      searchResultList: [],
      countList: [
        {
          id: 1,
          enterprise: '旅馆',
          count: 1,
          abroad_persons: 1,
          domestic_persons: 1
        },
        {
          id: 5,
          enterprise: '印章刻制',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 4,
          enterprise: '废旧金属回收',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 2,
          enterprise: '旧货交易',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 3,
          enterprise: '机动车维修',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 6,
          enterprise: 'KTV',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 7,
          enterprise: '酒吧',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        }
      ]
    }
  },
  mounted() {
    this.initMap()
  },
  created() {
    this.loadMarker()
  },
  methods: {
    init() {},
    initMap() {
      if (!mapabcgl.supported()) {
        alert('您的浏览器不支持Mapabc GL')
      } else {
        this.map = new mapabcgl.Map({
          container: 'spms_map',
          style: 'mapabc://style/mapabc79w',
          zoom: 13,
          maxZoom: 23,
          minZoom: 10,
          center: [106.5450302501726, 29.55581955753103],
          pitch: 0
        })
        this.map.addControl(new mapabcgl.NavControl({ showCompass: true, position: 'bottom-right' }))
        const that = this
        this.map.on('load', function () {
          that.loadMarkerImage()
        })
      }
    },
    loadMarkerImage() {
      for (let index = 0; index < 7; index++) {
        const img = new Image()
        img.src = this.imgList[index]
        img.width = 32
        img.height = 32
        this.map.addImage('location_' + (index + 1), img)
      }
    },
    loadMarker() {
      position({})
        .then(res => {
          if (res.code === 200) {
            this.loadCluster(res.data)
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    loadCluster(list) {
      const that = this
      const features = []
      list.forEach(element => {
        // 纠偏
        const transform = gcoodrd.transform([element.lng, element.lat], gcoodrd.WGS84, gcoodrd.GCJ02)
        element.lng = transform[0]
        element.lat = transform[1]
        // 按勾选过滤
        if (that.checkList[element.type - 1]) {
          features.push({
            type: 'Feature',
            properties: element,
            geometry: { type: 'Point', coordinates: [element.lng, element.lat, 0.0] }
          })
        }

        const index = that.countList.findIndex(v => {
          return v.id === element.type
        })
        if (index > -1) {
          that.countList[index].count++
          that.countList[index].abroad_persons += element.abroad_persons
          that.countList[index].domestic_persons += element.domestic_persons
        }
        this.infoList.push(element)
      })
      this.map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
      })
      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['sourcehansanscn-normal'],
          'text-size': 12
        }
      })
      this.map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['!has', 'point_count'],
        layout: {
          'icon-image': 'location_1',
          'icon-size': 1
        }
      })
      this.map.on('click', 'unclustered-point', function (e) {
        let features = e.features[0].properties
        // TODO 如果知道点击了那个点
        console.log(features)
        that.loadPopup(features.id, features.type)
      })
      this.map.on('mouseenter', 'unclustered-point', function () {
        that.map.getCanvas().style.cursor = 'pointer'
      })
      this.map.on('mouseleave', 'unclustered-point', function () {
        that.map.getCanvas().style.cursor = ''
      })
    },
    refreshCluster() {
      const that = this
      const features = []
      this.infoList.forEach(element => {
        if (that.checkList[element.type - 1]) {
          features.push({
            type: 'Feature',
            properties: element,
            geometry: { type: 'Point', coordinates: [element.lng, element.lat, 0.0] }
          })
        }
      })

      this.map.removeLayer('unclustered-point')
      this.map.removeLayer('cluster-count')
      this.map.removeLayer('clusters')
      this.map.removeSource('earthquakes')

      this.map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        }
      })
      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['sourcehansanscn-normal'],
          'text-size': 12
        }
      })
      this.map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['!has', 'point_count'],
        layout: {
          'icon-image': 'location_1',
          'icon-size': 1
        }
      })
      this.map.on('click', 'unclustered-point', function (e) {
        let features = e.features[0].properties
        that.loadPopup(features.id, features.type)
      })
      this.map.on('mouseenter', 'unclustered-point', function () {
        that.map.getCanvas().style.cursor = 'pointer'
      })
      this.map.on('mouseleave', 'unclustered-point', function () {
        that.map.getCanvas().style.cursor = ''
      })
    },
    editHtml(object) {
      const htmlArray = []
      htmlArray.push("<div style='width:400px;'>")
      htmlArray.push("<ul style='list-style: none;line-height: 20px;padding: 0;margin: 0;'>")
      htmlArray.push("<li><span style='font-weight:bold;font-size:16px;color:#409EFF'>" + object.enterprise + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>社会统一信用代码</span>:<span style='color:#909399'>" + (object.credit_code || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>企业电话</span>:<span style='color:#909399'>" + (object.enterprise_telephone || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>经济类型</span>:<span style='color:#909399'>" + (object.economic_type || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>法人姓名</span>:<span style='color:#909399'>" + (object.legal_person || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>单位负责人</span>:<span style='color:#909399'>" + (object.chief_person || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>经营范围</span>:<span style='color:#909399'>" + (object.operate_scale || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>管辖单位</span>:<span style='color:#909399'>" + (object.police_unit || '') + '</span></li>')
      htmlArray.push("<li><span style='font-weight:bold'>详细地址</span>:<span style='color:#909399'>" + (object.enterprise_detail_address || '') + '</span></li>')
      htmlArray.push('</ul>')
      htmlArray.push("<ul style='list-style: none;height: 30px;line-height: 20px;padding: 0;margin-top: 5px;'>")
      htmlArray.push('<li style="float:left;margin-left:10px;color:#409EFF"><a href="javascript:;" @click="clickHandler(\'moreinfo\',' + object.type + ',' + object.id + ')">更多信息</a></li>')
      htmlArray.push('<li style="float:left;margin-left:10px;color:#409EFF"><a href="javascript:;" @click="clickHandler(\'livevideo\',' + object.type + ',' + object.id + ')">实时视频</a></li>')
      htmlArray.push('</ul>')
      htmlArray.push('</div>')
      return htmlArray.join('')
    },
    loadPopup(id, type) {
      detail({ id, type })
        .then(res => {
          if (res.code === 200) {
            switch (type) {
              case 1:
                res.data.id = res.data.hotelid
                break
              case 2:
                res.data.id = res.data.junk_tradeid
                break
              case 3:
                res.data.id = res.data.vehicle_repairid
                break
              case 4:
                res.data.id = res.data.scrap_metal_recycleid
                break
              case 5:
                res.data.id = res.data.seal_engrave_unitid
                break
              case 6:
                res.data.id = res.data.ktvid
                break
              case 7:
                res.data.id = res.data.barid
                break
              default:
                break
            }
            res.data.type = type
            let infoWindow = Vue.extend({
              template: this.editHtml(res.data),
              data() {
                return {}
              },
              methods: {
                clickHandler(command, type, id) {
                  console.log(command + ',' + type + ',' + id)
                }
              }
            })
            let component = new infoWindow().$mount()
            const item = this.infoList.find(v => {
              return v.id === id && v.type === type
            })
            if (item) {
              this.openPopup(item, component.$el.outerHTML)
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    openPopup(lnglat, html) {
      if (lnglat.lng === 0 && lnglat.lat === 0) return
      if (this.popup) {
        this.popup.remove()
      }
      var popupOption = {
        closeOnClick: true,
        closeButton: true,
        anchor: 'bottom-left',
        offset: [0, 0]
      }
      this.popup = new mapabcgl.Popup(popupOption).setLngLat(new mapabcgl.LngLat(lnglat.lng, lnglat.lat)).setHTML(html).addTo(this.map)
      this.map.setCenter([lnglat.lng, lnglat.lat])
    },
    // search() {
    //   if (this.keywords.length > 0) {
    //     detail({ key: this.keywords })
    //       .then(res => {
    //         if (res.code === 200) {
    //           console.log(res.data)
    //         }
    //       })
    //       .catch(e => {
    //         console.log(e)
    //       })
    //   } else {
    //     this.$message({
    //       message: '请输入关键字之后再进行检索',
    //       type: 'warning'
    //     })
    //   }
    // },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        list({ key: query, index: 0, size: 10 })
          .then(res => {
            this.loading = false
            if (res.code === 200) {
              this.searchResultList = res.data
            }
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        this.searchResultList = []
      }
    },
    handleSelect(id) {
      const item = this.searchResultList.find(v => {
        return v.systemid === id
      })
      if (item) {
        this.loadPopup(item.systemid, item.type)
      }
    },
    handleCheck() {
      this.refreshCluster()
    }
  }
}
</script>
<style scoped>
.container {
  position: relative;
  height: calc(100vh - 60px);
  width: 100%;
}
.top-card {
  position: absolute;
  display: inline-flex;
  left: 0;
  right: 0;
  top: 10px;
  width: 1110px;
  height: 90px;
  z-index: 9999;
  margin: auto;
  padding: 15px;
}
.right-card {
  position: absolute;
  display: inline-flex;
  right: 10px;
  top: 160px;
  width: 300px;
  z-index: 999;
  padding: 20px;
}
.right-search-card {
  position: absolute;
  display: inline-flex;
  right: 10px;
  top: 110px;
  width: 300px;
  z-index: 9999;
}
.el-select-dropdown__item {
  height: 100px;
}
.el-card >>> .el-card__body {
  padding: 5px;
}
.marginRight {
  margin-right: 10px;
}
ul li {
  line-height: 24px;
}
ul li img {
  width: 16px;
  height: 16px;
}
</style>