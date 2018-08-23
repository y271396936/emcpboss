<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">操作1</el-breadcrumb-item>
        <el-breadcrumb-item>操作2</el-breadcrumb-item>
        <el-breadcrumb-item>操作3</el-breadcrumb-item>
        <el-breadcrumb-item>操作4</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" @click="showSlide('add')">右侧新增</el-button>
        <el-button type="primary">导出</el-button>
        <el-button type="primary" @click="showSlide('left-add')">左侧新增</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      title="新增客户"
      :width="500"
      @close="closeSlideCallback"
      ref="add">
      <el-form class="form" label-width="120px" size="small" :model="form" ref="form">
        <el-form-item
          label="客户名字"
          prop="contactName"
          required
          :rules="[
              {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
            ]">
          <el-input v-model="form.contactName" placeholder="请输入客户名字"/>
        </el-form-item>
        <el-form-item
          label="操作人"
          prop="trailerName"
          :rules="[
              {min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur'}
            ]">
          <el-input v-model="form.trailerName" placeholder="请输入操作人名字"/>
        </el-form-item>
        <el-form-item
          label="所在地"
          prop="address"
          required>
          <el-select v-model="form.address" placeholder="请选择客户所在地">
            <el-option label="北京" value="北京"/>
            <el-option label="广东" value="广东"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属行业"
          prop="industry"
          required>
          <el-select v-model="form.industry" placeholder="请选择客户所属行业">
            <el-option label="蛋糕" value="蛋糕"/>
            <el-option label="冰激凌" value="冰激凌"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="下次联系时间"
          prop="nextTime"
          required>
          <el-date-picker
            v-model="form.nextTime"
            placeholder="选择日期"
            type="date"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户成熟度" prop="heatDegree">
          <el-radio-group v-model="form.heatDegree">
            <el-radio label="成熟"/>
            <el-radio label="良好"/>
            <el-radio label="一般"/>
            <el-radio label="陌生"/>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      title="左侧新增客户"
      align="left"
      :width="800"
      :shade="true"
      :shade-opacity="30"
      @show="showSlideCallback"
      @close="closeSlideCallback"
      ref="left-add">
      <div style="height: 1200px; background:red;"></div>
    </ms-slide>

    <ms-search :data="search" @click="updateConditions"/>

    <el-table
      size="small" stripe border
      :data="list"
      :fit="true">
      <el-table-column prop="contactName" label="客户姓名" min-width="100" fixed/>
      <el-table-column prop="heatDegree" label="成熟度"/>
      <el-table-column prop="lastTime" label="最后联系时间" min-width="140" sortable/>
      <el-table-column prop="nextTime" label="下次联系时间" min-width="140" sortable/>
      <el-table-column prop="allocateTime" label="调配时间" min-width="140" sortable/>
      <el-table-column prop="industry" label="所属行业"/>
      <el-table-column prop="saler" label="所属销售"/>
      <el-table-column prop="trailerName" label="操作人"/>
      <el-table-column prop="address" label="省份"/>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="showRow(scope.$index)"> 查看 </el-button>

          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除账户<code>{{scope.row.contactName}}</code>吗？</p>
          </ms-confirm-button>

          <ms-confirm-button title="删除" type="icon" icon="remove" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除账户<code>{{scope.row.contactName}}</code>吗？</p>
          </ms-confirm-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.currentPage"
      :total="pagination.totalRow"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>
<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import ItemApi from '@/api/platform/item'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    name: 'customer',
    components: {
      MsSearch,
      MsSlide,
      MsConfirmButton
    },
    created () {
      // fixme 不同列表的查询条件不一样
      this.search = [
        {
          name: 'location',
          title: '所在地',
          placeholder: '--请选择所在地--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '选项1', label: '广东'},
              {value: '选项2', label: '广西'}
            ]
          }
        },
        {
          name: 'datafrom',
          title: '资料来源',
          placeholder: '--请选择资料来源--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: [
              {value: '选项1', label: '百度'},
              {value: '选项2', label: '百度信息流'},
              {value: '选项3', label: 'sogou'},
              {value: '选项4', label: '神马'},
              {value: '选项5', label: 'uc信息流'}
            ]
          }
        },
        {
          name: 'section',
          title: '所属部门',
          placeholder: '--请选择所属部门--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: [
              {value: '选项1', label: '部门1'},
              {value: '选项2', label: '部门2'},
              {value: '选项3', label: '部门3'},
              {value: '选项4', label: '部门4'},
              {value: '选项5', label: '部门5'}
            ]
          }
        },
        {
          name: 'sell',
          title: '所属销售',
          placeholder: '--请选择所属销售--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: [
              {value: '选项1', label: '部门1'},
              {value: '选项2', label: '部门2'},
              {value: '选项3', label: '部门3'},
              {value: '选项4', label: '部门4'},
              {value: '选项5', label: '部门5'}
            ]
          }
        },
        {
          name: 'itemTitle',
          title: '所属项目',
          placeholder: '请输入关键词',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method: (query) => {
                const myself = this.search[4]
                myself.config.remote.loading = true

                if (query === '' || query.length === 0) {
                  myself.config.list = []
                  myself.config.remote.loading = false
                  return
                }

                ItemApi.likeness({title: query, pageSize: 100}, response => {
                  let status = response.status || 0
                  let body = response.data || []
                  if (status >= 200 && status <= 204) {
                    const list = []
                    body.forEach(item => {
                      list.push({value: item.title, label: item.title})
                    })
                    myself.config.list = list
                  }
                  myself.config.remote.loading = false
                })
              }
            }
          }
        },
        {
          name: 'deploy',
          title: '调配时间',
          placeholder: '',
          type: CONDITION_TYPE.DATE,
          value: '',
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          name: 'register',
          title: '注册时间',
          placeholder: '',
          type: CONDITION_TYPE.DATE,
          value: '',
          visible: false,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          name: 'deploy',
          title: '下次联系时间',
          placeholder: '',
          type: CONDITION_TYPE.DATE,
          value: '',
          visible: false,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          name: 'register',
          title: '最后联系时间',
          placeholder: '',
          type: CONDITION_TYPE.DATE,
          value: '',
          visible: false,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          name: 'contacts',
          title: '联系人',
          placeholder: '',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'telephone',
          title: '联系电话',
          placeholder: '',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'cellphone',
          title: '手机号码',
          placeholder: '',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        }
      ]

      // fixme 通过 api 获取数据列表
      this.list = [
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李1',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        },
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李2',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        },
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李3',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        },
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李4',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        },
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李5',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        },
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李6',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        },
        {
          address: '深圳深圳湾',
          allocateTime: '2017-10-30 10:46:47',
          clientTypeId: 11,
          contactName: '李7',
          contactsId: 140,
          contactsStatus: 1,
          createTime: '2017-10-30 10:46:47',
          customerId: 3,
          email: '46587955@qq.com',
          gender: 1,
          helperId: 0,
          id: 221,
          industry: '蛋糕',
          industryId: 95,
          itemId: 3,
          main: true,
          mobile: '13725217486',
          phone: '98754563',
          projectName: '安特鲁',
          qq: '1445442243',
          region: '广东',
          sourceId: 25,
          status: 1,
          trailStatusId: 0,
          trailerId: 1,
          trailerName: '李先森',
          wechat: 'li1111'
        }
      ]
    },
    data () {
      return {
        search: [],
        list: [],
        pagination: {},
        form: {
          contactName: '',
          trailerName: '',
          address: '',
          industry: '',
          saler: '',
          allocateTime: '',
          nextTime: '',
          lastTime: '',
          heatDegree: ''
        }
      }
    },
    methods: {
      updateConditions (obj) {
        console.log(obj)
        // fixme 通过 api 传递搜索条件请求新数据
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      showSlideCallback () {
        console.log('slide showed: ')
      },
      closeSlideCallback () {
        this.form = {}
        console.log('slide closed: ')
      },
      showRow (index) {
        const rows = this.list.slice(index, index + 1)
        console.log(rows[0])
      },
      deleteRow (index) {
        this.list.splice(index, 1)
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form)
            // 新数据加到数组开头
            this.list.unshift(this.form)

            // 提示
            this.$message({message: '新增成功', type: 'success', duration: 1500})

            // 关闭
            this.$refs['add'].close()
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
