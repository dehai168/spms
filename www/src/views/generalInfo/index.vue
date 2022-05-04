<template>
  <div class="container map-container" id="spms_map">
    <el-card class="top-card">
      <div style="float: left">重庆:晴/25℃</div>
      <div style="float: right">
        <el-link type="primary" @click="searchVisable = true">返回</el-link>
      </div>
    </el-card>
    <div v-if="searchVisable" class="search">
      <div class="search_title">综合信息查询</div>
      <div class="search_input">
        <el-input placeholder="输入场所名称、社会统一信用号码、企业电话" v-model="keywords" :clearable="true">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="search">查一下</el-button>
        </el-input>
      </div>
    </div>
    <el-dialog :title="videoName" :visible.sync="liveVideoDialogVisible" width="30%" :close-on-click-modal="false">
      <div style="text-align: center; width: 100%">
        <Livevideo :src="videoObject.src"></Livevideo>
      </div>
    </el-dialog>
    <el-dialog :title="detailName" :visible.sync="markerDetailDialogVisible" width="30%" :close-on-click-modal="false">
      <Markerdetail></Markerdetail>
    </el-dialog>
    <el-dialog :title="mediaName" :visible.sync="mediaListDialogVisible" width="30%" :close-on-click-modal="false">
      <Medialist @openVideo="viewVideo" @openImage="viewImage"></Medialist>
    </el-dialog>
    <el-dialog :title="imageName" :visible.sync="viewImageDialogVisible" width="50%" :close-on-click-modal="false">
      <Viewimage></Viewimage>
    </el-dialog>
  </div>
</template>
<script>
import defaultSettings from '@/settings'
import Vue from 'vue/dist/vue.js'
import { position, detail } from '@/api/home'
import location_1 from '@/assets/map/location_1.png'
import location_2 from '@/assets/map/location_2.png'
import location_3 from '@/assets/map/location_3.png'
import location_4 from '@/assets/map/location_4.png'
import location_5 from '@/assets/map/location_5.png'
import location_6 from '@/assets/map/location_6.png'
import location_7 from '@/assets/map/location_7.png'
import card from '../home/components/card.vue'
import gcoodrd from 'gcoord'
import Livevideo from '../home/components/livevideo.vue'
import Markerdetail from '../home/components/markerdetail.vue'
import Medialist from '../home/components/medialist.vue'
import Viewimage from '../home/components/viewimage.vue'
export default {
  name: 'GeneralInfo',
  components: {
    card,
    Livevideo,
    Markerdetail,
    Medialist,
    Viewimage
  },
  data() {
    return {
      map: null,
      popup: null,
      imgList: [location_1, location_2, location_3, location_4, location_5, location_6, location_7],
      keywords: '',
      liveVideoDialogVisible: false,
      videoObject: {
        src: 'index=50010400001310015829'
      },
      videoName: '',
      markerDetailDialogVisible: false,
      detailName: '',
      mediaListDialogVisible: false,
      mediaName: '',
      viewImageDialogVisible: false,
      imageName: '',
      infoList: [],
      searchVisable: true
    }
  },
  mounted() {
    this.initMap()
  },
  created() {
    const that = this
  },
  methods: {
    init() {},
    initMap() {
      mapabcgl.accessToken = defaultSettings.mapabcToken
      if (!mapabcgl.supported()) {
        alert('您的浏览器不支持Mapabc GL')
      } else {
        this.map = new mapabcgl.Map({
          container: 'spms_map',
          style: 'mapabc://style/' + defaultSettings.mapabcStyle,
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
      const that = this
      for (let index = 0; index < 7; index++) {
        ;(function (index) {
          that.map.loadImage(that.imgList[index], function (error, image) {
            that.map.addImage('location_' + index, image)
          })
        })(index)
      }
    },
    editHtml(object) {
      const htmlArray = []
      htmlArray.push("<div style='width:400px;'>")
      htmlArray.push("<ul style='list-style: none;line-height: 20px;padding: 0;margin: 0;'>")
      htmlArray.push("<li><span style='font-weight:bold;font-size:16px;color:#409EFF'>" + (object.enterprise || object.recreation_place_name) + '</span></li>')
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
      htmlArray.push('<li style="float:left;margin-left:10px;color:#409EFF;font-size:24px"><i class="el-icon-s-order" @click="clickHandlerMoreInfo"></i></li>')
      htmlArray.push('<li style="float:left;margin-left:10px;color:#409EFF;font-size:24px"><i class="el-icon-video-camera" @click="clickHandlerMediaList"></i></li>')
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
                res.data.enterprise = res.data.recreation_place_name
                break
              case 7:
                res.data.id = res.data.barid
                res.data.enterprise = res.data.recreation_place_name
                break
              default:
                break
            }
            res.data.type = type
            const that = this
            let infoWindow = Vue.extend({
              template: this.editHtml(res.data),
              data() {
                return {
                  data: res.data
                }
              },
              methods: {
                clickHandlerMoreInfo() {
                  that.viewMarkerDetail(this.data)
                },
                clickHandlerMediaList() {
                  that.viewMediaList(this.data)
                }
              }
            })
            let component = new infoWindow().$mount()
            const item = this.infoList.find(v => {
              return v.id === id && v.type === type
            })
            if (item) {
              this.openPopup(item, component.$el)
            } else {
              this.$message({
                message: '该企业没有定位信息',
                type: 'warning'
              })
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    openPopup(lnglat, html) {
      if (lnglat.lng === 0 && lnglat.lat === 0) {
        this.$message({
          message: '该企业没有定位信息',
          type: 'warning'
        })
      } else {
        if (this.popup) {
          this.popup.remove()
        }
        var popupOption = {
          closeOnClick: true,
          closeButton: true,
          anchor: 'bottom-left',
          offset: [0, 0]
        }
        this.popup = new mapabcgl.Popup(popupOption).setLngLat(new mapabcgl.LngLat(lnglat.lng, lnglat.lat)).setDOMContent(html).setMaxWidth('300px').addTo(this.map)
        this.map.setCenter([lnglat.lng, lnglat.lat])
      }
    },
    viewMediaList(data) {
      this.mediaName = data.enterprise
      this.mediaListDialogVisible = true
    },
    viewMarkerDetail(data) {
      this.detailName = data.enterprise
      this.markerDetailDialogVisible = true
    },
    viewVideo(row) {
      this.videoName = this.mediaName + '-' + row.name
      this.liveVideoDialogVisible = true
    },
    viewImage(row) {
      this.imageName = this.mediaName + '-' + row.name
      this.viewImageDialogVisible = true
    },
    search() {
      if (this.keywords.length > 0) {
        position({ key: this.keywords, index: 0, size: 50 })
          .then(res => {
            if (res.code === 200) {
              this.infoList.length = 0
              this.infoList = res.data
              this.infoList.forEach(element => {
                // 纠偏
                const transform = gcoodrd.transform([element.lng, element.lat], gcoodrd.WGS84, gcoodrd.GCJ02)
                element.lng = transform[0]
                element.lat = transform[1]
              })
              this.loadMarkers()
            }
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        this.$message({
          message: '请输入关键字之后再进行信息查询',
          type: 'warning'
        })
      }
    },
    loadMarkers() {
      this.searchVisable = false
      this.removeMarkers()
      const features = []
      const that = this
      this.infoList.forEach(element => {
        features.push({
          type: 'Feature',
          properties: element,
          geometry: { type: 'Point', coordinates: [element.lng, element.lat, 0.0] }
        })
      })
      this.map.addSource('earthquakes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        },
        cluster: false
      })
      const unclusterPointName = 'unclustered-point'
      this.map.addLayer({
        id: unclusterPointName,
        type: 'symbol',
        source: 'earthquakes',
        filter: ['!has', 'point_count'],
        layout: {
          'icon-image': 'location_0',
          'icon-size': 1
        }
      })
      this.map.on('click', unclusterPointName, function (e) {
        let features = e.features[0].properties
        that.loadPopup(features.id, features.type)
      })
      this.map.on('mouseenter', unclusterPointName, function () {
        that.map.getCanvas().style.cursor = 'pointer'
      })
      this.map.on('mouseleave', unclusterPointName, function () {
        that.map.getCanvas().style.cursor = ''
      })
    },
    removeMarkers() {
      const unclusterPointName = 'unclustered-point'
      if (this.popup) {
        this.popup.remove()
      }
      if (this.map.getLayer(unclusterPointName)) {
        this.map.removeLayer(unclusterPointName)
      }
      if (this.map.getSource('earthquakes')) {
        this.map.removeSource('earthquakes')
      }
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
  top: 5px;
  left: 5px;
  right: 5px;
  z-index: 1000;
}
.search {
  position: absolute;
  display: inline-flex;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1001;
  background-color: #fff;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.search_title {
  display: inline-flex;
  font-size: 24px;
  text-align: center;
  height: 30px;
  margin-top: 250px;
  margin-bottom: 10px;
}
.search_input {
  display: inline-flex;
  text-align: center;
  height: 28px;
  width: 450px;
}
.el-card >>> .el-card__body {
  height: 30px;
  padding: 5px;
  width: 100%;
}
</style>
