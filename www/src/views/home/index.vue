<template>
  <div class="container map-container" id="spms_map">
    <el-card class="top-card">
      <card v-for="item in countList" v-bind:key="item.id" :id="item.id" :to="item.to" :enterprise="item.enterprise" :count="item.count" :abroad_persons="item.abroad_persons" :domestic_persons="item.domestic_persons" />
    </el-card>
    <el-card class="right-card">
      <fieldset>
        <legend>特殊行业</legend>
        <ul>
          <li><el-checkbox v-model="checkList[0]" @change="handleCheck(0)" class="marginRight">旅馆业</el-checkbox><img :src="imgList[0]" alt="" srcset="" /></li>
          <li><el-checkbox v-model="checkList[4]" @change="handleCheck(4)" class="marginRight">公章刻制业</el-checkbox><img :src="imgList[1]" alt="" srcset="" /></li>
          <li><el-checkbox v-model="checkList[1]" @change="handleCheck(1)" class="marginRight">旧货交易</el-checkbox><img :src="imgList[2]" alt="" srcset="" /></li>
          <li><el-checkbox v-model="checkList[2]" @change="handleCheck(2)" class="marginRight">机动车维修</el-checkbox><img :src="imgList[3]" alt="" srcset="" /></li>
          <li><el-checkbox v-model="checkList[3]" @change="handleCheck(3)" class="marginRight">废旧金属回收</el-checkbox><img :src="imgList[4]" alt="" srcset="" /></li>
        </ul>
      </fieldset>
      <fieldset>
        <legend>娱乐场所</legend>
        <ul>
          <li><el-checkbox v-model="checkList[6]" @change="handleCheck(6)" class="marginRight">酒吧</el-checkbox><img :src="imgList[5]" alt="" srcset="" /></li>
          <li><el-checkbox v-model="checkList[5]" @change="handleCheck(5)" class="marginRight">KTV</el-checkbox><img :src="imgList[6]" alt="" srcset="" /></li>
        </ul>
      </fieldset>
      <fieldset>
        <legend>监控设备</legend>
        <ul>
          <li><el-checkbox v-model="cameraVisable" @change="handleCameraVisable()" class="marginRight">摄像头</el-checkbox><img :src="cameraImg" alt="" srcset="" /></li>
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
    <el-dialog :title="detailName" :visible.sync="markerDetailDialogVisible" width="50%" :close-on-click-modal="false">
      <Markerdetail></Markerdetail>
    </el-dialog>
    <el-dialog :title="mediaName" :visible.sync="mediaListDialogVisible" width="30%" :close-on-click-modal="false">
      <Medialist @openVideo="viewVideo" @openImage="viewImage"></Medialist>
    </el-dialog>
    <el-dialog :title="imageName" :visible.sync="viewImageDialogVisible" width="50%" :close-on-click-modal="false">
      <Viewimage></Viewimage>
    </el-dialog>
    <iframe id="targetFrame" width="0" height="0" frameborder="0"></iframe>
  </div>
</template>
<script>
import defaultSettings from '@/settings'
import Vue from 'vue/dist/vue.js'
import { position, detail, list, devicelist } from '@/api/home'
import location_1 from '@/assets/map/location_1.png'
import location_2 from '@/assets/map/location_2.png'
import location_3 from '@/assets/map/location_3.png'
import location_4 from '@/assets/map/location_4.png'
import location_5 from '@/assets/map/location_5.png'
import location_6 from '@/assets/map/location_6.png'
import location_7 from '@/assets/map/location_7.png'
import camera from '@/assets/map/camera.png'
import camera_cluter from '@/assets/map/camera_cluster.png'
import card from './components/card.vue'
import gcoodrd from 'gcoord'
import Markerdetail from './components/markerdetail.vue'
import Medialist from './components/medialist.vue'
import Viewimage from './components/viewimage.vue'
export default {
  name: 'Home',
  components: {
    card,
    Markerdetail,
    Medialist,
    Viewimage
  },
  data() {
    return {
      map: null,
      popup: null,
      imgList: [location_1, location_2, location_3, location_4, location_5, location_6, location_7],
      cameraImg: camera,
      camera_cluterImg: camera_cluter,
      cameraVisable: true,
      checkList: [true, true, true, true, true, true, true, true],
      infoList: [],
      cameraDeviceList: [],
      keywords: '',
      loading: false,
      searchResultList: [],
      countList: [
        {
          id: 1,
          to: '/basicinfo/specialindustries/hotel/base',
          enterprise: '旅馆',
          count: 1,
          abroad_persons: 1,
          domestic_persons: 1
        },
        {
          id: 5,
          to: '/basicinfo/specialindustries/seal/list',
          enterprise: '印章刻制',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 4,
          to: '/basicinfo/specialindustries/scrapMetal',
          enterprise: '废旧金属回收',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 2,
          to: '/basicinfo/specialindustries/fleatrade',
          enterprise: '旧货交易',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 3,
          to: '/basicinfo/specialindustries/vehiclerepair',
          enterprise: '机动车维修',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 6,
          to: '/basicinfo/entertainment-places/ktv',
          enterprise: 'KTV',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        },
        {
          id: 7,
          to: '/basicinfo/entertainment-places/bar',
          enterprise: '酒吧',
          count: 0,
          abroad_persons: 0,
          domestic_persons: 0
        }
      ],
      videoObject: {
        src: ''
      },
      markerDetailDialogVisible: false,
      detailName: '',
      mediaListDialogVisible: false,
      mediaName: '',
      viewImageDialogVisible: false,
      imageName: ''
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
          that.loadDataAndCount()
          that.loadCameraList()
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
      that.map.loadImage(this.cameraImg, function (error, image) {
        that.map.addImage('camera', image)
      })
      that.map.loadImage(this.camera_cluterImg, function (error, image) {
        that.map.addImage('camera_cluter', image)
      })
    },
    loadDataAndCount() {
      position({})
        .then(res => {
          if (res.code === 200) {
            this.infoList.length = 0
            this.infoList = res.data
            this.infoList.forEach(element => {
              // 纠偏
              const transform = gcoodrd.transform([element.lng, element.lat], gcoodrd.WGS84, gcoodrd.GCJ02)
              element.lng = transform[0]
              element.lat = transform[1]
              const index = this.countList.findIndex(v => {
                return v.id === element.type
              })
              if (index > -1) {
                this.countList[index].count++
                this.countList[index].abroad_persons += element.abroad_persons
                this.countList[index].domestic_persons += element.domestic_persons
              }
            })

            this.loadCluster()
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    loadCameraList() {
      devicelist({})
        .then(res => {
          this.cameraDeviceList.length = 0
          this.cameraDeviceList = res.data
          this.cameraDeviceList.forEach(element => {
            // 纠偏
            const transform = gcoodrd.transform([element.lng, element.lat], gcoodrd.WGS84, gcoodrd.GCJ02)
            element.lng = transform[0]
            element.lat = transform[1]
          })

          this.loadCameraCluster()
        })
        .catch(e => {
          console.error(e)
        })
    },
    loadCluster() {
      for (let index = 0; index < this.checkList.length; index++) {
        const checked = this.checkList[index]
        const sourceName = 'earthquakes_' + index
        const tempArray = this.infoList.filter(v => {
          return v.type === index
        })
        const features = []
        tempArray.forEach(element => {
          features.push({
            type: 'Feature',
            properties: element,
            geometry: { type: 'Point', coordinates: [element.lng, element.lat, 0.0] }
          })
        })
        this.map.addSource(sourceName, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        })
        this.refreshCluster(index, checked)
      }
    },
    loadCameraCluster() {
      const sourceName = 'earthquakes_camera'
      const features = []
      this.cameraDeviceList.forEach(element => {
        features.push({
          type: 'Feature',
          properties: element,
          geometry: { type: 'Point', coordinates: [element.lng, element.lat, 0.0] }
        })
      })
      this.map.addSource(sourceName, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      })
      this.refreshCameraCluster()
    },
    refreshCluster(index, checked) {
      const sourceName = 'earthquakes_' + index
      const clustersName = 'clusters_' + index
      const clustersCountName = 'cluster-count_' + index
      const unclusterPointName = 'unclustered-point_' + index
      const that = this
      if (checked) {
        this.map.addLayer({
          id: clustersName,
          type: 'circle',
          source: sourceName,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
            'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
          }
        })
        this.map.addLayer({
          id: clustersCountName,
          type: 'symbol',
          source: sourceName,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['sourcehansanscn-normal'],
            'text-size': 12
          }
        })
        this.map.addLayer({
          id: unclusterPointName,
          type: 'symbol',
          source: sourceName,
          filter: ['!has', 'point_count'],
          layout: {
            'icon-image': 'location_' + index,
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
      } else {
        if (this.popup) {
          this.popup.remove()
        }
        if (this.map.getLayer(unclusterPointName)) {
          this.map.removeLayer(unclusterPointName)
        }
        if (this.map.getLayer(clustersCountName)) {
          this.map.removeLayer(clustersCountName)
        }
        if (this.map.getLayer(clustersName)) {
          this.map.removeLayer(clustersName)
        }
      }
    },
    refreshCameraCluster() {
      const sourceName = 'earthquakes_camera'
      const clustersName = 'clusters_camera'
      const clustersCountName = 'cluster-count_camera'
      const unclusterPointName = 'unclustered-point_camera'
      const that = this
      if (this.cameraVisable) {
        // this.map.addLayer({
        //   id: clustersName,
        //   type: 'circle',
        //   source: sourceName,
        //   filter: ['has', 'point_count'],
        //   paint: {
        //     'circle-color': ['step', ['get', 'point_count'], '#1E90FF', 100, '#f1f075', 750, '#f28cb1'],
        //     'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
        //   }
        // })
        this.map.addLayer({
          id: clustersName,
          type: 'symbol',
          source: sourceName,
          filter: ['has', 'point_count'],
          layout: {
            'icon-image': 'camera_cluter',
            'icon-size': 1
          }
        })
        this.map.addLayer({
          id: clustersCountName,
          type: 'symbol',
          source: sourceName,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['sourcehansanscn-normal'],
            'text-size': 12
          }
        })
        this.map.addLayer({
          id: unclusterPointName,
          type: 'symbol',
          source: sourceName,
          filter: ['!has', 'point_count'],
          layout: {
            'icon-image': 'camera',
            'icon-size': 1
          }
        })
        this.map.on('click', clustersName, function (e) {
          console.log(e)
        })
        this.map.on('click', unclusterPointName, function (e) {
          let features = e.features[0].properties
          that.videoObject.src = features.code
          that.play()
        })
        this.map.on('mouseenter', unclusterPointName, function () {
          that.map.getCanvas().style.cursor = 'pointer'
        })
        this.map.on('mouseleave', unclusterPointName, function () {
          that.map.getCanvas().style.cursor = ''
        })
      } else {
        if (this.map.getLayer(unclusterPointName)) {
          this.map.removeLayer(unclusterPointName)
        }
        if (this.map.getLayer(clustersCountName)) {
          this.map.removeLayer(clustersCountName)
        }
        if (this.map.getLayer(clustersName)) {
          this.map.removeLayer(clustersName)
        }
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
      this.videoObject.src = row.code
      this.play()
    },
    viewImage(row) {
      this.imageName = this.mediaName + '-' + row.name
      this.viewImageDialogVisible = true
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
      } else {
        console.log(item)
      }
    },
    handleCheck(index) {
      const checked = this.checkList[index]
      this.refreshCluster(index, checked)
    },
    handleCameraVisable() {
      this.refreshCameraCluster()
    },
    full() {
      const url = 'VideoMap://fullscreen'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    hide() {
      const url = 'VideoMap://hide'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    exit() {
      const url = 'VideoMap://exit'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    play() {
      const url = 'VideoPlay://index=' + this.videoObject.src + '&pos=0_0_200_200&fullscreen=true'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
    },
    stop() {
      const url = 'VideoPlay://exit'
      const tf = document.getElementById('targetFrame')
      tf.setAttribute('src', url)
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
  z-index: 2000;
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
  z-index: 2000;
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
