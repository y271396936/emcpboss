<template>
  <ve-line
    :data="chartData"
    :width="width"
    :height="height"
    :grid="grid"
    :scale="scale"
    :colors="chartColors"
    :settings="chartSettings">
  </ve-line>
</template>
<script>
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
      this.grid = {left: 20, right: 20}
      this.scale = {y: true}
      this.width = '80%'
      this.height = '350px'
      this.chartSettings = {
        axisSite: {
          right: ['占比']
        },
        yAxisType: ['KMB', 'percent'],
        area: true
      }
    }
  }
</script>
<style>

</style>
