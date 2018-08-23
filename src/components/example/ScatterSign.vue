<template>
  <ve-map
    :data="data"
    :width="width"
    :height="height"
    :background-color="backgroundColor"
    :title="title"
    :tooltip="tooltip"
    :legend="legend"
    :geo="geo"
    :series="series"></ve-map>
</template>
<script>
  import signData from '@/api/example/weibo-sign'

  module.exports = {
    created: function () {
      const data = signData.map(seriesData => {
        let px = seriesData[0] / 1000
        let py = seriesData[1] / 1000
        let res = [
          [px, py]
        ]
        for (let i = 2; i < seriesData.length; i += 2) {
          let dx = seriesData[i] / 1000
          let dy = seriesData[i + 1] / 1000
          let x = px + dx
          let y = py + dy
          res.push([x.toFixed(2), y.toFixed(2), 1])
          px = x
          py = y
        }
        return res
      })

      this.data = {
        columns: ['位置', '流量'],
        rows: []
      }
      this.width = '98.8%'
      this.height = '600px'
      this.backgroundColor = '#404a59'
      this.title = {
        text: '微博签到数据点亮中国',
        subtext: 'From ThinkGIS',
        left: 'center',
        top: 'top',
        textStyle: {
          color: '#fff'
        }
      }
      this.tooltip = {}
      this.legend = {
        left: 'left',
        data: ['强', '中', '弱'],
        textStyle: {
          color: '#ccc'
        }
      }
      this.geo = {
        map: 'china',
        roam: true,
        label: {
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#404a59'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      }
      this.series = [{
        name: '弱',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 1,
        large: true,
        itemStyle: {
          shadowBlur: 2,
          normal: {
            shadowColor: 'rgba(37, 140, 249, 0.8)',
            color: 'rgba(37, 140, 249, 0.8)'
          }
        },
        data: data[0]
      }, {
        name: '中',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 1,
        large: true,
        itemStyle: {
          shadowBlur: 2,
          normal: {
            shadowColor: 'rgba(14, 241, 242, 0.8)',
            color: 'rgba(14, 241, 242, 0.8)'
          }
        },
        data: data[1]
      }, {
        name: '强',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 1,
        large: true,
        itemStyle: {
          shadowBlur: 2,
          normal: {
            shadowColor: 'rgba(255, 255, 255, 0.8)',
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        data: data[2]
      }]
    }
  }
</script>
