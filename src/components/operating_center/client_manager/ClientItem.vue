<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>客户项目</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增客户项目</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch">
      <!--@clickH="calculatedHeight"-->
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <ms-slide title="客户问卷" :width="800" @close="closeSlide()" ref="slideSurvey">
      <el-form class="form" label-width="200px" size="small" :model="row.form" ref="formSurvey">
        <h3>一、企业详情</h3>
        <el-form-item label="推广项目名称" prop="itemName" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.itemName"></el-input>
        </el-form-item>
        <el-form-item label="公司官方网址" prop="webSite">
          <el-input v-model="row.form.webSite">
            <template slot="prepend">Http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="公司成立时间" prop="regtime">
          <el-input v-model="row.form.regtime" placeholder="如：2010-12-08"></el-input>
        </el-form-item>
        <el-form-item label="公司旗下品牌" prop="brands">
          <el-input v-model="row.form.brands"></el-input>
        </el-form-item>
        <el-form-item label="该项目已推广" prop="popularizeTimeSpan">
          <el-input v-model="row.form.popularizeTimeSpan" placeholder="多长时间"></el-input>
        </el-form-item>
        <el-form-item label="是否有分公司" prop="filiale">
          <el-radio-group v-model="row.form.filiale">
            <el-radio :label="0">没有</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分公司所在城市" prop="filialeCitys">
          <el-input v-model="row.form.filialeCitys" placeholder="多个请以逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="对外宣传" prop="cooperantShop">
          <el-input v-model="row.form.cooperantShop">
            <template slot="prepend">公司目前有</template>
            <template slot="append">家加盟店</template>
          </el-input>
        </el-form-item>
        <el-form-item label="项目招商团队" prop="teamPeople" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.teamPeople">
            <template slot="prepend">有</template>
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="日最低资源数" prop="dailyMinResource" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.dailyMinResource"></el-input>
        </el-form-item>
        <el-form-item label="是否有完善的在线客服部门" prop="onlineService" :rules="[{required: true, message: '必填'}]">
          <el-radio-group v-model="row.form.onlineService">
            <el-radio :label="0">没有</el-radio>
            <el-radio :label="1">有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公司目前的来访百分比大概是" prop="visitingRate">
          <el-input v-model="row.form.visitingRate">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="签单百分比大概是" prop="closeRate">
          <el-input v-model="row.form.closeRate">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <h3>二、品牌定位</h3>
        <el-form-item label="项目是做什么的？" prop="productOrientation" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.productOrientation"></el-input>
        </el-form-item>
        <el-form-item label="项目有哪些产品系列？" prop="products" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.products"></el-input>
        </el-form-item>
        <el-form-item label="加盟商的男女比例" prop="genderRation">
          <el-input v-model="row.form.genderRation" placeholder="如：6:4"></el-input>
        </el-form-item>
        <el-form-item label="年龄段主要以" prop="ageSegment">
          <el-input v-model="row.form.ageSegment" placeholder="如：12-20岁，80后，大学生">
            <template slot="append">为主</template>
          </el-input>
        </el-form-item>
        <el-form-item label="核心竞争优势及主要卖点是什么？（比如免加盟费、赠送装修等）" prop="advantage">
          <el-input v-model="row.form.advantage" placeholder="多个请以逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="正在使用的招商页面地址" prop="joinWebSite" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.joinWebSite">
            <template slot="prepend">http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="投资金额" prop="minInvestment" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.minInvestment">
            <template slot="prepend">最低</template>
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="row.form.maxInvestment">
            <template slot="prepend">最高</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="更加详细的加盟政策" prop="joinPolicy">
          <el-input v-model="row.form.joinPolicy" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="公司主要的竞争对手有哪些？" prop="competitor">
          <el-input v-model="row.form.competitor" placeholder="多个请以逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="同行业中，正在使用电视广告或者曾经使用过电视广告的有" prop="tvCompetitor">
          <el-input v-model="row.form.tvCompetitor" placeholder="多个请以逗号隔开"></el-input>
        </el-form-item>
        <el-form-item v-show="isShow">
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formSurvey')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>
    <ms-slide title="推广方向" :width="600" @close="closeWaySlide()" ref="slideOrientation">
      <el-tabs v-model="row.orientation.activeName" @tab-click="tabChange">

        <el-tab-pane label="指定推广方向" name="orientation">
          <template>
            <el-form class="form" label-width="120px" size="small" :model="row.orientationForm" ref="formOrientation">
              <el-form-item label="推广时间" prop="popularizeTime">
                <el-input placeholder="请输入内容" v-model="row.orientationForm.popularizeTime"></el-input>
              </el-form-item>
              <el-form-item label="推广地域" prop="popularizeArea">
                <el-input type="textarea" :rows="5" v-model="row.orientationForm.popularizeArea"></el-input>
              </el-form-item>
              <el-form-item label="排除地域" prop="excludeArea">
                <el-input type="textarea" :rows="5" v-model="row.orientationForm.excludeArea"></el-input>
              </el-form-item>
              <el-form-item label="成单来访词" prop="benefitKeyword">
                <el-input type="textarea" :rows="5" v-model="row.orientationForm.benefitKeyword"></el-input>
              </el-form-item>
              <el-form-item label="推广方向" prop="content" :rules="[{required: true, message: '必填'}]">
                <el-input type="textarea" :rows="5" v-model="row.orientationForm.content"></el-input>
              </el-form-item>
              <el-form-item label="重大更改" prop="greatChange">
                <el-input type="textarea" :rows="5" v-model="row.orientationForm.greatChange"></el-input>
              </el-form-item>
              <el-form-item v-show="isShow">
                <el-button type="primary" @click="addOrientation()">提交</el-button>
                <el-button @click="resetForm('formOrientation')">重置</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-tab-pane>

        <el-tab-pane label="推广方向记录" name="orientationLog">
          <template>
            <el-table size="small" stripe border :data="row.orientation.log.list" :fit="true">
              <el-table-column prop="id" label="序号" min-width="50"></el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="140"></el-table-column>
              <el-table-column prop="content" label="内容" min-width="200">
                <template slot-scope="scope">
                  <div v-html="scope.row.content"></div>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click.native.prevent="spreadDetail(scope.$index)"> 详情
                  </el-button>
                  <ms-confirm-button title="删除" @confirm="deleteSpreadRow(scope.$index)">
                    <p>您确定要删除推广记录为<code>{{scope.row.id}}</code>吗？</p>
                  </ms-confirm-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              layout="total, sizes,prev, pager, next,jumper"
              :current-page.sync="row.orientation.log.pagination.page"
              :total="row.orientation.log.pagination.totalRow"
              :page-size="row.orientation.log.pagination.pageSize"
              :page-sizes="row.orientation.log.pagination.pageSizes"
              @size-change="handleLogSizeChange"
              @current-change="handleLogCurrentChange"></el-pagination>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ms-slide>
    <ms-slide
      :title="'推广方向记录详情'"
      :width="500"
      @close="closeSlidesModify()"
      ref="slideSpreadLogDetail"
      :data="table.detail">
      <el-form class="form" label-width="120px" size="small" :model="table.detail">
        <el-form-item label="推广时间" prop="popularizeTime">
          <el-input v-model="table.detail.popularizeTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="推广地域" prop="popularizeArea">
          <el-input v-model="table.detail.popularizeArea" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="排除地域" prop="excludeArea">
          <el-input v-model="table.detail.excludeArea" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="成单来访词" prop="benefitKeyword">
          <el-input v-model="table.detail.benefitKeyword" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="推广方向" prop="content">
          <el-input v-model="table.detail.content" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="重大更改" prop="greatChange">
          <el-input v-model="table.detail.greatChange" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      :title="row.edit.enabled ? '编辑客户项目' : '新增客户项目'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          label="所属客户"
          prop="customerId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select
            v-model="row.form.customerId"
            filterable
            remote
            placeholder="请输入关键字"
            :remote-method="customerLikeness"
            :loading="remote.customer.loading">
            <el-option
              v-for="customer in remote.customer.list" :key="customer.id"
              :label="customer.title"
              :value="customer.id"
              :disabled="customer.status === 0"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="客户销售经理"
          prop="saler"
          :disabled="true">
          <el-input v-model="row.form.saler" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item
          label="项目名称"
          prop="title"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-input v-model="row.form.title" placeholder="20个字符以内"></el-input>
        </el-form-item>
        <el-form-item
          label="销售经理"
          prop="salerId"
          :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.salerId" placeholder="请选择">
            <el-option v-for="salerName in this.table.salerList" :label="salerName.name" :key="salerName.id"
                       :value="salerName.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!row.edit.enabled"
          label="客户预算"
          prop="budget">
          <el-input v-model="row.form.budget" placeholder="销售提供的客户项目预算"></el-input>
        </el-form-item>

        <el-form-item
          label="客户专员"
          prop="serverId"
          :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.serverId" placeholder="请选择">
            <el-option
              v-for="serverName in this.table.serverList"
              :label="serverName.name"
              :value="serverName.id"
              :key="serverName.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="官网" prop="website">
          <el-input v-model="row.form.website" placeholder="含http://"></el-input>
        </el-form-item>

        <el-form-item label="所在地" prop="address">
          <el-input v-model="row.form.address" placeholder="20个字符以内"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide style="z-index: 5;" title="跟进客户" :width="800" @close="closeSlide()" ref="slideTrailWay">
      <div>
        该客户<code>{{row.form.customerTitle}}</code>的项目有：
        <template v-for="item in items">
          <el-tag v-if="item.id === row.form.id">{{item.title}}</el-tag>
          <el-tag v-else type="info">{{item.title}}</el-tag>
        </template>
      </div>
      <hr>
      <el-tabs v-model="row.tracking.activeTabName" @tab-click="tackingTabChange">
        <el-tab-pane label="跟进记录" name="trackingLog">
          <el-table size="small" stripe border :data="row.tracking.log.list" :fit="true">
            <el-table-column prop="trailTime" label="跟进时间" min-width="140" fixed></el-table-column>
            <el-table-column prop="trailWay" label="跟进方式" min-width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.trailWay === 1">电话</span>
                <span v-else-if="scope.row.trailWay === 2">微信</span>
                <span v-else-if="scope.row.trailWay === 3">QQ</span>
                <span v-else-if="scope.row.trailWay === 4">拜访</span>
                <span v-else-if="scope.row.trailWay === 5">短信</span>
                <span v-else-if="scope.row.trailWay === 6">邮件</span>
                <span v-else>未知</span>
              </template>
            </el-table-column>
            <el-table-column prop="trailerName" label="跟进人" min-width="60"></el-table-column>
            <el-table-column prop="trailContent" label="跟进内容" min-width="200"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="editTrackingLog(scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="moreLog()">加载更多</el-button>
        </el-tab-pane>
        <el-tab-pane label="添加跟进" name="tracking">
          <el-form class="form" label-width="120px" size="small" :model="row.tracking.log.form" ref="formTracking">
            <el-form-item label="跟进方式" prop="trailWay" :rules="[{required: true, message: '请填写'}]">
              <el-select v-model="row.tracking.log.form.trailWay">
                <el-option label="电话" :value="1"></el-option>
                <el-option label="微信" :value="2"></el-option>
                <el-option label="qq" :value="3"></el-option>
                <el-option label="拜访" :value="4"></el-option>
                <el-option label="短信" :value="5"></el-option>
                <el-option label="邮件" :value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跟进内容" prop="trailContent" :rules="[{required: true, message: '请填写'}]">
              <ms-editor v-model="row.tracking.log.form.trailContent" :textId="'trailContent'"></ms-editor>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitTracking">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="contactList">
          <el-button type="primary" size="small" @click="addContact()">新增联系人</el-button>
          <el-table size="small" stripe border :data="this.row.tracking.contact.list" :fit="true">
            <el-table-column prop="id" label="ID" min-width="40" fixed></el-table-column>
            <el-table-column label="是否默认" min-width="70">
              <template slot-scope="scope">
                <code v-if="scope.row.acquiescent === 1">默认</code>
                <code v-else>非默认</code>
              </template>
            </el-table-column>
            <el-table-column prop="contacts" label="联系人" min-width="70"></el-table-column>
            <el-table-column prop="duty" label="职务" min-width="60"></el-table-column>
            <el-table-column prop="mobile" label="手机" min-width="100"></el-table-column>
            <el-table-column prop="phone" label="电话" min-width="100"></el-table-column>
            <el-table-column prop="qq" label="qq" min-width="100"></el-table-column>
            <el-table-column prop="wechat" label="微信" min-width="100"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="editContact(scope.$index)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="row.tracking.contact.show">
            <h3 v-if="row.tracking.contact.edit.enabled">编辑联系人</h3>
            <h3 v-else>添加联系人</h3>
            <el-form class="form" label-width="120px" size="small" :model="row.tracking.contact.form" ref="formContact">
              <el-form-item label="联系人" prop="contacts" :rules="[{required: true, message: '请填写'}]">
                <el-input v-model="row.tracking.contact.form.contacts"></el-input>
              </el-form-item>
              <el-form-item label="职务" prop="duty" :rules="[{required: true, message: '请填写'}]">
                <el-input v-model="row.tracking.contact.form.duty"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile" :rules="[{required: true, message: '请填写'}]">
                <el-input v-model="row.tracking.contact.form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="是否默认" prop="acquiescent" :rules="[{required: true, message: '请填写'}]">
                <el-select v-model="row.tracking.contact.form.acquiescent">
                  <el-option label="非默认" :value="0"></el-option>
                  <el-option label="默认 " :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="row.tracking.contact.form.phone"></el-input>
              </el-form-item>
              <el-form-item label="qq" prop="qq">
                <el-input v-model="row.tracking.contact.form.qq"></el-input>
              </el-form-item>
              <el-form-item label="微信" prop="wechat">
                <el-input v-model="row.tracking.contact.form.wechat"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="row.tracking.contact.form.email"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="row.tracking.contact.form.address"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitContact">提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </ms-slide>

    <el-table
      v-loading="table.loading"

      size="small" stripe border
      :data="this.table.list"
      :fit="true">
      {{table.list}}
      <el-table-column prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column prop="title" label="项目名称" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=2)">{{scope.row.title}}</a>
          <template v-if="scope.row.website.length >= 7">
            <a v-if="scope.row.website.indexOf('http://')== 0 || scope.row.website.indexOf('https://')== 0 "
               :href="scope.row.website" target="_blank">官网 &gt;</a>
            <a v-else :href="'http://' + scope.row.website" target="_blank">官网 &gt;</a>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.customerTitle, index=1)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerGenre" label="客户类型" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.customerGenre === 1" class="ms-success">销售客户</span>
          <span v-else-if="scope.row.customerGenre === 2" class="ms-danger">渠道客户</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="所属行业" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a>
          <template v-if="scope.row.toolEnabled && scope.row.status === 1">
            <ms-confirm-button
              title="行业"
              placement="top"
              type="icon"
              icon="pencil-square-o"
              :popover-width="320"
              @confirm="modifyIndustryRow(scope.$index)">
              <el-form label-position="left" label-width="100px" :model="remote">

                <el-form-item
                  label="项目名称"
                  prop="title">
                  <el-input v-model="scope.row.title" size="small" placeholder="请输入内容" :disabled="true">
                  </el-input>
                </el-form-item>
                <el-form-item label="所属行业" prop="industryId" :rules="[{required: true, message: '必填'}]">
                  <el-select v-model="remote.industryId" filterable remote placeholder="请输入关键字"
                             :remote-method="industryLikeness" :loading="remote.industry.loading">
                    <el-option-group v-for="(value, key) in remote.industry.data" :key="key" :label="key">
                      <el-option v-for="industry in value" :key="industry.id" :label="industry.title"
                                 :value="industry.id"></el-option>
                    </el-option-group>

                  </el-select>
                </el-form-item>
              </el-form>
            </ms-confirm-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="saler" label="销售经理" min-width="100"></el-table-column>
      <el-table-column prop="server" label="客户专员" min-width="100"></el-table-column>
      <el-table-column prop="budget" label="预算(元)" min-width="100" :formatter="formatMoney" align="right">
        <template slot-scope="scope">
          {{scope.row.budget}}
          <template v-if="scope.row.toolEnabled && scope.row.status === 1">
            <ms-confirm-button
              title="改预算"
              type="icon"
              icon="pencil-square-o"
              :popover-width="420"
              @confirm="modifyssBudget(scope.$index)">
              <el-form label-position="left" label-width="100px" :model="row">
                <el-form-item label="原预算" prop="budget">
                  <el-input v-model="scope.row.budget" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="现预算" prop="nowBudget">
                  <el-input v-model="row.nowBudget" placeholder="请填写"></el-input>
                </el-form-item>

                <el-form-item label="原因" prop="reason">
                  <el-input v-model="row.reason" placeholder="请认真填写"></el-input>
                </el-form-item>
              </el-form>
            </ms-confirm-button>
          </template>

          <template v-if="scope.row.toolEnabled">
            <el-popover
              ref="popover"
              placement="right"
              width="800"
              trigger="click">
              <template>
                <el-table size="small" stripe border :data="row.budget.log.list" :fit="true">
                  <el-table-column prop="id" label="序号"></el-table-column>

                  <el-table-column prop="beforeBudget" label="变更前预算"></el-table-column>
                  <el-table-column prop="budget" label="改后点数"></el-table-column>
                  <el-table-column prop="publishTime" label="操作时间"></el-table-column>
                  <el-table-column prop="reason" label="原因"></el-table-column>
                </el-table>
                <el-pagination
                  class="pagination"
                  layout="total, sizes, prev, pager, next, jumper"
                  :current-page.sync="row.budget.log.pagination.page"
                  :total="row.budget.log.pagination.totalRow"
                  :page-size="row.budget.log.pagination.pageSize"
                  :page-sizes="row.budget.log.pagination.pageSizes"
                  @size-change="handleBudgetSizeChange"
                  @current-change="handleBudgetCurrentChange"/>
              </template>
            </el-popover>
            <el-tooltip slot="reference" content="预算记录">
              <el-button v-popover:popover type="text" @click="showBudgetLogHistory(scope.row.id)">
                <icon name="list-ol" class="ms-icon-btn"/>
              </el-button>
            </el-tooltip>
          </template>

        </template>
      </el-table-column>
      <el-table-column prop="money" label="余额(元)" :formatter="formatMoney" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="address" label="所在地" min-width="80"></el-table-column>
      <el-table-column prop="createTime" label="建立时间" min-width="140"></el-table-column>
      <el-table-column prop="itemSurveyId" label="是否填写问卷" min-width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.itemSurveyId ===0 || scope.row.itemSurveyId === undefined" class="ms-success">未填写</span>
          <span v-else-if="scope.row.itemSurveyId !== 0 && scope.row.itemSurveyId !== undefined" class="ms-danger">已填写</span>
          <span v-else class="ms-gray">未知</span>
          <template v-if="scope.row.toolEnabled ">
            <el-tooltip placement="bottom">
              <div slot="content">客户问卷</div>
              <span class="" style="display: inline-block; color:#66b1ff; cursor: pointer" >
                <icon name="address-book"  @click.native.prevent="showSurveySlide(scope.$index),showSurvey(scope.$index)"></icon>
              </span>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="orientationId" label="推广方向" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.orientationId === 0" class="ms-danger">未制定</span>
          <span v-else-if="scope.row.orientationId !== 0" class="ms-success">已制定</span>
          <span v-else class="ms-gray">未知</span>
          <template v-if="scope.row.toolEnabled">
            <el-tooltip placement="bottom">
              <div slot="content">推广方向</div>
              <span class="" style="display: inline-block; color:#66b1ff">
                <icon name="exchange" @click.native.prevent="showOrientation(scope.$index)" style="cursor: pointer"></icon>
              </span>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">上稿中</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else-if="scope.row.status === -1" class="ms-gray">已下稿</span>
          <span v-else-if="scope.row.status === -2" class="ms-gray">暂停</span>
          <span v-else-if="scope.row.status === -3" class="ms-gray">下稿申请中</span>
          <span v-else-if="scope.row.status === -4" class="ms-gray">暂停申请中</span>
          <span v-else-if="scope.row.status === -5" class="ms-gray">无效申请中</span>
          <span v-else class="ms-gray">未知</span>
          <ms-confirm-button v-if="scope.row.status === 1" type="icon" title="下稿" icon="arrow-circle-down"
                             :popover-width="320" @confirm="modifyStatus(scope.$index, -3)">
            <el-form :model="scope.row.statusForm">
              <el-form-item label="申请理由(申请理由不能为空)">
                <el-input type="textarea" placeholder="请输入申请理由" :rows="2" v-model="row.statusForm.reason"></el-input>
              </el-form-item>
            </el-form>
          </ms-confirm-button>
          <ms-confirm-button v-if="scope.row.status !== 1 && scope.row.status > -3" title="上稿" type="icon"
                             icon="arrow-circle-up" @confirm="modifyStatus(scope.$index, 1)">
            <p>确定要上稿吗？</p>
          </ms-confirm-button>
          <ms-confirm-button v-if="scope.row.status === 1" type="icon" title="暂停" icon="pause-circle"
                             :popover-width="320" @confirm="modifyStatus(scope.$index, -4)">
            <el-form :model="scope.row.statusForm">
              <el-form-item label="申请理由(申请理由不能为空)">
                <el-input type="textarea" placeholder="请输入申请理由" :rows="2" v-model="row.statusForm.reason"></el-input>
              </el-form-item>
            </el-form>
          </ms-confirm-button>
          <ms-confirm-button v-if="scope.row.status === 1" type="icon" title="无效" icon="times-circle"
                             :popover-width="320" @confirm="modifyStatus(scope.$index, -5)">
            <el-form :model="scope.row.statusForm">
              <el-form-item label="申请理由(申请理由不能为空)">
                <el-input type="textarea" placeholder="请输入申请理由" :rows="2" v-model="row.statusForm.reason"></el-input>
              </el-form-item>
            </el-form>
          </ms-confirm-button>
        </template>
      </el-table-column>
      <el-table-column label="修改" min-width="140">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status != -1" type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button v-if="scope.row.status != -1" type="text" size="small" @click.native.prevent="TrayWayRow(scope.$index)">跟进</el-button>&nbsp;
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除<code>id = {{scope.row.id}}</code>的客户项目吗？</p>
          </ms-confirm-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="table.pagination.page"
      :total="table.pagination.totalRow"
      :page-size="table.pagination.pageSize"
      :page-sizes="table.pagination.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import MsEditor from '@/components/common/Editor.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import ResponseParse from '@/utils/response-parse'
  import {FormArgument, SEARCH_CONDITION} from '@/models/platform/customer-item'
  import {Remote} from '@/models/platform/customer-user'
  import Api from '@/api/platform/customer-item'
  import ItemIndustryApi from '@/api/platform/item-industry'
  import ItemApi from '@/api/platform/item'
  import OrientationApi from '@/api/platform/item-orientation'
  import customerApi from '@/api/platform/customer'
  import ContactApi from '@/api/platform/customer-contact'
  import TrackingLogApi from '@/api/platform/customer-tracking-log'
  import {OrientationFormentArgument} from '@/models/platform/item-orientation'
  import {TrackingLogFormArgument} from '@/models/platform/customer-tracking-log'

  export default {
    components: {
      MsEditor,
      MsSearch,
      MsSlide,
      MsConfirmButton
    },
    data () {
      return {
        isShow: false,
        search: {
          list: [],
          condition: {}
        },
        table: {
          loading: true,
          list: [],
          pagination: {},
          salerList: [],
          serverList: [],
          detail: {},
          itemIndustry: []
        },
        row: {
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          orientationForm: new OrientationFormentArgument(),
          orientation: {
            log: {
              list: [],
              pagination: {}
            },
            activeName: 'orientation'
          },
          budget: {
            log: {
              list: [],
              pagination: {},
              search: {
                id: ''
              }
            },
            budgetList: 'updateBudget'
          },
          tracking: {
            activeTabName: 'trackingLog',
            log: {
              list: [],
              form: new TrackingLogFormArgument(),
              edit: {
                enabled: false,
                index: 0
              },
              page: 0
            },
            contact: {
              list: [],
              form: {},
              edit: {
                enabled: false,
                index: 0
              },
              show: false
            }
          },
          nowBudget: '',
          reason: '',
          statusForm: {}
        },
        remote: new Remote(),
        items: []
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.list = []
      this.table.salerList = []
      this.table.serverList = []
      this.requestList()
    },
//    mounted: function () {
//      this.$nextTick(function () {
//        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//      })
//    },
    methods: {
      ShowBtn (status) {
        if (status === -1) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      },
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
//      calculatedHeight () {
//        this.$nextTick(function () {
//          this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//        })
//      },
      requestList () {
        this.table.loading = true
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            body.forEach(item => {
              item.toolEnabled = true
            })
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
        })
        // 获取客服专员
        Api.serverList(response => {
          let status = response.status || 0
          let body = response.data.map.salesman || []
          let body1 = response.data.map.server || []
          if (status === 200 || status === 204) {
            this.table.salerList = body
            this.table.serverList = body1
          } else {
            this.table.serverList = []
          }
        })
      },
      industryLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.industry.data = {}
          return
        }

        this.remote.industry.loading = true
        ItemIndustryApi.likeness({title: query}, response => {
          let status = response.status || 0
          let body = response.data.map || {}
          if (status >= 200 && status <= 204) {
            this.remote.industry.data = body
          }
          this.remote.industry.loading = false
        })
      },
      handleSizeChange (val) {
        this.table.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.table.pagination.page = val
        this.requestList()
      },
      customerLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.customer.list = []
          return
        }
        this.remote.customer.loading = true
        const search = {title: query, pageSize: 100}
        customerApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.customer.list = body
          }
          this.remote.customer.loading = false
        })
      },
      isShowBtn (status) {
        if (status === -1) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      },
      showSurvey (index) {
        this.row.form = Object.assign({}, {itemId: this.table.list[index].id})
        this.isShowBtn(this.table.list[index].status)
        ItemApi.getSurvey({id: this.row.form.itemId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            if (body.map.survey !== undefined) {
              this.row.form = body.map.survey
            }
          }
        })

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })

        this.showSlide('slideSurvey')
      },
      showSurveySlide (index) {
        this.row.form = this.table.list[index]
        this.$refs['slideSurvey'].show()
      },
      submit () {
        this.$refs['formSurvey'].validate((valid) => {
          if (valid) {
            ItemApi.addSurvey({id: this.row.form.itemId, form: this.row.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                this.$message.success('问卷提交成功')
              } else {
                this.$message.error(body.error || '问卷提交失败')
              }
            })
            // 关闭
            this.$refs['slideSurvey'].close()
          }
        })
      },
      // 跟进记录
      TrayWayRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])

        ItemApi.listValidItem({id: this.row.form.customerId}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.items = body
          } else {
            this.items = []
          }
        })

        this.row.tracking.log.page = 0
        this.moreLog()

        this.showSlide('slideTrailWay')
      },
      moreLog () {
        ItemApi.listTrackingLog({id: this.row.form.id, page: ++this.row.tracking.log.page}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            if (this.row.tracking.log.list.length === 0) {
              this.row.tracking.log.list = body
            } else {
              body.forEach(item => {
                this.row.tracking.log.list.push(item)
              })
            }
          }
        })
      },
      tackingTabChange (tab) {
        if (tab.name === 'contactList') {
          this.getContactList()
          this.row.tracking.contact.show = false
        }
        if (tab.name === 'tracking') {
          this.row.tracking.log.form = {}
          this.row.tracking.log.edit.enabled = false
        }
      },
      editTrackingLog (index) {
        this.row.tracking.log.edit.index = index
        this.row.tracking.log.edit.enabled = true
        this.row.tracking.log.form = this.row.tracking.log.list[index]
        this.row.tracking.activeTabName = 'tracking'
      },
      submitTracking () {
        this.$refs['formTracking'].validate((valid) => {
          if (valid) {
            if (this.row.tracking.log.edit.enabled) {
              TrackingLogApi.modify({
                id: this.row.tracking.log.form.id,
                form: this.row.tracking.log.form
              }, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  let index = this.row.tracking.log.edit.index
                  let data = Object.assign({}, this.row.tracking.log.list[index], body)

                  this.row.tracking.log.list.splice(index, 1, data)
                  this.$message.success(body.success || '修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
                this.row.tracking.activeTabName = 'trackingLog'
              })
            } else {
              ItemApi.addTrackingLog({id: this.row.form.id, form: this.row.tracking.log.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  // 新数据加到数组开头
                  this.row.tracking.log.list.unshift(body)
                  this.$message.success(body.success || '新增成功')
                } else {
                  this.$message.error(body.error || '新增失败')
                }
                this.row.tracking.activeTabName = 'trackingLog'
              })
            }
          }
        })
      },
      // 获取联系人列表
      getContactList () {
        ContactApi.list({search: {customerId: this.row.form.customerId}}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.row.tracking.contact.list = body
          } else {
            this.row.tracking.contact.list = []
          }
        })
      },
      modifyIndustryRow (index) {
        // 将新值赋值给rate
        const item = this.table.list[index]
        const params = {id: item.id, industryId: this.remote.industryId}
        Api.modifyIndustry(params, response => {
          let status = response.status || 0
          let body = response.data || []
          let data = item
          if (status >= 200 && status <= 204) {
            item.industry = body.industry
            item.industryId = body.industryId
            data = Object.assign({}, item, body)
            this.$message.success(body.success || '修改成功')
          } else {
            this.$message.error(body.error || '修改失败')
          }
          this.remote.industryId = ''
          this.table.list[index] = data
        })
      },
      // 添加联系人
      addContact () {
        this.row.tracking.contact.edit.enabled = false
        this.row.tracking.contact.form = {}
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.tracking.contact.form.token = body.token || ''
          }
        })
        this.row.tracking.contact.show = true
      },
      // 联系人管理页面
      editContact (index) {
        this.row.tracking.contact.edit.index = index
        this.row.tracking.contact.form = this.row.tracking.contact.list[index]
        this.row.tracking.contact.edit.enabled = true
        this.row.tracking.contact.show = true
      },
      submitContact () {
        this.$refs['formContact'].validate((valid) => {
          if (valid) {
            if (this.row.tracking.contact.edit.enabled) {
              ContactApi.modify({
                id: this.row.tracking.contact.form.id,
                form: this.row.tracking.contact.form
              }, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  let index = this.row.tracking.contact.edit.index
                  let data = Object.assign({}, this.row.tracking.contact.list[index], body)

                  this.row.tracking.contact.list.splice(index, 1, data)
                  this.$message.success(body.success || '修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
                this.row.tracking.contact.show = false
              })
            } else {
              this.row.tracking.contact.form.customerId = this.row.form.customerId
              ContactApi.create({form: this.row.tracking.contact.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  // 新数据加到数组开头
                  this.row.tracking.contact.list.unshift(body)
                  this.$message.success(body.success || '新增成功')
                } else {
                  this.$message.error(body.error || '新增失败')
                }
                this.row.tracking.contact.show = false
              })
            }
          } else {
            return false
          }
        })
      },
      showBudgetLogHistory (id) {
        this.row.budget.log.search.id = id
        this.getBudgetLog()
      },
      getBudgetLog () {
        this.row.budget.log.loading = true
        Api.budgetList({id: this.row.budget.log.search.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.row.budget.log.list = body
            this.row.budget.log.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.budget.log.list = []
          }
          this.row.budget.log.loading = false
        })
      },
      modifyssBudget (index) {
        const item = this.table.list[index]
        const params = {id: item.id, budget: this.row.nowBudget, reason: this.row.reason}
        Api.modifyBudgetWay(params, response => {
          let status = response.status || 0
          let body = response.data || {}
          let data = item
          if (status >= 200 && status <= 204) {
            body.budget = this.row.nowBudget
            data = Object.assign({}, item, body)
            this.$message.success(body.success || '操作成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
          // 重置编辑数据
          this.row.nowBudget = ''
          this.row.reason = ''
          this.table.list[index] = data
        })
      },
      showOrientation (index) {
        this.row.form = Object.assign({}, {itemId: this.table.list[index].id})
        this.isShowBtn(this.table.list[index].status)
        OrientationApi.get({id: this.table.list[index].orientationId}, response => {
          let status = response.status || 0
          let data = response.data || {}
          if (status === 200 || status === 204) {
            data.popularizeTime = data.popularizeTime === undefined ? '' : data.popularizeTime.replace(/<[^>]*>?|[&nbsp;]/g, '')
            data.popularizeArea = data.popularizeArea === undefined ? '' : data.popularizeArea.replace(/<[^>]*>?|[&nbsp;]/g, '')
            data.excludeArea = data.excludeArea === undefined ? '' : data.excludeArea.replace(/<[^>]*>?|[&nbsp;]/g, '')
            data.benefitKeyword = data.benefitKeyword === undefined ? '' : data.benefitKeyword.replace(/<[^>]*>?|[&nbsp;]/g, '')
            data.content = data.content === undefined ? '' : data.content.replace(/<[^>]*>?|[&nbsp;]/g, '')
            data.greatChange = data.greatChange === undefined ? '' : data.greatChange.replace(/<[^>]*>?|[&nbsp;]/g, '')
            this.row.orientationForm = data
          } else {
            this.row.orientationForm = {}
            // 获得 form token
            FormTokenApi.create(response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                this.row.orientationForm.token = body.token || ''
              }
            })
          }
        })

        this.row.orientation.activeName = 'orientation'

        this.showSlide('slideOrientation')
      },
      addOrientation () {
        this.$refs['formOrientation'].validate((valid) => {
          if (valid) {
            this.row.orientationForm.itemId = this.row.form.itemId
            if (this.row.orientationForm.id !== undefined) {
              OrientationApi.update({
                id: this.row.orientationForm.id,
                form: this.row.orientationForm
              }, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  this.$message.success(body.success || '修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              OrientationApi.create({form: this.row.orientationForm}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  const index = this.table.list.findIndex(d => d.id === body.itemId)
                  if (index !== -1) {
                    this.$set(this.table.list[index], 'orientationId', body.orientationId)
                  }
                  this.$message.success(body.success || '添加成功')
                  this.$refs['slideOrientation'].close()
                } else {
                  this.$message.error('添加失败')
                }
              })
            }
          }
        })
      },
      tabChange (tab) {
        if (tab.name === 'orientationLog') {
          this.getOrientation()
        }
      },
      getOrientation () {
        ItemApi.listOrientation({id: this.row.form.itemId}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.row.orientation.log.list = body
            this.row.orientation.log.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.orientation.log.list = []
          }
        })
      },
      addRow () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })
        this.showSlide('slideModifyRow')
      },
      editRow (index) {
        const rows = this.table.list.slice(index, index + 1)
        this.row.form = Object.assign({}, rows[0])
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              Api.modify({id: this.row.form.id, form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  let index = this.row.edit.index
                  let data = Object.assign({}, this.table.list[index], body)

                  this.table.list.splice(index, 1, data)

                  // 关闭
                  this.$refs['slideModifyRow'].close()
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  this.table.list.forEach(item => {
                    if (body.customerId === item.customerId) {
                      body.toolEnabled = item.toolEnabled
                    }
                  })
                  this.remote.customer.list.forEach(item => {
                    if (body.customerId === item.id) {
                      body.customerTitle = item.title
                    }
                  })
                  // 新数据加到数组开头
                  this.table.list.unshift(body)
                  // 关闭
                  this.$refs['slideModifyRow'].close()
                } else {
                  this.$message.error(body.error || '新增失败')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      modifyStatus (index, status) {
        const id = this.table.list[index].id
        if (status !== 1) {
          if (this.row.statusForm.reason === '' || this.row.statusForm.reason === null ||
            this.row.statusForm.reason === undefined) {
            return this.$message.error('内容不能为空 ！! !')
          }
        } else {
          this.row.statusForm.reason = '同意上稿'
        }
        Api.modifyStatus({id: id, status: status, reason: this.row.statusForm.reason}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)
            this.$message.success(body.success || '操作成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
        this.row.statusForm = {}
      },
      deleteRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
            this.$message.success(body.success || '删除成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      // 获取推广词详情
      spreadDetail (index) {
        OrientationApi.get({id: this.row.orientation.log.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            body.popularizeTime = body.popularizeTime === undefined ? '' : body.popularizeTime.replace(/<[^>]*>?|[&nbsp;]/g, '')
            body.popularizeArea = body.popularizeArea === undefined ? '' : body.popularizeArea.replace(/<[^>]*>?|[&nbsp;]/g, '')
            body.excludeArea = body.excludeArea === undefined ? '' : body.excludeArea.replace(/<[^>]*>?|[&nbsp;]/g, '')
            body.benefitKeyword = body.benefitKeyword === undefined ? '' : body.benefitKeyword.replace(/<[^>]*>?|[&nbsp;]/g, '')
            body.content = body.content === undefined ? '' : body.content.replace(/<[^>]*>?|[&nbsp;]/g, '')
            body.greatChange = body.greatChange === undefined ? '' : body.greatChange.replace(/<[^>]*>?|[&nbsp;]/g, '')
            this.table.detail = body
            this.showSlide('slideSpreadLogDetail')
            this.$refs['slideOrientation'].close()
          } else {
            this.table.detail = {}
            this.$message.error(body.error || '获取失败')
          }
        })
      },
      // 删除推广词
      deleteSpreadRow (index) {
        OrientationApi.delete({id: this.row.orientation.log.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.orientation.log.list.splice(index, 1)
            this.$message.success(body.success || '删除成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.row.orientation.activeName = 'orientation'

        this.row.tracking.activeTabName = 'trackingLog'
        this.row.tracking.log.list = []
        this.row.tracking.log.page = 0
        this.row.tracking.contact.list = []
        this.row.tracking.contact.show = false
      },
      updateConditions (conditions) {
        this.row.orientation.log.pagination.page = 1
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      handleBudgetSizeChange (val) {
        this.row.budget.log.pagination.pageSize = val
        this.getBudgetLog()
      },
      handleBudgetCurrentChange (val) {
        this.row.budget.log.pagination.page = val
        this.BudgetHistory()
      },
      closeWaySlide () {
        this.row.orientation.log.page = 0
      },
      closeSlideModify () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      },
      closeSlidesModify () {
        this.row.edit.enabled = false
        this.row.edit.index = 0
        this.showSlide('slideOrientation')
      },
      formatMoney (row, column) {
        return parseFloat(row[column.property]).toFixed(2)
      },
      handleLogSizeChange (val) {
        this.row.orientation.log.pageSize = val
        this.getOrientation()
      },
      handleLogCurrentChange (val) {
        this.row.orientation.log.page = val
        this.getOrientation()
      }
    }
  }
</script>
