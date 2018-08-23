<template>
  <div>
    <el-card class="title">您上一次于
      <span class="info">{{ lastLoginTime }}</span>
      在
      <span class="info">{{ lastLoginIp }}</span>
      登陆了系统。 如果不是您本人操作，请立即
      <span class="password" @click="$router.push({path: '/system-setting/passwords'})">修改密码</span>。
    </el-card>

    <el-card class="card" :body-style="{padding: 0}">
      <div class="icon-wrapper item1">
        <router-link :to="{path: 'operating-center/spread-clients'}">
          <icon class="icon" name="group" scale="3"/>
        </router-link>
      </div>
      <div class="description">
        <div class="text">当月客户变化</div>
        <div :class="['num', customerChange.increase > 0 ? 'ms-success' : '']">
          <!--<icon class="prepend-icon" name="arrow-up"/>-->
          <span class="unit">新增</span>
          <count-to :startVal="0" :endVal="customerChange.increase" :duration="1500"/>
          <span class="unit">增长率 {{customerChange.increaseRateText}}</span>
        </div>
        <div :class="['num', customerChange.decrease > 0 ? 'ms-caution' : '']">
          <!--<icon name="arrow-down"/>-->
          <span class="unit">下稿</span>
          <count-to :startVal="0" :endVal="customerChange.decrease" :duration="1500"/>
          <span class="unit">下稿率 {{customerChange.decreaseRateText}}</span>
        </div>
      </div>
    </el-card>

    <el-card class="card" :body-style="{padding: 0}">
      <div class="icon-wrapper item2">
        <router-link :to="{path: 'operating-center/client-items'}">
          <icon class="icon" name="bookmark" scale="3"/>
        </router-link>
      </div>
      <div class="description">
        <div class="text">当月项目变化</div>
        <div :class="['num', itemChange.increase > 0 ? 'ms-success' : '']">
          <!--<icon name="arrow-up"/>-->
          <span class="unit">新增</span>
          <count-to :startVal="0" :endVal="itemChange.increase" :duration="1500"/>
          <span class="unit">增长率 {{itemChange.increaseRateText}}</span>
        </div>
        <div :class="['num', itemChange.decrease > 0 ? 'ms-caution' : '']">
          <!--<icon name="arrow-down"/>-->
          <span class="unit">下稿</span>
          <count-to :startVal="0" :endVal="itemChange.decrease" :duration="1500"/>
          <span class="unit">下稿率 {{itemChange.decreaseRateText}}</span>
        </div>
      </div>
    </el-card>

    <el-card class="card" :body-style="{padding: 0}">
      <div class="icon-wrapper item3">
        <router-link :to="{path: 'finance/item-moneys', query: {maxMoney: -0.001}}">
          <icon class="icon" name="money" scale="3"/>
        </router-link>
      </div>
      <div class="description">
        <div class="text">项目欠费</div>
        <div :class="['num', itemArrearage.moneyAmount > 0 ? 'ms-caution' : '']">
          <count-to :startVal="0" :endVal="itemArrearage.moneyAmount" :decimals="2" :duration="1500"/>
          <span class="unit">元</span>
        </div>
        <div class="num">
          <count-to :startVal="0" :endVal="itemArrearage.itemCount" :duration="1500"/>
          <span class="unit">个</span>
        </div>
      </div>
    </el-card>

    <el-card class="card" :body-style="{padding: 0}">
      <div class="icon-wrapper item4">
        <router-link :to="{path: 'finance/item-consumption'}">
          <icon class="icon" name="stumbleupon" scale="3"/>
        </router-link>
      </div>
      <div class="description">
        <div class="text">项目消费</div>
        <div class="num">
          <span class="unit">前天</span>
          <count-to
            :startVal="0"
            :endVal="itemConsumptionAmount.beforeYesterdayCostMoneyAmount"
            :decimals="2"
            :duration="1500"/>
          <span class="unit">元</span>
        </div>
        <div class="num">
          <span class="unit">昨天</span>
          <count-to
            :startVal="0"
            :endVal="itemConsumptionAmount.yesterdayCostMoneyAmount"
            :decimals="2"
            :duration="1500"/>
          <span class="unit">元</span>
          <icon
            v-if="itemConsumptionAmount.yesterdayCostMoneyAmount > itemConsumptionAmount.beforeYesterdayCostMoneyAmount"
            class="ms-success"
            name="arrow-up"/>
          <icon
            v-else-if="itemConsumptionAmount.yesterdayCostMoneyAmount < itemConsumptionAmount.beforeYesterdayCostMoneyAmount"
            class="ms-caution"
            name="arrow-down"/>
          <icon v-else class="ms-info" name="minus"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import moment from 'moment'
  import ItemApi from '@/api/platform/item'
  import CustomerApi from '@/api/platform/customer'
  import ItemDailyConsumptionApi from '@/api/report/item-daily-consumption'

  export default {
    name: 'home',
    components: {
      CountTo
    },
    data () {
      return {
        itemArrearage: {
          itemCount: 0,
          moneyAmount: 0
        },
        itemChange: {
          increase: 0,
          increaseRate: 0,
          increaseRateText: '',
          decrease: 0,
          decreaseRate: 0,
          decreaseRateText: ''
        },
        itemConsumptionAmount: {
          yesterdayCostCoinAmount: 0,
          yesterdayCostMoneyAmount: 0,
          beforeYesterdayCostCoinAmount: 0,
          beforeYesterdayCostMoneyAmount: 0
        },
        customerChange: {
          increase: 0,
          increaseRate: 0,
          increaseRateText: '',
          decrease: 0,
          decreaseRate: 0,
          decreaseRateText: ''
        }
      }
    },
    computed: {
      lastLoginTime () {
        return this.$store.state.user.info.lastLoginTime
      },
      lastLoginIp () {
        return this.$store.state.user.info.lastLoginIp
      }
    },
    created () {
      // 项目欠费统计
      ItemApi.arrearage(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          body.moneyAmount = Math.abs(body.moneyAmount || 0)
          this.itemArrearage = body
        }
      })

      // 项目消费统计
      ItemDailyConsumptionApi.nearlyConsumptionAmount(response => {
        let status = response.status || 0
        let body = response.data || {}
        if (status >= 200 && status <= 204) {
          if (this.$store.state.user.info.id === 1) {
            if (body.beforeYesterdayCostMoneyAmount !== undefined && body.beforeYesterdayCostMoneyAmount !== 0) {
              let beforeMoneyLength = parseInt(body.beforeYesterdayCostMoneyAmount).toString().length
              body.beforeYesterdayCostMoneyAmount = body.beforeYesterdayCostMoneyAmount + Math.pow(10, beforeMoneyLength)
            }
            if (body.yesterdayCostMoneyAmount !== undefined && body.yesterdayCostMoneyAmount !== 0) {
              let yesterdayMoneyLength = parseInt(body.yesterdayCostMoneyAmount).toString().length
              body.yesterdayCostMoneyAmount = body.yesterdayCostMoneyAmount + Math.pow(10, yesterdayMoneyLength)
            }
          }
          this.itemConsumptionAmount = body
        }
      })

      const today = moment().format('YYYY-MM-DD')
      // 项目变化统计
      ItemApi.monthGrowth({search: {day: today}}, response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          body['increaseRateText'] = Number(body.increaseRate * 100).toFixed(2) + '%'
          body['decreaseRateText'] = Number(body.decreaseRate * 100).toFixed(2) + '%'
          this.itemChange = body
        }
      })

      // 客户变化统计
      CustomerApi.monthGrowth({search: {day: today}}, response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          body['increaseRateText'] = Number(body.increaseRate * 100).toFixed(2) + '%'
          body['decreaseRateText'] = Number(body.decreaseRate * 100).toFixed(2) + '%'
          this.customerChange = body
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/env";

  .title {
    margin-bottom: 10px;
    .info {
      color: red;
      font-family: 黑体, 宋体, 仿宋, monospace;
    }
    .password {
      color: $color-info;
      cursor: pointer;
    }
  }

  .card {
    width: 23%;
    height: 108px;
    display: inline-block;
    overflow: hidden;
    margin-right: 20px;
    &:hover {
      .icon-wrapper {
        color: #fff;
      }
      .item1 {
        &, & a {
          color: #fff;
          background: #40c9c6;
        }
      }
      .item2 {
        &, & a {
          color: #fff;
          background: #36a3f7;
        }
      }
      .item3 {
        &, & a {
          color: #fff;
          background: #f4516c;
        }
      }
      .item4 {
        &, & a {
          color: #fff;
          background: #34bfa3
        }
      }
    }
    &:last-child {
      margin-right: 0;
    }

    .icon-wrapper {
      float: left;
      margin: 15px 8px;
      padding: 15px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      cursor: pointer;
      .icon {
        float: left;
        font-size: 48px;
      }
    }
    .item1 {
      &, & a {
        color: #40c9c6;
      }
    }
    .item2 {
      &, & a {
        color: #36a3f7;
      }
    }
    .item3 {
      &, & a {
        color: #f4516c;
      }
    }
    .item4 {
      &, & a {
        color: #34bfa3
      }
    }
    .description {
      float: left;
      font-weight: bold;
      margin: 15px 0;
      @extend %font-size-bold;
      .text {
        color: $color-gray;
      }
      .num {
        @extend %font-size-bolder;
        .unit {
          @extend %font-size-small;
          color: $color-gray;
        }
      }
    }
  }
</style>
