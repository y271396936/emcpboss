<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>消费数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>消费数据导入</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card class="tips-card">
      <ol>
        <li>所有上传文件，请<span class="ms-danger">保持原始内容不要修改</span>，文件名部分不可以修改，
          具体请选择个数据类型查看说明
        </li>
        <li>
          如果一定需要修改：<span class="ms-danger">请勿使用Excel进行编辑Csv格式文件</span>，
          因为Excel软件在保存时，会改变上传文件原来的格式，从而造成无法上传。<br/>
          推荐使用 <a href="https://notepad-plus-plus.org/" target="_blank">NotePad++</a> 操作Csv文件
        </li>
        <li>
          <strong>消费核算方法：</strong>
          <ol>
            <li>导入完成后，点击“核对消费”按钮，跳转新页面，找到刚导入的日志</li>
            <li>点击 操作列 中的 “数据” 操作，显示本次导入的消费列表</li>
            <li>如果消费列表数据比较多，可点击左下角的分页选择框，将所有数据在一页中显示</li>
            <li>查看 总计行 的 消费点数，检查该数值与导入文件中的总计是否一致</li>
          </ol>
        </li>
      </ol>
    </el-card>

    <el-form class="form" label-width="120px" size="small" :model="form" ref="import">
      <el-form-item label="数据平台" prop="platformId" :rules="[{required: true, message: '必填'}]">
        <el-select v-model="form.platformId">
          <template v-for="platform in platforms">
            <el-option :label="platform.title" :value="platform.id" :disabled="platform.status === 0"/>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="数据类型" prop="typeId" :rules="[{required: true, message: '必填'}]">
        <el-select v-model="form.typeId" @change="getAccount">
          <el-option-group v-if="form.platformId === 1" label="百度">
            <el-option label="百度PC" :value="1"/>
            <el-option label="百度信息流" :value="7"/>
            <el-option label="百度网盟" :value="2"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 2" label="360">
            <el-option label="360竞价" :value="3"/>
            <el-option label="360信息流" :value="8"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 3" label="搜狗">
            <el-option label="搜狗竞价" :value="4"/>
            <el-option label="搜狗银河" :value="11"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 4" label="神马">
            <el-option label="神马竞价" :value="5"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 5" label="陌陌">
            <el-option label="陌陌" :value="6"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 6" label="今日头条">
            <el-option label="今日头条信息流" :value="9"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 7" label="UC头条">
            <el-option label="UC信息流" :value="10"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 8" label="腾讯">
            <el-option label="广点通" :value="13"/>
          </el-option-group>
          <el-option-group v-if="form.platformId === 9" label="58">
          </el-option-group>
          <el-option-group v-if="form.platformId === 10" label="一点资讯">
            <el-option label="一点资讯信息流" :value="12"/>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.typeId === 7 || form.typeId === 8 || form.typeId === 9 || form.typeId === 11
                     || form.typeId === 12 || form.typeId === 2 || form.typeId === 13"
                    label="数据账户" prop="accountId" :rules="[{required: true, message: '必填'}]">
        <el-select v-model="form.accountId" filterable remote placeholder="请输入关键字" :remote-method="getAccount"
                   :loading="remote.account.loading">
          <template v-for="account in remote.account.list">
            <el-option :label="account.name" :value="account.id"/>
          </template>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.typeId === 2 || form.typeId === 13" label="时间日期" prop="day" :rules="[{required: true, message: '必填'}]">
        <el-date-picker
          v-model="form.day"
          type="date"
          placeholder="请选择日期(当天导入日期)">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="文件" prop="file" :rules="[{required: true, message: '必填'}]">
        <input id="file" type="file" accept="file/csv,file/xls,file/xlsx" name="file" @change="onFileChange"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>

    <template v-if="form.typeId === 1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          前七行为概述内容，第八行为空行，第九行为标题，第十行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li>数据生成时间：2016-04-21 16:28</li>
            <li>数据生成条件：</li>
            <li>1. 时间范围：20160420</li>
            <li>2. 时间单位：分日</li>
            <li>3. 推广设备：移动设备，计算机</li>
            <li>4. 投放网络：全部</li>
            <li>5. 投放物料：全部</li>
            <li></li>
            <li class="ms-danger">日期,推广计划,账户,展现,点击,消费,点击率,平均点击价格,网页转化,商桥转化,电话转化</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 2">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题,第二行开始为数据。
          <br/>
          <ol class="code-light">
            <li>头部格式如下：</li>
            <li class="ms-danger">推广计划,展现,点击,消费,下载,安装,激活,激活(API对接)</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 3">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>请保持原始文件的名称，需要标注文件的，可以在文件名最前面加上描述文字，如：<br/>
          萌萌哒自定义标注_<span class="ms-danger">效果评估报告_2016-04-20至2016-04-20_20160421</span> (10)
          <span class="ms-danger">.csv</span>其中红色部分禁止修改，否则无法通过。
        </li>
        <li>
          首行为标题，第二行开始为数据。格式如下：<br/>
          <ol class="code-light">
            <li class="ms-danger">推广账户,产品线,推广计划,展示次数,点击次数,点击率,总费用,平均每次点击费用</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 4">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          2017-06-15搜狗升级后，首行为标题，第二行为统计，第三行开始为数据。头部格式如下：
          <ol class="code-light">
            <li class="ms-danger">编号,日期,账户,推广计划,消耗,点击数,展示数,点击率,点击均价,有消耗词量</li>
            <li class="ms-danger">总计,--,--,--,1000,332,1344,24.70%,3.01,231</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 5">
      <ol>
        <li>支持文件类型：Excel2003（.xls）, Excel2007+（.xlsx）</li>
        <li>2016-06-29后神马升级，支持文件类型更改为：CSV（.csv）</li>
        <li>
          其文件首行为标题，第二行开始为数据。头部格式如下：
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"时间",账户,推广计划,展现量,点击量,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 6">
      <ol>
        <li>暂时不支持的导入</li>
      </ol>
    </template>

    <template v-if="form.typeId === 7">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          前五行为概述内容，第六行为空行，第七行为标题，第八行开始为数据。
          <br/>
          <ol class="code-light">
            <li>2017-06-13后，到处数据格式变更。头部格式如下：</li>
            <li>数据生成时间：2017-12-25 09:00</li>
            <li>数据生成条件：</li>
            <li>1. 时间范围：20171224</li>
            <br>
            <li class="ms-danger">日期,推广计划,推广计划ID,展现,点击,消费,点击率,平均点击价格,千次展现消费,移动营销页浏览量,网页转化</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 8">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">时间,推广计划,展示次数,点击次数,点击率,总费用,平均点击费用,广告模式,产品线</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 9">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>该数据类型必须正确选择<strong> 数据账户 </strong>，否则无法导入</li>
        <li>数据每次仅支持导入<strong> 单日、单账户 </strong>的数据</li>
        <li>
          首行为标题，第二行开始为数据。<span class="ms-danger">2017-12-11日后</span>格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">
              时间,广告计划id,广告计划,广告组id,广告组,展示数,点击数,点击率(%),平均点击单价(元),平均千次展现费用(元),总花费(元)
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          首行为标题，第二行开始为数据。格式如下：
          <br/>
          <ol style="margin: 20px 0px 20px 100px">
            <li class="ms-danger">
              &nbsp;&nbsp;&nbsp;日期,账户id,账户,计划id,计划,展现,点击,消费,点击率,平均点击价格,千次展现价格
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 11">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>目前搜狗银河系统不支持数据导出，请复制数据贴入 Excel 表格中，并另存为 CSV 格式</li>
        <li>文件命名必须为：<span class="ms-danger">20170723.csv</span> 这样以日期为文件名形式</li>
        <li>
          第二行开始为标题。格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;,广告位,计划,计划状态,每日预算,投放时段,点击,消耗,点击均价</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 13">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          首行为标题，第二行开始为数据。格式如下：
          <br/>
          <ol style="margin: 20px 0px 20px 100px">
            <li class="ms-danger">
              &nbsp;&nbsp;&nbsp;推广计划名称,限额(元),状态,曝光量,点击量,点击率,花费(元),点击均价(元)
            </li>
          </ol>
        </li>
      </ol>
    </template>

  </div>
</template>

<script>
  import ChannelAccountApi from '@/api/platform/channel-account'
  import Api from '@/api/report/item-solution-report'
  import FormTokenApi from '@/api/system/form-token'
  import { PLATFORM_LIST } from '@/utils/constants'

  export default {
    data () {
      return {
        form: {},
        remote: {
          account: {
            list: [],
            loading: true
          }
        }
      }
    },
    created () {
      // 获得 form token
      FormTokenApi.create(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          this.form.token = body.token || ''
        }
      })
    },
    computed: {
      platforms () {
        return PLATFORM_LIST
      }
    },
    methods: {
      submit () {
        this.$refs['import'].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '导入中，请稍候',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })

            Api.import({form: this.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                this.$message.success('上传成功')
              } else {
                this.$message.error(body.error || '导入失败')
              }
              /* this.form = {}
              document.getElementById('file').value = '' */
              loading.close()

              // 为下次导入获取 form token
              FormTokenApi.create(response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  this.form.token = body.token || ''
                }
              })
            })
          }
        })
      },
      getAccount (query) {
        if (query === '' || query.length === 0) {
          this.remote.account.list = []
          return
        }
        this.remote.account.loading = true
        if (this.form.typeId === 7 || this.form.typeId === 8 || this.form.typeId === 9 || this.form.typeId === 11 ||
          this.form.typeId === 12 || this.form.typeId === 2 || this.form.typeId === 13) {
          ChannelAccountApi.likeness({search: {id: this.form.platformId, name: query}}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.account.list = body
            } else {
              this.remote.account.list = []
            }
            this.remote.account.loading = false
          })
        }
      },
      onFileChange (e) {
        this.form.file = e.target.files[0]
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  .tips-card {
    margin-bottom: 20px;

    ol {
      margin: 0;
      li {
        @extend %font-size-normal;
      }
    }
  }

  ol.code-light {
    background: $color-light;
    border: 1px solid $color-white-tint;
    li {
      @extend %font-size-normal;
      background: $color-tint;
      border-left: 1px solid $color-white-tint;
      padding-left: 5px;
    }
  }
</style>
