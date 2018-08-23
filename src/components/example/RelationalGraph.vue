<template>
  <ve-line
    :data="chartData"
    :width="width"
    :height="height"
    :grid="grid"
    :scale="scale"
    :colors="chartColors"
    :settings="chartSettings"
    :title="title"
    :tooltip="tooltip"
    :legend="legend"
    :toolbox="toolbox"
    :axisPointer="axisPointer"
    :dataZoom="dataZoom"
    :xAxis="xAxis"
    :yAxis="yAxis"
    :series="series">
  </ve-line>
</template>
<script>
  import times from '@/api/example/relational-graph-time'
  import data from '@/api/example/relational-graph'

  export default {
    created: function () {
      this.chartData = {
        columns: ['日期', '销售额', '占比'],
        rows: [
          {'日期': '1月1日', '销售额': 1523, '占比': 0.12},
          {'日期': '1月2日', '销售额': 1223, '占比': 0.345},
          {'日期': '1月3日', '销售额': 2123, '占比': 0.7},
          {'日期': '1月4日', '销售额': 4123, '占比': 0.31},
          {'日期': '1月5日', '销售额': 3123, '占比': 0.12},
          {'日期': '1月6日', '销售额': 7123, '占比': 0.65}
        ]
      }
      this.chartColors = [
        '#19d4ae', '#5ab1ef', '#fa6e86',
        '#ffb980', '#0067a6', '#c4b4e4',
        '#d87a80', '#9cbbff', '#d9d0c7',
        '#87a997', '#d49ea2', '#5b4947',
        '#7ba3a8'
      ]
      this.grid = [{
        left: 50,
        right: 50,
        height: '35%'
      }, {
        left: 50,
        right: 50,
        top: '55%',
        height: '35%'
      }]
      this.scale = {y: true}
      this.width = '98.8%'
      this.height = '600px'
      this.chartSettings = {
        axisSite: {
          right: ['占比']
        },
        yAxisType: ['KMB', 'percent'],
        area: true
      }
      this.title = {
        text: '雨量流量关系图',
        subtext: '数据来自西安兰特水电测控技术有限公司',
        x: 'center'
      }
      this.tooltip = {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      }
      this.legend = {
        data: ['流量', '降雨量'],
        x: 'left'
      }
      this.toolbox = {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      }
      this.axisPointer = {
        link: {xAxisIndex: 'all'}
      }
      this.dataZoom = [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        }
      ]

      const timeData = times.map(function (str) {
        return str.replace('2009/', '')
      })

      this.xAxis = [{
        type: 'category',
        boundaryGap: false,
        axisLine: {onZero: true},
        data: timeData
      }, {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: {onZero: true},
        data: timeData,
        position: 'top'
      }]
      this.yAxis = [
        {
          name: '流量(m^3/s)',
          type: 'value',
          max: 500
        },
        {
          gridIndex: 1,
          name: '降雨量(mm)',
          type: 'value',
          inverse: true
        }
      ]
      this.series = [
        {
          name: '流量',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: data[0]
        },
        {
          name: '降雨量',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          hoverAnimation: false,
          data: data[1]
        }
      ]
    }
  }
</script>
<style>

</style>
