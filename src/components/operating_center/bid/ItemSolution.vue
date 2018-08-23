<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目方案</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click.native.prevent="addRow()">新增</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      title="推广页"
      :width="900"
      align="left"
      ref="slideSiteRow">
      <el-button type="primary" @click.native.prevent="addSite()">新增推广页</el-button>
      <router-link
        v-if="row.option.id > 0"
        :to="{name: 'itemSolutionPageDesign', params:{id: row.option.id}}">
        <el-button type="warning">切图</el-button>
      </router-link>
      <el-table
        v-loading="row.site.loading"
        size="small" stripe border
        :data="row.site.list"
        :fit="true">
        <el-table-column prop="pageUrl" label="页面URL" min-width="180">
          <template slot-scope="scope">
            <a v-if="scope.row.pageUrl === undefined"></a>
            <a v-else-if="scope.row.pageUrl.indexOf('http://')== 0 || scope.row.pageUrl.indexOf('https://')== 0 "
               :href="scope.row.pageUrl" target="_blank">{{scope.row.pageUrl}}</a>
            <a v-else :href="'http://' + scope.row.website" target="_blank">{{scope.row.pageUrl}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="pageStatus" label="页面类型" min-width="80">
          <template slot-scope="scope">
            <ms-device :client-id="scope.row.pageType"/>
          </template>
        </el-table-column>
        <el-table-column prop="pageStatus" label="页面状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.pageStatus === 0">无法访问</span>
            <span v-else-if="scope.row.pageStatus === 1">正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="kf53Status" label="53客服状态" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.kf53Status === 0">未使用</span>
            <span v-else-if="scope.row.kf53Status === 1">已使用</span>
          </template>
        </el-table-column>
        <el-table-column prop="feedbackStatus" label="留言板状态" min-width="70">
          <template slot-scope="scope">
            <span v-if="scope.row.feedbackStatus === 0">未使用</span>
            <span v-else-if="scope.row.feedbackStatus === 1">已使用</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="140"></el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="editSite(scope.$index)"> 编辑
            </el-button>
            <ms-confirm-button title="删除" @confirm="deleteSite(scope.$index)">
              <p>你确定要删除该推广页吗？</p>
            </ms-confirm-button>
            <el-button type="text" size="small" @click.native.prevent="check(scope.$index)"> 检查 </el-button>
            <el-button type="text" size="small" @click.native.prevent="feedbackCheck(scope.$index)"> 留言板检查
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="row.site.pagination.page"
        :total="row.site.pagination.totalRow"
        :page-size="row.site.pagination.pageSize"
        :page-sizes="row.site.pagination.pageSizes"
        @size-change="handleSiteSizeChange"
        @current-change="handleSiteCurrentChange"/>
    </ms-slide>

    <ms-slide
      :title="row.edit.enabled ? '编辑项目方案' : '新增项目方案'"
      :width="500"
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
            :loading="remote.customer.loading"
            @change="customerChange">
            <el-option
              v-for="customer in remote.customer.list" :key="customer.id"
              :label="customer.title"
              :value="customer.id"
              :disabled="customer.status === 0"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="项目名称"
          prop="itemId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select
            v-model="row.form.itemId"
            :placeholder="row.form.customerId > 0 ? '请选择' : '请先选择所属客户'"
            :disabled="row.form.customerId === undefined || row.form.customerId <= 0">
            <el-option
              v-for="item in remote.item.list" :key="item.id"
              :label="item.title"
              :value="item.id"
              :disabled="item.status === 0"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推广平台"
          prop="platformId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.platformId" @change="platformChange">
            <el-option
              v-for="platform in platforms" :key="platform.id"
              :label="platform.title"
              :value="platform.id"
              :disabled="platform.status === 0"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推广渠道"
          prop="channelId"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-select
            v-model="row.form.channelId"
            :placeholder="row.form.platformId > 0 ? '请选择' : '请先选择所属平台'"
            :disabled="row.form.platformId === undefined || row.form.platformId <= 0">
            <el-option
              v-for="channel in remote.channel.list" :key="channel.id"
              :label="channel.title"
              :value="channel.id"
              :disabled="channel.status === 0"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推广账户"
          prop="accountId"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-select
            v-model="row.form.accountId"
            filterable
            remote
            :placeholder="row.form.platformId > 0 ? '请输入关键字' : '请先选择所属平台'"
            :disabled="row.form.platformId === undefined || row.form.platformId <= 0"
            :remote-method="accountLikeness"
            :loading="remote.account.loading">
            <el-option
              v-for="account in remote.account.list" :key="account.id"
              :label="account.name"
              :value="account.id"
              :disabled="account.status === 0"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="推广设备"
          prop="clientId"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-select v-model="row.form.clientId">
            <el-option label="综合" :value="0"/>
            <el-option label="PC端" :value="1"/>
            <el-option label="手机" :value="2"/>
            <el-option label="APP" :value="3" disabled/>
          </el-select>
        </el-form-item>
        <hr/>
        <el-form-item
          label="推广页面"
          prop="pageUrl">
          <el-input v-model="row.form.pageUrl" placeholder="须以 http[s]:// 开头"/>
        </el-form-item>
        <el-form-item
          label="页面类型"
          prop="pageType">
          <el-select v-model="row.form.pageType">
            <el-option label="综合" :value="0"/>
            <el-option label="手机" :value="1"/>
            <el-option label="PC端" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="53客服"
          prop="kf53Status">
          <el-select v-model="row.form.kf53Status">
            <el-option label="不使用" :value="0"/>
            <el-option label="使用" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="留言板"
          prop="feedbackStatus">
          <el-select v-model="row.form.feedbackStatus">
            <el-option label="无留言板" :value="0"/>
            <el-option label="有留言板" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click.native.prevent="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="留言板代码" :width="500" ref="slideFeedbackCode">
      <template>
        <el-tabs v-model="row.feedbackCode.activeTabName" class="ms-feedback-code">
          <el-tab-pane label="推广页留言板" name="first">
            <el-select v-model="row.feedbackCode.style" placeholder="请选择" @change="feedbackStyleChange">
              <el-option-group v-for="group in feedbackStyle" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.list" :key="item.value"
                  :label="item.title"
                  :value="item.value"
                  :disabled="item.status === 0"/>
              </el-option-group>
            </el-select>
            <img class="ms-feedback-code-thumb" :src="row.feedbackCode.styleThumb"/>
            <el-input v-model="row.feedbackCode.code.core" type="textarea" :rows="5"/>
            <el-input v-model="row.feedbackCode.code.show" type="textarea" :rows="3"/>
          </el-tab-pane>
          <el-tab-pane label="自定义留言板" name="second">
            <p class="explain-title">说明</p>
            <p class="explain-list">采用自主设计页面的形式提交留言</p>
            <p class="explain-title list-bottom">使用方法</p>
            <ol class="explain-list">
              <li>
                <p>
                  在<strong>项目页面通用头部（即：主页和所有子页面）</strong>的
                  <code>&lt;/head&gt;</code> 标签结束前，嵌入以下异步加载代码：
                </p>
                <p>
                  <el-input class="custom-code" v-model="row.feedbackCode.code.code" type="textarea" :rows="5"/>
                </p>
              </li>
              <li>
                下载 API 文档给前端工程师
                <a href="http://localhost:8080/docs/custom-feedback-code-documentation.html" target="_blank">
                  API文档下载
                </a>
              </li>
            </ol>
          </el-tab-pane>
          <el-tab-pane label="代码审查" name="third">
            <p class="examine-title">检查推广页面是否正确安装留言板代码，按以下步骤检查</p>
            <ol class="examine-list">
              <li>检查<code>留言板所在页面</code>是否添加【核心代码】</li>
              <li>检查<code>留言板所在页面</code>添加的【核心代码】是否正确</li>
              <li>检查<code>留言板所在页面</code>是否添加【显示代码】</li>
              <li>如果有其他页面，检查<code>其他页面</code>是否添加【核心代码】</li>
              <li>检查<code>其他页面</code>添加的【核心代码】是否正确</li>
            </ol>
            <p class="examine-title">请填入相关参数</p>
            <div class="examine-list">
              <p class="control-label">推广页面留言板所在URL：</p>
              <div class="inputBox">
                <el-input v-model="pageUrl" placeholder="http://"></el-input>
              </div>
              <el-button :loading="pageReviewLoading" size="mini" type="primary" @click.native.prevent="pageReview">审查</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="说明" name="fourth">
            <ol class="explain-list">
              <li>在留言页面使用<code>Qudao51.Tester</code>作为联系人，系统将自动标为<strong>测试留言</strong>；</li>
              <li>客服专员可在内部后台查看<strong>测试留言</strong>的详细内容；</li>
              <li>非测试留言的内容仅客户后台可以查看，内部后台仅显示ID；</li>
              <li><strong>测试留言</strong>不在客户后台显示；</li>
              <li><strong>测试留言</strong>不计入运营数据统计中。</li>
              <li>
                系统留言防刷策略有：
                <ul class="explain-list-tactics">
                  <li>策略一：同IP同手机号，对于所有项目，当天内只记录一条留言</li>
                  <li>策略二：同IP同手机号，对于同项目方案，当天内只记录一条留言</li>
                  <li>策略三：同IP同手机号同用户，对于同项目方案，当天内只记录一条留言<strong class="ms-blue">[当前启用]</strong></li>
                  <li>策略四：同IP同用户，对于同项目方案，当天内只记录一条留言</li>
                </ul>
              </li>
            </ol>
          </el-tab-pane>
        </el-tabs>
      </template>
    </ms-slide>

    <ms-slide title="营运" :width="580" ref="slideOperation">
      <template>
        <el-tabs v-model="row.bidOperation.activeTabName" @tab-click="bidOperationTabChange">
          <el-tab-pane name="orientation">
            <template slot="label">
              推广参考
              <el-badge v-if="row.bidOperation.orientation.handled" is-dot/>
            </template>
            <template v-if="row.bidOperation.orientation.id <= 0">
              未找到相关参考
            </template>
            <template v-else>
              <el-collapse v-loading="row.bidOperation.orientation.loading" v-model="defaultTure">
                <el-collapse-item name="1">
                  <template slot="title">
                    重大更改<el-badge :is-dot="changedFieldIsExist('greatChange')"/>
                  </template>
                  <div v-html="row.bidOperation.orientation.current.greatChange"></div>
                </el-collapse-item>
                <el-collapse-item name="2">
                  <template slot="title">
                    推广时间<el-badge :is-dot="changedFieldIsExist('popularizeTime')"/>
                  </template>
                  <div v-html="row.bidOperation.orientation.current.popularizeTime"></div>
                </el-collapse-item>
                <el-collapse-item name="3">
                  <template slot="title">
                    推广地域<el-badge :is-dot="changedFieldIsExist('popularizeArea')"/>
                  </template>
                  <div v-html="row.bidOperation.orientation.current.popularizeArea"></div>
                </el-collapse-item>
                <el-collapse-item name="4">
                  <template slot="title">
                    排除地域<el-badge :is-dot="changedFieldIsExist('excludeArea')"/>
                  </template>
                  <div v-html="row.bidOperation.orientation.current.excludeArea"></div>
                </el-collapse-item>
                <el-collapse-item name="5">
                  <template slot="title">
                    推广方向<el-badge :is-dot="changedFieldIsExist('content')"/>
                  </template>
                  <div v-html="row.bidOperation.orientation.current.content"></div>
                </el-collapse-item>
                <el-collapse-item name="6">
                  <template slot="title">
                    成单来访词<el-badge :is-dot="changedFieldIsExist('benefitKeyword')"/>
                  </template>
                  <div v-html="row.bidOperation.orientation.current.benefitKeyword"></div>
                </el-collapse-item>
              </el-collapse>
              <p>
                <el-button
                  v-if="row.bidOperation.orientation.handled"
                  type="primary"
                  size="small"
                  @click.native.prevent="setOrientationRead()">设为已读
                </el-button>
                <el-button v-else type="primary" size="small" disabled>已读</el-button>
              </p>
            </template>
          </el-tab-pane>
          <el-tab-pane name="customerFeedback">
            <template slot="label">
              客户反馈
              <el-badge v-if="row.bidOperation.survey.handled" is-dot/>
            </template>
            <el-form class="form" label-width="200px" size="small" :model="row.bidOperation.survey" ref="formSurvey">
              <el-button v-if="row.bidOperation.survey.handled" size="mini" type="primary" plain
                         @click.native.prevent="setSurveyRead">设为已读</el-button>
              <el-button v-else type="primary" size="small" disabled>已读</el-button>
              <h3>一、企业详情</h3>
              <el-form-item label="推广项目名称" prop="itemName">
                <el-input v-model="row.bidOperation.survey.itemName" disabled></el-input>
              </el-form-item>
              <el-form-item label="公司官方网址" prop="webSite">
                <el-input v-model="row.bidOperation.survey.webSite" disabled>
                  <template slot="prepend">Http://</template>
                </el-input>
              </el-form-item>
              <el-form-item label="公司成立时间" prop="regtime">
                <el-input v-model="row.bidOperation.survey.regtime" placeholder="如：2010-12-08" disabled></el-input>
              </el-form-item>
              <el-form-item label="公司旗下品牌" prop="brands">
                <el-input v-model="row.bidOperation.survey.brands" disabled></el-input>
              </el-form-item>
              <el-form-item label="该项目已推广" prop="popularizeTimeSpan">
                <el-input v-model="row.bidOperation.survey.popularizeTimeSpan" placeholder="多长时间" disabled></el-input>
              </el-form-item>
              <el-form-item label="是否有分公司" prop="filiale">
                <el-radio-group v-model="row.bidOperation.survey.filiale" disabled>
                  <el-radio :label="0">没有</el-radio>
                  <el-radio :label="1">有</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分公司所在城市" prop="filialeCitys">
                <el-input v-model="row.bidOperation.survey.filialeCitys" placeholder="多个请以逗号隔开" disabled></el-input>
              </el-form-item>
              <el-form-item label="对外宣传" prop="cooperantShop">
                <el-input v-model="row.bidOperation.survey.cooperantShop" disabled>
                  <template slot="prepend">公司目前有</template>
                  <template slot="append">家加盟店</template>
                </el-input>
              </el-form-item>
              <el-form-item label="项目招商团队" prop="teamPeople">
                <el-input v-model="row.bidOperation.survey.teamPeople" disabled>
                  <template slot="prepend">有</template>
                  <template slot="append">人</template>
                </el-input>
              </el-form-item>
              <el-form-item label="日最低资源数" prop="dailyMinResource">
                <el-input disabled v-model="row.bidOperation.survey.dailyMinResource"></el-input>
              </el-form-item>
              <el-form-item label="是否有完善的在线客服部门" prop="onlineService">
                <el-radio-group v-model="row.bidOperation.survey.onlineService" disabled>
                  <el-radio :label="0">没有</el-radio>
                  <el-radio :label="1">有</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="公司目前的来访百分比大概是" prop="visitingRate">
                <el-input v-model="row.bidOperation.survey.visitingRate" disabled>
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item label="签单百分比大概是" prop="closeRate">
                <el-input v-model="row.bidOperation.survey.closeRate" disabled>
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <h3>二、品牌定位</h3>
              <el-form-item label="项目是做什么的？" prop="productOrientation">
                <el-input v-model="row.bidOperation.survey.productOrientation" disabled></el-input>
              </el-form-item>
              <el-form-item label="项目有哪些产品系列？" prop="products">
                <el-input v-model="row.bidOperation.survey.products" disabled></el-input>
              </el-form-item>
              <el-form-item label="加盟商的男女比例" prop="genderRation">
                <el-input v-model="row.bidOperation.survey.genderRation" placeholder="如：6:4" disabled></el-input>
              </el-form-item>
              <el-form-item label="年龄段主要以" prop="ageSegment">
                <el-input v-model="row.bidOperation.survey.ageSegment" placeholder="如：12-20岁，80后，大学生" disabled>
                  <template slot="append">为主</template>
                </el-input>
              </el-form-item>
              <el-form-item label="核心竞争优势及主要卖点是什么？（比如免加盟费、赠送装修等）" prop="advantage">
                <el-input v-model="row.bidOperation.survey.advantage" placeholder="多个请以逗号隔开" disabled></el-input>
              </el-form-item>
              <el-form-item label="正在使用的招商页面地址" prop="joinWebSite">
                <el-input v-model="row.bidOperation.survey.joinWebSite" disabled>
                  <template slot="prepend">http://</template>
                </el-input>
              </el-form-item>
              <el-form-item label="投资金额">
                <el-input v-model="row.bidOperation.survey.minInvestment" disabled>
                  <template slot="prepend">最低</template>
                  <template slot="append">元</template>
                </el-input>
                <el-input v-model="row.bidOperation.survey.maxInvestment" disabled>
                  <template slot="prepend">最高</template>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>ｓ
              <el-form-item label="更加详细的加盟政策" prop="joinPolicy">
                <el-input disabled v-model="row.bidOperation.survey.joinPolicy" type="textarea" rows="5"></el-input>
              </el-form-item>
              <el-form-item v-if="row.bidOperation.survey.joinPolicy !== undefined" label="更加详细的加盟政策" prop="joinPolicy">
                <el-input v-model="row.bidOperation.survey.joinPolicy" type="textarea" disabled></el-input>
              </el-form-item>
              <el-form-item label="公司主要的竞争对手有哪些？" prop="competitor">
                <el-input v-model="row.bidOperation.survey.competitor" placeholder="多个请以逗号隔开" disabled></el-input>
              </el-form-item>
              <el-form-item label="同行业中，正在使用电视广告或者曾经使用过电视广告的有" prop="tvCompetitor">
                <el-input v-model="row.bidOperation.survey.tvCompetitor" placeholder="多个请以逗号隔开" disabled></el-input>
              </el-form-item>
              <!--<h3>三、对接信息</h3>-->
              <!--<el-form-item label="对接人" prop="contacts">-->
                <!--<el-input v-model="row.bidOperation.survey.contacts" disabled></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="联系手机" prop="mobile">-->
                <!--<el-input v-model="row.bidOperation.survey.mobile" disabled></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="联系QQ" prop="qq">-->
                <!--<el-input v-model="row.bidOperation.survey.qq" disabled></el-input>-->
              <!--</el-form-item>-->
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="bid-work" name="bidWork">
            <template slot="label">
              运营过程
              <el-badge
                v-if="row.bidOperation.operating.handled && isRegulator(row.bidOperation.operating.itemSolutionId)"
                is-dot/>
            </template>
            <template>
              <h3>今日运营过程</h3>
              <p><span class="ms-caution">请务必在每日下班前录入</span>您的运营内容</p>
              <p>
                <ms-editor
                  v-model="row.bidOperation.adjustJob.today.content"
                  upload-category="adjust_job"
                  tool-bar="simple"
                  textId="content"/>
              </p>
              <p>
                <el-button type="primary" size="small" @click.native.prevent="submitTodayAdjustJob()">提交</el-button>
              </p>
            </template>
            <hr/>
            <template>
              <h3>历史运营过程</h3>
              <el-button v-if="row.bidOperation.operating.handled && isRegulator(row.bidOperation.operating.itemSolutionId)" size="mini" type="primary" plain
                         @click.native.prevent="setOperating">标记已读</el-button>
              <el-button v-else type="primary" size="small" disabled>已读</el-button>
              <template v-if="remote.itemSolutionAdjustJob.history[row.bidOperation.bidReview.row.form.itemSolutionId] !== undefined &&
              remote.itemSolutionAdjustJob.history[row.bidOperation.bidReview.row.form.itemSolutionId].length === 0">
                未找到相关参考
              </template>
              <div class="item" v-else v-for="job in remote.itemSolutionAdjustJob.history[row.bidOperation.bidReview.row.form.itemSolutionId]">
                <div class="title">
                  <div class="add-time">{{formatData(job.createTime, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD')}}</div>
                  <a href="javascript:" class="add-user">@{{job.operator}}</a>
                </div>
                <div class="outer-content">
                  <div v-if="job.editContent !== undefined && job.editContent !== ''" class="content" v-html="job.editContent"></div>
                  <div v-else class="content" v-html="job.content"></div>
                </div>
                <div class="approve" v-if="job.replyer !== undefined && job.replyer !== ''">
                  <div class="approve-title">
                    <a href="javascript:" class="approve-user">@{{job.replyer}}</a>于
                    <div class="approve-time">{{job.replyTime}} <span style="color: black;">&nbsp;已审阅</span></div>
                  </div>
                  <div class="approve-content" v-html="job.replyContent"></div>
                </div>
              </div>

              <el-pagination
                v-if="row.bidOperation.adjustJob.history.length > 0"
                class="pagination"
                layout="prev, pager, next"
                :current-page.sync="row.bidOperation.adjustJob.pagination.page"
                :total="row.bidOperation.adjustJob.pagination.totalRow"
                @current-change="moreAdjustJob"/>
            </template>
          </el-tab-pane>
          <el-tab-pane name="bidReview" class="bid-review">
            <template slot="label">
              运营监察
              <el-badge v-if="row.bidOperation.bidReview.row.form.handled && isRegulator(row.bidOperation.bidReview.row.form.itemSolutionId)" is-dot/>
            </template>
            <el-form class="form" label-width="120px" size="small" :model="row.bidOperation.bidReview.row.form"
                     ref="formBidReview">
              <el-form-item label="时间范围" prop="bidDatetime" :rules="[{required: true, message: '必填'}]">
                <el-input v-model="row.bidOperation.bidReview.row.form.bidDatetime"></el-input>
              </el-form-item>
              <el-form-item label="有无更改" prop="changed" :rules="[{required: true, message: '必填'}]">
                <el-select v-model="row.bidOperation.bidReview.row.form.changed" placeholder="请选择">
                  <el-option label="无更改" :value="0"></el-option>
                  <el-option label="有更改" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检查结果" prop="content">
                <el-input v-model="row.bidOperation.bidReview.row.form.content" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click.native.prevent="addBidReview()">
                  {{ row.bidOperation.bidReview.row.type === 'add' ? '提交新增' : '提交编辑' }}
                </el-button>
              </el-form-item>
            </el-form>
            <hr/>
            <template>
              <div class="record">
                <div class="head">监察记录</div>
                <div class="handled">
                  <el-button size="mini" type="success" plain @click.native.prevent="addBidReviewButton">新增</el-button>
                  <el-button v-if="row.bidOperation.bidReview.row.form.handled && isRegulator(row.bidOperation.bidReview.row.form.itemSolutionId)" size="mini" type="primary" plain
                             @click.native.prevent="setBidReviewRead">设为已读</el-button>
                  <el-button v-else type="primary" size="small" disabled>已读</el-button>
                </div>
              </div>

              <div v-if="row.bidOperation.bidReview.history.length === 0">
                未找到相关参考
              </div>
              <div class="item" v-else v-for="(review, index) in row.bidOperation.bidReview.history">
                <div class="head">
                  <div class="time-space">{{review.bidDatetime}}</div>
                  <div class="handle">
                    <div class="handle-edit">
                      <el-button size="mini" type="success" plain
                                 v-if="review.approval !== 1"
                                 @click.native.prevent="editBidReviewButton(index)">编辑</el-button>
                    </div>
                    <div class="handle-approve">
                      <ms-confirm-button
                        title="审批"
                        popover-placement="right"
                        @show="setEditApproval(index)"
                        @confirm="editApproval()">

                        <el-input
                          type="textarea"
                          :rows="2"
                          placeholder="请输入内容"
                          v-model="row.bidOperation.bidReview.row.form.approvalContent">
                        </el-input>
                      </ms-confirm-button>
                    </div>
                  </div>
                </div>
                <div class="title">
                  <a class="user" href="javascript:">@{{review.reviewer}}</a>于
                  <div class="time">{{ formatData(review.publishTime, 'YYYY-MM-DD HH:mm:ss', 'MM-DD HH:mm') }} :</div>
                  <div class="type" v-if="review.changed > 0">有更改</div>
                  <div class="type" v-else>无更改</div>
                </div>
                <div class="content" v-html="review.content"></div>
                <div class="approve" v-if="review.approval === 1">
                  <div class="approve-title">
                    <a href="javascript:" class="approve-user">@{{review.approver}}</a>于
                    <div class="approve-time">{{ formatData(review.approvalTime, 'YYYY-MM-DD HH:mm:ss', 'MM-DD HH:mm') }} :</div>
                  </div>
                  <div class="approve-content" v-html="review.approvalContent"></div>
                </div>
              </div>

              <el-pagination
                v-if="row.bidOperation.bidReview.history.length > 0"
                class="pagination"
                layout="prev, pager, next"
                :current-page.sync="row.bidOperation.bidReview.pagination.page"
                :total="row.bidOperation.bidReview.pagination.totalRow"
                @current-change="getReview"/>
            </template>
          </el-tab-pane>
          <el-tab-pane label="关键词" name="keyword">
            <el-tabs v-model="row.bidOperation.keyword.activeName" @tab-click="keywordTabChange">
              <el-tab-pane name="search" label="查词">
                <el-form class="form" label-width="120px" size="small" :model="row.bidOperation.keyword"
                         ref="formKeyword">
                  <el-form-item label="所属行业" prop="industryId" :rules="[{required: true, message: '必填'}]">
                    <el-select v-model="row.bidOperation.keyword.industryId" filterable remote placeholder="请输入关键字"
                               :remote-method="industryLikeness" :loading="remote.industry.loading">
                      <el-option-group v-for="(value, key) in remote.industry.data" :key="key" :label="key">
                        <el-option v-for="industry in value" :key="industry.id" :label="industry.title"
                                   :value="industry.id"></el-option>
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="平台" prop="platformId" :rules="[{required: true, message: '必填'}]">
                    <el-select v-model="row.bidOperation.keyword.platformId">
                      <el-option v-for="platform in platforms" :key="platform.id" :label="platform.title"
                                 :value="platform.id" :disabled="platform.status ===0">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型" prop="genre" :rules="[{required: true, message: '必填'}]">
                    <el-select v-model="row.bidOperation.keyword.genre">
                      <el-option-group label="推广词">
                        <el-option label="精确词" :value="1"></el-option>
                        <el-option label="精短词" :value="2"></el-option>
                        <el-option label="删除词" :value="3"></el-option>
                        <el-option label="降价词" :value="4"></el-option>
                      </el-option-group>
                      <el-option-group label="否定词">
                        <el-option label="否定词" :value="11"></el-option>
                        <el-option label="精否词" :value="12"></el-option>
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-card>
                      <div slot="header">
                        <span>关键词</span>
                      </div>
                      <div v-for="item in keywordList" :key="item.title">{{item.title}}</div>
                    </el-card>
                    <el-card>
                      <div slot="header">
                        <span>搜索词</span>
                      </div>
                      <div v-for="item in keywordList" :key="item.searchTitle">{{item.searchTitle}}
                      </div>
                    </el-card>
                  </el-form-item>
                  <el-button type="primary" @click.native.prevent="searchKeyword">查询</el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane name="add" label="添加新词">
                <el-form class="form" label-width="120px" size="small" :model="row.bidOperation.keyword"
                         ref="formKeyword">
                  <el-form-item label="所属行业" prop="industryId" :rules="[{required: true, message: '必填'}]">
                    <el-select v-model="row.bidOperation.keyword.industryId" filterable remote placeholder="请输入关键字"
                               :remote-method="industryLikeness" :loading="remote.industry.loading">
                      <el-option-group v-for="(value, key) in remote.industry.data" :key="key" :label="key">
                        <el-option v-for="industry in value" :key="industry.id" :label="industry.title"
                                   :value="industry.id"></el-option>
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="平台" prop="platformId" :rules="[{required: true, message: '必填'}]">
                    <el-select v-model="row.bidOperation.keyword.platformId">
                      <el-option v-for="platform in platforms" :key="platform.id" :label="platform.title"
                                 :value="platform.id" :disabled="platform.status ===0">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="类型" prop="genre" :rules="[{required: true, message: '必填'}]">
                    <el-select v-model="row.bidOperation.keyword.genre">
                      <el-option-group label="推广词">
                        <el-option label="精确词" :value="1"></el-option>
                        <el-option label="精短词" :value="2"></el-option>
                        <el-option label="删除词" :value="3"></el-option>
                        <el-option label="降价词" :value="4"></el-option>
                      </el-option-group>
                      <el-option-group label="否定词">
                        <el-option label="否定词" :value="11"></el-option>
                        <el-option label="精否词" :value="12"></el-option>
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="词语" prop="content" :rules="[
                      {required: true, message: '必填'},
                      {validator: row.rule.content, trigger: 'blur'}
                    ]">
                    <el-input v-model="row.bidOperation.keyword.content" type="textarea"></el-input>
                    <template>
                      <div>
                        格式：
                        <span class="ms-danger">关键词,搜索词</span> 注意，中间为
                        <span class="ms-danger">英文逗号</span>
                        ， 多个推广词以回车隔开，每行一组
                      </div>
                    </template>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click.native.prevent="addKeyword">提交</el-button>
                    <el-button @click.native.prevent="resetForm('formKeyword')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="框架分词" name="splitWord">
            <el-form class="form" label-width="120px" size="small" :model="row.bidOperation.splitWord">
              <el-form-item label="关键词词库" prop="libraryIds" :rules="[{required: true, message: '必填'}]">
                <el-select v-model="row.bidOperation.splitWord.libraryIds" filterable remote placeholder="支持多选， 请输入关键字"
                           :remote-method="libraryLikeness" :loading="remote.library.loading" multiple>
                  <el-option v-for="library in remote.library.data" :key="library.id"
                             :label="library.title+'[词量'+library.total+']'"
                             :value="library.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="匹配模式" prop="matchModes" :rules="[{required: true, message: '必填'}]">
                <el-checkbox-group v-model="row.bidOperation.splitWord.matchModes">
                  <el-checkbox :label="1" checked>短语-核心包含</el-checkbox>
                  <el-checkbox :label="2" checked>短语-精确包含</el-checkbox>
                  <br>
                  <el-checkbox :label="3" checked>短语-同义包含</el-checkbox>
                  <el-checkbox :label="4" checked>精确</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="附加功能" prop="functions">
                <el-checkbox-group v-model="row.bidOperation.splitWord.functions">
                  <el-checkbox :label="1" checked>指定出价</el-checkbox>
                  <el-checkbox :label="2">自动生成计划名</el-checkbox>
                  <br>
                  <el-checkbox :label="3">自动生成URL地址</el-checkbox>
                  <el-checkbox :label="4">匹配模式合并生成计划名</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="出价" prop="price" :rules="[{required: true, message: '必填'}]">
                <el-input placeholder="出价金额" v-model="row.bidOperation.splitWord.price">
                  <template slot="prepend">&yen;</template>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click.native.prevent="splitWord">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </ms-slide>

    <ms-slide
      :title="row.site.edit.enabled ? '编辑推广页' : '新增推广页'"
      :width="500"
      ref="slideSite">
      <el-form class="form" label-width="120px" size="small" :model="row.site.form" ref="formSite">
        <el-form-item v-for="(url, index) in row.site.form.pageUrls" :key="index" label="推广页面" :prop="'pageUrls.' + index + '.value'" :rules="[{required: true, message: '必填'}]">
          <el-input :style="{width: '215px'}" v-model="url.value" placeholder="须以 http[s]:// 开头"></el-input>
          <el-button v-if="!row.site.edit.enabled && row.site.form.pageUrls.length !== 1" type="danger" @click="row.site.form.pageUrls.splice(index, 1)">删除</el-button>
          <el-button v-if="!row.site.edit.enabled && index === row.site.form.pageUrls.length - 1" type="primary" @click="row.site.form.pageUrls.push({value: ''})">添加</el-button>
        </el-form-item>
        <el-form-item label="页面类型" prop="pageType" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.site.form.pageType">
            <el-option label="综合" :value="0"></el-option>
            <el-option label="手机" :value="2"></el-option>
            <el-option label="PC端" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="row.site.edit.enabled" label="页面状态" prop="pageStatus"
                      :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.site.form.pageStatus" :disabled="true">
            <el-option label="无法访问" :value="0"></el-option>
            <el-option label="正常" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="53客服状态" prop="kf53Status" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.site.form.kf53Status">
            <el-option label="未使用" :value="0"></el-option>
            <el-option label="已使用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="留言板状态" prop="feedbackStatus" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.site.form.feedbackStatus">
            <el-option label="未使用" :value="0"></el-option>
            <el-option label="已使用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="submitSite()">提交</el-button>
          <el-button @click.native.prevent="resetForm('formSite')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="每日预算" ref="slideDailyBudget" align="left">
      <el-table
        v-loading="row.budget.loading"
        size="small" stripe border
        :data="row.budget.list"
        :fit="true">
        <el-table-column prop="day" label="日期" min-width="80"></el-table-column>
        <el-table-column prop="budget" label="当日预算" min-width="80"></el-table-column>
        <el-table-column label="预算变更" min-width="180">
          <template slot-scope="scope">
                      <span v-if="scope.row.approval !== undefined">
                        由<el-tag type="info">{{scope.row.beforeBudget}}</el-tag>
                        改为<el-tag type="success">{{scope.row.afterBudget}}</el-tag>
                      </span>
          </template>
        </el-table-column>
        <el-table-column label="申请信息" min-width="140">
          <template slot-scope="scope">
                      <span v-if="scope.row.approval !== undefined">
                        {{scope.row.petitionTime}}<br>
                        <span class="ms-info">@{{scope.row.operator}}</span>: {{scope.row.reason}}
                      </span>
          </template>
        </el-table-column>
        <el-table-column label="审批状态" min-width="200">
          <template slot-scope="scope">
                      <span v-if="scope.row.approval === -1">
                        {{scope.row.repulseReason}}<br>{{scope.row.approvalTime}}<br>
                        <span class="ms-danger">已拒绝</span>
                      </span>
            <span v-else-if="scope.row.approval === 1">
                        {{scope.row.approvalTime}}<br>
                        <span class="ms-success">已通过</span>
                      </span>
            <span v-else>等待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="petition(scope.$index)">申请</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="row.budget.pagination.page"
        :total="row.budget.pagination.totalRow"
        :page-size="row.budget.pagination.pageSize"
        :page-sizes="row.budget.pagination.pageSizes"
        @size-change="handleBudgetSizeChange"
        @current-change="handleBudgetCurrentChange"/>
    </ms-slide>

    <ms-slide
      title="每日预算申请"
      :width="500"
      ref="slideBudget">
      <el-form class="form" label-width="120px" size="small" :model="row.budget.form" ref="formBudget">
        <el-form-item label="日期" prop="day">
          <el-input v-model="row.budget.form.day" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预算">
          <el-input v-model="row.budget.form.beforeBudget" :disabled="true">
            <template slot="prepend">由</template>
          </el-input>
          <el-input v-model="row.budget.form.budget" :rules="[{required: true, message: '必填'}]">
            <template slot="prepend">更改为</template>
          </el-input>
        </el-form-item>
        <el-form-item label="修改原因" prop="reason" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.budget.form.reason" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="updateBudget">提交</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="添加效果报告" :width="500" ref="slide53Report">
      <el-form class="form" label-width="120px" size="small" :model="row.report.form" ref="form53Report">
        <el-form-item label="日期" prop="day" :rules="[{required: true, message: '必填'}]">
          <el-date-picker v-model="row.report.form.day" placeholder="选择日期" type="date"
                          value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="推广设备" prop="clientId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.report.form.clientId">
            <el-option label="综合" :value="0"></el-option>
            <el-option label="PC端" :value="1"></el-option>
            <el-option label="手机" :value="2"></el-option>
            <el-option label="APP" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="留言数" prop="feedback">
          <el-input v-model="row.report.form.feedback"></el-input>
        </el-form-item>
        <el-form-item label="访客数" prop="visitor">
          <el-input v-model="row.report.form.visitor"></el-input>
        </el-form-item>
        <el-form-item label="有效对话量" prop="talk">
          <el-input v-model="row.report.form.talk"></el-input>
        </el-form-item>
        <el-form-item label="要电话量" prop="phone">
          <el-input v-model="row.report.form.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="addReport">提交</el-button>
          <el-button @click.native.prevent="resetForm('form53Report')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="数据节点" :width="500" ref="slideNodeData">
      <el-form class="form" label-width="120px" size="small" :model="row.nodeData.form" ref="formNodeData">
        <el-form-item label="项目名称" prop="itemTitle">
          <el-input v-model="row.nodeData.form.itemTitle":disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账户名称" prop="accountTitle">
          <el-input v-model="row.nodeData.form.accountTitle":disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="时间节点" prop="timeNode" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.nodeData.form.timeNode">
            <el-option label="11:00" value="11:00"></el-option>
            <el-option label="12:00" value="12:00"></el-option>
            <el-option label="13:00" value="13:00"></el-option>
            <el-option label="14:00" value="14:00"></el-option>
            <el-option label="15:00" value="15:00"></el-option>
            <el-option label="16:00" value="16:00"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费点数" prop="costCoin" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.nodeData.form.costCoin"></el-input>
        </el-form-item>
        <el-form-item label="对话数" prop="talk" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.nodeData.form.talk"></el-input>
        </el-form-item>
        <el-form-item label="要电话数" prop="phone" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.nodeData.form.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="addNodeData">提交</el-button>
          <el-button @click.native.prevent="resetForm('formNodeData')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="涨预算记录" ref="slideBudgetary" align="left">
      <el-table
        v-loading="row.riseBudget.loading"
        size="small" stripe border
        :data="row.riseBudget.list"
        :fit="true">
        <el-table-column prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column prop="day" label="日期" min-width="80"></el-table-column>
        <el-table-column prop="beforeBudget" label="原预算" min-width="80"></el-table-column>
        <el-table-column prop="budget" label="申请涨预算" min-width="80"></el-table-column>
        <el-table-column prop="regulator" label="申请人" min-width="80"></el-table-column>
        <el-table-column label="紧急程度" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.urgencyDegree === 1">当天回复</span>
            <span v-else>{{scope.row.urgencyDegree}}天内回复</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="申请时间" min-width="140"></el-table-column>
        <el-table-column label="领导审核" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.approval === -1">拒绝</span>
            <span v-else-if="scope.row.approval === 0">未审核</span>
            <span v-else-if="scope.row.approval === 1">同意</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="销售审核" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.saleApproval === -1">拒绝</span>
            <span v-else-if="scope.row.saleApproval === 0">未审核</span>
            <span v-else-if="scope.row.saleApproval === 1">接洽中</span>
            <span v-else-if="scope.row.saleApproval === 2">同意</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60">
          <template slot-scope="scope">
            <el-popover
              ref="popover1"
              placement="right"
              trigger="click">
              <el-steps class="history" direction="vertical">
                <el-step>
                  <template slot="icon"></template>
                  <template slot="title">
                    <a href="javascript:">@{{row.riseBudget.list[row.riseBudget.processIndex].operator}}</a>
                    在 {{row.riseBudget.list[row.riseBudget.processIndex].publishTime}} 申请</template>
                  <template slot="description">{{row.riseBudget.list[row.riseBudget.processIndex].reason}}</template>
                </el-step>
                <el-step v-if="row.riseBudget.list[row.riseBudget.processIndex].approval !== 0">
                  <template slot="icon"></template>
                  <template slot="title">
                    <a href="javascript:">@{{row.riseBudget.list[row.riseBudget.processIndex].approver}}</a>
                    在 {{row.riseBudget.list[row.riseBudget.processIndex].approvalTime}}
                    <span v-if="row.riseBudget.list[row.riseBudget.processIndex].approval === -1">拒绝</span>
                    <span v-else-if="row.riseBudget.list[row.riseBudget.processIndex].approval === 1">同意</span>
                    <span v-else>批示</span>
                  </template>
                  <template slot="description">{{row.riseBudget.list[row.riseBudget.processIndex].approvalComment}}</template>
                </el-step>
                <el-step v-if="row.riseBudget.list[row.riseBudget.processIndex].saleApproval !== 0">
                  <template slot="icon"></template>
                  <template slot="title">
                    <a href="javascript:">@{{row.riseBudget.list[row.riseBudget.processIndex].saler}}</a>
                    在 {{row.riseBudget.list[row.riseBudget.processIndex].saleApprovalTime}}
                    <span v-if="row.riseBudget.list[row.riseBudget.processIndex].saleApproval === -1">拒绝</span>
                    <span v-else-if="row.riseBudget.list[row.riseBudget.processIndex].saleApproval === 1">和客户接洽中</span>
                    <span v-else-if="row.riseBudget.list[row.riseBudget.processIndex].saleApproval === 2">同意</span>
                    <span v-else>批示</span>
                  </template>
                  <template slot="description">{{row.riseBudget.list[row.riseBudget.processIndex].saleComment}}</template>
                </el-step>
              </el-steps>
            </el-popover>
            <!--@click.native.prevent=""-->
            <el-button type="text" size="small" v-popover:popover1
                       @click.native.prevent="row.riseBudget.processIndex = scope.$index">过程
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="row.riseBudget.pagination.page"
        :total="row.riseBudget.pagination.totalRow"
        :page-size="row.riseBudget.pagination.pageSize"
        :page-sizes="row.riseBudget.pagination.pageSizes"
        @size-change="handleRiseBudgetSizeChange"
        @current-change="handleRiseBudgetCurrentChange"/>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      cell-class-name="cell-box"
      show-summary
      :data="table.list"

      :fit="true"
      @cell-click="cellMouseEnter"
    >
      <el-table-column prop="id" label="ID" min-width="90" fixed>
        <template slot-scope="scope">
          <div class="data-id">
            <!-- 计划后缀 -->
            <div v-if="scope.row.toolEnabled">
              <ms-confirm-button
                title="计划后缀"
                type="icon"
                icon="audio-description"
                :popover-width="600"
                @confirm="showPlanSuffix(scope.$index)">
                <table class="ms-table ms-table-striped">
                  <thead>
                  <tr>
                    <th>类型</th>
                    <th>客户端</th>
                    <th>名称后缀</th>
                    <th>URL固定段</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-for="planType in [{id: 1, title: '产品', code: 'M'}, {id: 2, title: '竞品', code: 'J'}]">
                    <template v-if="scope.row.clientId === 0">
                      <tr v-for="clientId in [1, 2, 3]">
                        <td>{{planType.title}}</td>
                        <td>
                          <ms-device :client-id="clientId"/>
                        </td>
                        <td><code>{{planType.code}}QD{{clientId}}-{{scope.row.id}}S</code></td>
                        <td class="left">
                          <p>
                            原URL<span class="ms-caution">含?</span>请加
                            <code>&is={{scope.row.id}}&c={{clientId}}&ptf={{planType.id}}&end</code>
                          </p>
                          <p>
                            原URL<span class="ms-caution">不含?</span>请加
                            <code>?is={{scope.row.id}}&c={{clientId}}&ptf={{planType.id}}&end</code>
                          </p>
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td>{{planType.title}}</td>
                      <td>
                        <ms-device :client-id="scope.row.clientId"/>
                      </td>
                      <td><code>{{planType.code}}QD{{scope.row.clientId}}-{{scope.row.id}}S</code></td>
                      <td class="left">
                        <p>
                          原URL<span class="ms-caution">含?</span>请加
                          <code>&is={{scope.row.id}}&c={{scope.row.clientId}}&ptf={{planType.id}}&end</code>
                        </p>
                        <p>
                          原URL<span class="ms-caution">不含?</span>请加
                          <code>?is={{scope.row.id}}&c={{scope.row.clientId}}&ptf={{planType.id}}&end</code>
                        </p>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </ms-confirm-button>
            </div>

            <div class="content">{{scope.row.id}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="140">
        <template slot-scope="scope">
          <div class="data-itemTitle">
            <div class="content">
              <div class="content-icon">
                <el-tooltip v-if="scope.row.customerGenre === 2" content="渠道客户项目">
                  <icon name="glass"/>
                </el-tooltip>
                <el-tooltip v-else-if="scope.row.customerGenre !== 1" content="未知客户类型的项目">
                  <icon name="question-circle-o"/>
                </el-tooltip>
                <div v-else></div>
              </div>
              <div class="content-text">
                <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=3)">{{scope.row.itemTitle}}</a>
              </div>
            </div>
            <div class="icon">
              <!-- 推广页 -->
              <div v-if="scope.row.toolEnabled">
                <el-button v-popover:popover2 type="text" @click.native.prevent="getSites(scope.row.id)">
                  <icon name="desktop" class="ms-icon-btn"/>
                </el-button>
              </div>
              <!-- 客户名称 -->
              <div v-if="scope.row.toolEnabled">
                <el-popover
                  placement="right"
                  trigger="click">
                  <el-tooltip slot="reference" content="客户名称">
                    <icon name="address-card" class="ms-icon-btn"/>
                  </el-tooltip>

                  <code>
                    {{scope.row.customerTitle}}
                  </code>
                </el-popover>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="推广渠道" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.channelTitle, index=5)">{{scope.row.channelTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="渠道账户" min-width="200">
        <template slot-scope="scope">
          <div class="data-accountTitle">
            <div class="content">
              <div class="content-icon">
                <el-tooltip v-if="scope.row.accountGenre === 1" content="服务户">
                  <icon name="user"/>
                </el-tooltip>
              </div>
              <div class="content-text">
                <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=6)">{{scope.row.accountTitle}}</a>
              </div>
            </div>
            <!-- 账户密码 -->
            <div class="icon" v-if="scope.row.toolEnabled && scope.row.customerGenre === 1">
              <el-popover
                placement="right"
                width="200"
                trigger="click">
                <el-tooltip slot="reference" content="查看密码">
                  <icon name="low-vision" class="ms-icon-btn"></icon>
                </el-tooltip>

                <span v-if="scope.row.accountPassword === undefined || scope.row.accountPassword === null">
                  <span class="ms-caution">无权限查看密码, 或无密码</span>
                </span>
                <span v-else>
                  <code>
                    {{scope.row.accountTitle}}
                  </code>
                  <code v-if="scope.row.accountPassword.length > 0">
                    {{scope.row.accountPassword}}
                  </code>
                  <span class="ms-caution" v-else>未录入密码</span>
                </span>
                <!--<icon v-else name="spinner" pulse></icon>-->
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="设备" min-width="80">
        <template slot-scope="scope">
          <div class="data-accountTitle">
            <div class="content">
              <ms-device :client-id="scope.row.clientId"/>
            </div>
            <div class="icon">
              <template v-if="scope.row.toolEnabled">
                <ms-confirm-button
                  v-if="scope.row.status === 1"
                  title="更改设备"
                  type="icon"
                  icon="pencil-square-o"
                  :popover-width="220"
                  @confirm="updateDevice(scope.$index)">
                  <el-select v-model="newClientId" filterable placeholder="请选择">
                    <el-option label="综合" :value="0"></el-option>
                    <el-option label="PC端" :value="1"></el-option>
                    <el-option label="手机端" :value="2"></el-option>
                  </el-select>
                </ms-confirm-button>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="kf53Opened" label="53强制" min-width="60">
        <template v-if="scope.row.customerGenre === 1" slot-scope="scope">
          <el-switch v-model="scope.row.kf53OpenedStatus" @change="switchKf53Opened(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column prop="budget" label="预算" min-width="150" header-align="center">
        <template v-if="scope.row.customerGenre === 1" slot-scope="scope">
          <div class="data-budget">
            <div class="icon">
              <!-- 修改预算 -->
              <div v-if="scope.row.toolEnabled && scope.row.status === 1">
                <ms-confirm-button
                  title="修改预算"
                  type="icon"
                  icon="pencil-square-o"
                  :popover-width="220"
                  @confirm="modifyBudget(scope.$index)">
                  <el-form>
                    <el-form-item label="项目销售预算">
                      <el-input v-model="scope.row.itemBudget" size="small" disabled>
                        <template slot="prepend">每日</template>
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="默认预算">
                      <el-input v-model="scope.row.newBudget" size="small" placeholder="请输入内容">
                        <template slot="prepend">每日</template>
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-form>

                </ms-confirm-button>
              </div>

              <!-- 每日预算 -->
              <div v-if="scope.row.toolEnabled">
                <el-tooltip content="每日预算">
                  <el-button type="text" @click.native.prevent="showBudgetHistory(scope.row.id)">
                    <icon name="history" class="ms-icon-btn"/>
                  </el-button>
                </el-tooltip>
              </div>

              <!-- 申请涨预算 -->
              <div v-if="scope.row.toolEnabled && scope.row.status === 1">
                <!--<el-tooltip content="申请涨预算">-->
                <!--<icon name="level-up" class="ms-icon-btn" @click.native.prevent="riseBudget(scope.$index)"/>-->
                <!--</el-tooltip>-->
                <!--//todo 涨预算-->
                <ms-confirm-button
                  title="申请涨预算"
                  type="icon"
                  icon="level-up"
                  @show="showRiseBudget()"
                  @confirm="riseBudget(scope.$index)"
                  :popover-width="400"
                >
                  <el-form label-position="left" label-width="100px" :model="row.riseBudget.form">
                    <el-form-item label="预算涨幅">
                      <el-input v-model="row.riseBudget.form.budget">
                        <template slot="prepend">从 {{ table.list[row.option.index].budget }} 元涨到</template>
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="紧急程度">
                      <el-select v-model="row.riseBudget.form.urgencyDegree"
                                 placeholder="请选择">
                        <el-option label="当天答复" value="1"></el-option>
                        <el-option label="两天内答复" value="2"></el-option>
                        <el-option label="三天内答复" value="3"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="理由">
                      <el-input type="textarea" v-model="row.riseBudget.form.reason"></el-input>
                    </el-form-item>
                  </el-form>
                </ms-confirm-button>
              </div>

              <!-- 涨预算记录 -->
              <div v-if="scope.row.toolEnabled">
                <el-tooltip content="涨预算记录">
                  <el-button type="text" @click.native.prevent="showRiseBudgetList(scope.row.id)">
                    <icon name="share-square" class="ms-icon-btn"/>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div class="content">{{scope.row.budget.toFixed(2)}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="talkPrice" label="对话标准" min-width="80" align="right" header-align="center">
        <template v-if="scope.row.customerGenre === 1" slot-scope="scope">
          <template v-if="scope.row.talkPrice > 0">{{scope.row.talkPrice}}</template>
          <template v-else>{{scope.row.industryTalkPrice || 0}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackPrice" label="留言标准" min-width="80" align="right" header-align="center">
        <template v-if="scope.row.customerGenre === 1" slot-scope="scope">
          <div class="data-feedbackPrice">
            <div class="icon">
              <!-- 设置标准 -->
              <div v-if="scope.row.toolEnabled">
                <ms-confirm-button
                  v-if="scope.row.status === 1"
                  title="设置标准"
                  type="icon"
                  icon="pencil-square-o"
                  :popover-width="320"
                  @confirm="setCriterion(scope.$index)">
                  <table class="ms-table">
                    <thead>
                    <tr>
                      <th>类型</th>
                      <th>对话标准</th>
                      <th>留言标准</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>行业标准</td>
                      <td>
                        <el-input v-model="scope.row.industryTalkPrice" size="small" disabled/>
                      </td>
                      <td>
                        <el-input v-model="scope.row.industryFeedbackPrice" size="small" disabled/>
                      </td>
                    </tr>
                    <tr>
                      <td>方案标准</td>
                      <td>
                        <el-input v-model="scope.row.newTalkPrice" size="small"/>
                      </td>
                      <td>
                        <el-input v-model="scope.row.newFeedbackPrice" size="small"/>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </ms-confirm-button>
              </div>
            </div>
            <div class="content">
              <template v-if="scope.row.feedbackPrice > 0">{{scope.row.feedbackPrice}}</template>
              <template v-else>{{scope.row.industryFeedbackPrice || 0}}</template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="regulator" label="运营专员" min-width="90">
        <template v-if="scope.row.customerGenre === 1" slot-scope="scope">
          <div class="data-regulator">
            <!-- 运营专员 -->
            <div class="content">
              <span><a href="javascript:" @click="addSearchParams('regulator', scope.row.regulator)">{{scope.row.regulator}}</a></span>
            </div>
            <!-- 分配 -->
            <div class="icon">
              <template v-if="scope.row.toolEnabled">
                <ms-confirm-button
                  v-if="scope.row.status === 1"
                  title="分配运营专员"
                  type="icon"
                  icon="hand-o-left"
                  :popover-width="220"
                  @show="listSubordinate"
                  @confirm="apportion(scope.$index)">
                  <el-select v-model="scope.row.newRegulatorId" filterable placeholder="请选择">
                    <el-option
                      v-for="item in remote.subordinate.list" :key="item.id"
                      :loading="remote.subordinate.loading"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </ms-confirm-button>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="140">
        <template slot-scope="scope">
          <div class="data-status">
            <div class="icon">
              <div>
                <!-- 暂停 / 开启 -->
                <template v-if="scope.row.toolEnabled && scope.row.customerGenre === 1">
                  <el-tooltip v-if="scope.row.status === 1" content="暂停">
                    <icon name="pause-circle" class="ms-icon-btn" @click.native.prevent="switchStatus(scope.$index)"/>
                  </el-tooltip>
                  <el-tooltip v-else-if="scope.row.status === -2" content="开启">
                    <icon name="play-circle" class="ms-icon-btn" @click.native.prevent="switchStatus(scope.$index)"/>
                  </el-tooltip>
                </template>
              </div>
              <div>
                <!-- 上下稿操作 -->
                <template v-if="scope.row.toolEnabled && scope.row.customerGenre === 1">
                  <ms-confirm-button
                    v-if="scope.row.status === 1 || scope.row.status === -1 || scope.row.status === -2 || scope.row.status === -3 || scope.row.status === -4 || scope.row.status === -5"
                    type="icon"
                    :title="scope.row.status === 1 || scope.row.status === -3 || scope.row.status === -2 ? '下稿申请' : '上稿申请'"
                    :icon="scope.row.status === 1 || scope.row.status === -3 || scope.row.status === -2 ? 'arrow-circle-down' : 'arrow-circle-up'"
                    :popover-width="320"
                    @show="getPetition(scope.$index)"
                    @confirm="modifyStatus(scope.$index)">
                    <el-steps :active="row.statusPetition.activeStep" :finish-status="row.statusPetition.finishStepStatus">

                      <el-step title="提交申请"/>
                      <el-step title="等待审核"/>
                      <el-step :title="row.statusPetition.endStepTitle"/>
                    </el-steps>

                    <el-input
                      type="textarea"
                      placeholder="请输入申请理由"
                      :rows="2"
                      :disabled="!row.statusPetition.isEdit"
                      v-model="row.statusPetition.reason">
                    </el-input>
                  </ms-confirm-button>
                </template>
              </div>
              <div>
                <!-- 转户 -->
                <template v-if="scope.row.toolEnabled && scope.row.customerGenre === 1 && scope.row.status === 1">
                  <ms-confirm-button title="转户" type="icon" icon="retweet" @confirm="changeAccount(scope.$index)">
                    <el-select
                      v-model="scope.row.newAccountId"
                      filterable
                      remote
                      size="small"
                      placeholder="请输入账户关键字"
                      :remote-method="changeAccountLikeness"
                      :loading="remote.account.loading">
                      <el-option
                        v-for="account in remote.account.list" :key="account.id"
                        :label="account.name"
                        :value="account.id"
                        :disabled="account.status === 0"/>
                    </el-select>
                  </ms-confirm-button>
                </template>
              </div>
            </div>
            <!-- 状态 -->
            <div class="content">
              <span v-if="scope.row.status === 1" class="ms-success">上稿中</span>
              <span v-else-if="scope.row.status === 0" class="ms-invalid">无效</span>
              <span v-else-if="scope.row.status === -1" class="ms-danger">已下稿</span>
              <span v-else-if="scope.row.status === -2" class="ms-gray">暂停</span>
              <span v-else-if="scope.row.status === -3" class="ms-warning">下稿申请中</span>
              <span v-else-if="scope.row.status === -4" class="ms-warning">上稿申请中</span>
              <span v-else-if="scope.row.status === -5" class="ms-info">已转户</span>
              <span v-else class="ms-gray">未知</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140" class-name="option">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>-->

          <el-button type="text" size="small" @click.native.prevent="showFeedbackCode(scope)">留言板</el-button>

          <ms-pin-notify v-model="scope.row.hasOperationNotify">
            <el-button type="text" size="small" @click.native.prevent="showBidOperation(scope.$index)">营运</el-button>
          </ms-pin-notify>

          <el-dropdown trigger="click">
            <span class="more">
              更多<icon name="chevron-down"></icon>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" size="small" @click.native.prevent="show53Report(scope.row.id)">录53效果</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" size="small" @click.native.prevent="showNodeData(scope.row.id, scope.row.itemTitle, scope.row.accountTitle)">节点数据</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)" popover-placement="left-start">
                  <p>您确定要删除<code>id = {{scope.row.id}}</code>的项目方案吗？</p>
                </ms-confirm-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

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
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
  import MsPlatform from '../../common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsDevice from '@/components/common/Device.vue'
  import MsPinNotify from '@/components/common/PinNotify.vue'
  import MsEditor from '@/components/common/Editor.vue'
  import Api from '@/api/platform/item-solution'
  import FormTokenApi from '@/api/system/form-token'
  import ChannelApi from '@/api/platform/channel'
  import ChannelAccountApi from '@/api/platform/channel-account'
  import CustomerApi from '@/api/platform/customer'
  import SystemUserApi from '@/api/system/system-user'
  import ItemApi from '@/api/platform/item'
  import ItemOrientationApi from '@/api/platform/item-orientation'
  import ItemIndustryApi from '@/api/platform/item-industry'
  import ReviewApi from '@/api/platform/item-solution-bid-review'
  import KeywordApi from '@/api/platform/industry-keyword-strategy'
  import LibraryApi from '@/api/platform/bid-keyword-library'
  import StatusPetitionApi from '@/api/platform/item-solution-status-petition'
  import AdjustJobApi from '@/api/platform/item-solution-adjust-job'
  import SiteApi from '@/api/platform/item-solution-site'
  import BudgetApi from '@/api/platform/item-solution-consumption-petition'
  import DailyBudgetApi from '@/api/report/item-solution-daily-budget'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import {
    BidOperation, FEEDBACK_BOTTOM_CODE, FEEDBACK_CORE_CODE,
    FEEDBACK_IFRAME_CODE, FEEDBACK_STYLE, FeedbackCode, FormArgument,
    ReportFormArgument, NodeDataFormArgument, Remote, SiteForm, SEARCH_CONDITION, StatusPetition
  } from '@/models/platform/item-solution'
  import moment from 'moment'

  export default {
    components: {
      MsPlatform,
      MsSearch,
      MsSlide,
      MsConfirmButton,
      MsDevice,
      MsPinNotify,
      MsEditor
    },
    data () {
      return {
        defaultTure: ['1', '2', '3', '4', '5', '6'],
        search: {
          list: [],
          condition: {}
        },
        table: {
          loading: true,
          list: [],
          pagination: {},
          search: {
            hover: false,
            rightHand: false
          }
        },
        row: {
          option: {
            index: 0,
            id: 0
          },
          edit: {
            enabled: false,
            index: 0
          },
          rule: {
            content: (rule, value, callback) => {
              if (value.indexOf(',') === -1) {
                callback(new Error('提交词必须包含关键词和搜索词，两者以英文逗号隔开'))
              }
              callback()
            }
          },
          form: new FormArgument(),
          riseBudget: {
            loading: true,
            list: [],
            pagination: {},
            form: {},
            search: {
              itemSolutionId: ''
            },
            processIndex: 0
          },
          statusPetition: new StatusPetition(),
          feedbackCode: new FeedbackCode(),
          bidOperation: new BidOperation(),
          site: {
            loading: true,
            list: [],
            pagination: {},
            edit: {
              enabled: false,
              index: 0
            },
            form: new SiteForm(),
            search: {
              itemSolutionId: ''
            }
          },
          budget: {
            loading: true,
            list: [],
            pagination: {},
            form: {
              id: '',
              day: '',
              beforeBudget: '',
              budget: '',
              reason: ''
            },
            search: {
              itemSolutionId: ''
            }
          },
          report: {
            form: new ReportFormArgument()
          },
          nodeData: {
            form: new NodeDataFormArgument()
          }
        },
        remote: new Remote(),
        keywordList: [],
        pageUrl: '',
        pageReviewLoading: false,
        newClientId: ''
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      SEARCH_CONDITION[0].value = this.$route.query.id || ''
      this.search.list = SEARCH_CONDITION
      this.table.loading = true
      this.table.list = []
      this.search.condition.id = this.$route.query.id || ''
      this.requestList()
    },
    computed: {
      platforms () {
        return PLATFORM_LIST
      },
      feedbackStyle () {
        const list = [
          {label: 'PC 页面', list: []},
          {label: '手机页面', list: []}
        ]
        FEEDBACK_STYLE.forEach(item => {
          if (item.clientId === 1) {
            list[0].list.push(item)
          } else if (item.clientId === 2) {
            list[1].list.push(item)
          }
        })
        return list
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
//      calculatedHeight () {
//        this.$nextTick(function () {
//          this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//        })
//      },
      getSites (itemSolutionId) {
        this.row.site.search.itemSolutionId = itemSolutionId
        this.row.site.form.itemSolutionId = itemSolutionId
        this.siteList()
        this.showSlide('slideSiteRow')
      },
      siteList () {
        const search = Object.assign({}, this.row.site.pagination, this.row.site.search)
        this.row.site.loading = true
        SiteApi.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            body.forEach((item, index) => {
              if (item.pageType === 1) {
                item.pageType = 2
              } else if (item.pageType === 2) {
                item.pageType = 1
              }
            })
            this.row.site.list = body
            this.row.site.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.site.list = []
          }
          this.row.site.loading = false
        })
      },
      addSite () {
        this.row.site.edit.enabled = false
        this.row.site.edit.index = 0

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.site.form.token = body.token || ''
          }
        })
        this.$set(this.row.site.form, 'pageUrls', [
          {value: ''}
        ])
        this.showSlide('slideSite')
      },
      addSearchParams (name, value) {
        let index = this.search.list.findIndex(item => item.name === name)
        if (index === -1) {
          return
        }
        this.search.list[index].value = value

        this.table.pagination.page = 1
        this.search.condition[name] = value
        this.requestList()
      },
      showPassword (index) {
        if (this.table.list[index].accountPassword === undefined ||
          this.table.list[index].accountPassword === false) {
          Api.accountPassword({id: this.table.list[index].id}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              this.$set(this.table.list[index], 'accountPassword', body.accountPassword)
            } else {
              this.$message.error(body.error || '查看密码失败')
              this.$set(this.table.list[index], 'accountPassword', false)
            }
          })
        }
      },
      editSite (index) {
        this.row.site.edit.index = index
        this.row.site.edit.enabled = true
        this.row.site.form = JSON.parse(JSON.stringify(this.row.site.list[index]))
        this.$set(this.row.site.form, 'pageUrls', [
          {value: JSON.parse(JSON.stringify(this.row.site.list[index].pageUrl))}
        ])
        this.showSlide('slideSite')
      },
      submitSite () {
        this.$refs['formSite'].validate((valid) => {
          if (valid) {
            if (this.row.site.edit.enabled) {
              this.row.site.form.pageUrl = [this.row.site.form.pageUrls[0].value]
              SiteApi.modify({id: this.row.site.form.id, form: this.row.site.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.row.site.list[this.row.site.edit.index].pageUrl = body.pageUrl
                  if (body.pageType === 1) {
                    this.row.site.list[this.row.site.edit.index].pageType = 2
                  } else if (body.pageType === 2) {
                    this.row.site.list[this.row.site.edit.index].pageType = 1
                  }
                  this.row.site.list[this.row.site.edit.index].kf53Status = body.kf53Status
                  this.row.site.list[this.row.site.edit.index].feedbackStatus = body.feedbackStatus
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              this.row.site.form.pageUrl = this.row.site.form.pageUrls.map((item) => {
                return item.value
              })

              SiteApi.create({form: this.row.site.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.$message.success('新增成功')
//                  this.row.site.list = body.list.concat(this.row.site.list)
                  this.siteList()
                } else {
                  this.$message.error(body.error || '新增失败')
                }

                this.$refs['slideSite'].close()
              })
            }
            // 关闭
//            this.$refs['slideSite'].close()
          } else {
            return false
          }
        })
      },
      deleteSite (index) {
        SiteApi.delete({id: this.row.site.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.site.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      },
      check (index) {
        SiteApi.check({id: this.row.site.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, this.row.site.list[index], body)
            this.row.site.list.splice(index, 1, data)
            this.$message.success('成功')
          } else {
            this.$message.error(body.error || '检查失败')
          }
        })
      },
      feedbackCheck (index) {
        const form = {pageId: this.row.site.list[index].id, pageUrl: this.row.site.list[index].pageUrl}
        Api.pageUrlVerify({id: this.row.site.list[index].itemSolutionId, form: form}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.$message.success('审查成功')
          } else {
            this.$message.error(body.error || '审查失败')
          }
        })
      },
      handleSiteSizeChange (val) {
        this.row.site.pagination.pageSize = val
        this.siteList()
      },
      handleSiteCurrentChange (val) {
        this.row.site.pagination.page = val
        this.siteList()
      },
      // 操作按钮显示逻辑
      cellMouseEnter (row, column, cell, event) {
        // 判断是否显示操作图标
        const oldIndex = this.row.option.index
        const index = this.table.list.findIndex(item => item.id === row.id)
        if (oldIndex !== index || index === 0) {
          if (this.table.list[oldIndex] !== undefined) {
            this.table.list[oldIndex].toolEnabled = false
          }

          this.row.option.index = index
          this.row.option.id = row.id
          row.toolEnabled = true

          this.row.statusPetition = new StatusPetition()
        }
      },
      // 列表
      requestList () {
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        this.table.loading = true
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list = body.map(item => {
              // 修改后的新预算
              item.newBudget = item.budget
              // 修改后的标准
              item.newTalkPrice = item.talkPrice
              item.newFeedbackPrice = item.feedbackPrice
              // 修改后的运营人员
              item.newRegulatorId = item.regulatorId === 0 ? '' : item.regulatorId
              // 修改后的账户
              item.newAccountId = ''
              // 53强制状态
              item.kf53OpenedStatus = item.kf53Opened === 1
              // 是否显示操作图标
              item.toolEnabled = false
              // 是否有运营通知
              item.hasOperationNotify = this.hasOperationNotify(item)
              return item
            })
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && this.table.list.length < 15) {
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
      },
      hasOperationNotify (target) {
        return (target.orientationId > 0 && target.orientationHandle !== 1) ||
          (target.bidReviewRead === 0 && this.$store.state.user.info.id === target.regulatorId) ||
          target.surveyRead === 0 || (target.operatingProcessRead === 0 && this.$store.state.user.info.id === target.regulatorId)
      },
      handleSizeChange (val) {
        this.table.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.table.pagination.page = val
        this.requestList()
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      // 新增
      addRow () {
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
      customerLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.customer.list = []
          return
        }

        this.remote.customer.loading = true
        const search = {title: query, pageSize: 100}
        CustomerApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.customer.list = body
          }
          this.remote.customer.loading = false
        })
      },
      customerChange (id) {
        if (id > 0) {
          this.remote.item.loading = true
          this.row.form.itemId = ''
          ItemApi.likeness({customerId: id, pageSize: 100}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.item.list = body
            }
            this.remote.item.loading = false
          })
        }
      },
      platformChange (id) {
        if (id > 0) {
          // 获得渠道列表
          this.remote.channel.loading = true
          this.row.form.channelId = ''
          ChannelApi.list({platformId: id, pageSize: 100}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.channel.list = body
            }
            this.remote.channel.loading = false
          })
        }
      },
      accountLikeness (query) {
        const platformId = this.row.form.platformId
        if (query === '' || query.length === 0 || platformId === undefined || platformId <= 0) {
          this.remote.account.list = []
          return
        }

        const search = {platformId: platformId, name: query, pageSize: 100}
        this.remote.account.loading = true
        ChannelAccountApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.account.list = body
          }
          this.remote.account.loading = false
        })
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (!this.row.edit.enabled) {
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  // 新数据加到数组开头
                  this.table.list.unshift(body)
                  // 重置表单
                  this.row.form = new FormArgument()

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
      // 53强制切换
      switchKf53Opened (index) {
        const item = this.table.list[index]
        Api.switchKf53Opened({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          let data = item
          if (status >= 200 && status <= 204) {
            data = Object.assign({}, item, body)
          } else {
            this.$message.error(body.error || '操作失败')
          }

          // 充值53强制状态
          data.kf53OpenedStatus = data.kf53Opened === 1
          this.table.list.splice(index, 1, data)
        })
      },
      // 修改预算
      modifyBudget (index) {
        const item = this.table.list[index]
        Api.modifyBudget({id: item.id, budget: item.newBudget}, response => {
          let status = response.status || 0
          let body = response.data || {}
          let data = item
          if (status >= 200 && status <= 204) {
            this.table.list[index].budget = body.budget
            this.$message.success('修改成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }

          // 重置编辑数据
          data.newBudget = data.budget
          this.table.list[index] = data
        })
      },
      // 每日预算
      showBudgetHistory (itemSolutionId) {
        this.row.budget.search.itemSolutionId = itemSolutionId
        this.BudgetHistory()
        this.showSlide('slideDailyBudget')
      },
      BudgetHistory () {
        this.row.budget.loading = true
        DailyBudgetApi.list({search: this.row.budget.search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.budget.list = body
            this.row.budget.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.budget.list = []
          }
          this.row.budget.loading = false
        })
      },
      petition (index) {
        this.row.budget.form.id = this.row.budget.list[index].id
        this.row.budget.form.day = this.row.budget.list[index].day
        this.row.budget.form.beforeBudget = this.row.budget.list[index].beforeBudget
        this.row.budget.form.budget = this.row.budget.list[index].afterBudget
        this.row.budget.form.reason = this.row.budget.list[index].reason
//        this.$set(this.row.budget, 'form', this.row.budget.list[index])
//        this.row.budget.form = this.row.budget.list[index]
        this.row.edit.index = index
        this.showSlide('slideBudget')
      },
      updateBudget () {
        this.$refs['formBudget'].validate((valid) => {
          if (valid) {
            DailyBudgetApi.petition({id: this.row.budget.form.id, form: this.row.budget.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                if (body instanceof Array) {
                  let data = Object.assign({}, this.row.budget.list[index], body[0])
                  this.row.budget.list.splice(index, 1, data)
                } else {
                  this.row.budget.list[index].afterBudget = this.row.budget.form.budget
                  this.row.budget.list[index].reason = this.row.budget.form.reason
                  this.row.budget.list[index].petitionTime = body.publishTime
                }
                this.$message.success('修改成功')
              } else {
                this.$message.error(body.error || '修改失败')
              }
            })
          }
        })
        this.$refs['slideBudget'].close()
      },
      handleBudgetSizeChange (val) {
        this.row.budget.pagination.pageSize = val
        this.BudgetHistory()
      },
      handleBudgetCurrentChange (val) {
        this.row.budget.pagination.page = val
        this.BudgetHistory()
      },
      showRiseBudget () {
        this.row.riseBudget.form = {}

        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.riseBudget.form.token = body.token || ''
          }
        })
      },
      // 涨预算
      riseBudget (index) {
        const item = this.table.list[index]
        this.row.riseBudget.form.itemSolutionId = item.id

        BudgetApi.riseBudget({form: this.row.riseBudget.form}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      // 涨预算记录
      showRiseBudgetList (itemSolutionId) {
        this.row.riseBudget.search.itemSolutionId = itemSolutionId
        this.riseBudgetList()
        this.showSlide('slideBudgetary')
      },
      riseBudgetList () {
        const search = Object.assign({},
          this.row.riseBudget.pagination,
          this.row.riseBudget.search)
        this.row.riseBudget.loading = true

        BudgetApi.list({search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.riseBudget.list = body
            this.row.riseBudget.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.riseBudget.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.row.riseBudget.loading = false
        })
      },
      handleRiseBudgetSizeChange (val) {
        this.row.riseBudget.pagination.pageSize = val
        this.riseBudgetList()
      },
      handleRiseBudgetCurrentChange (val) {
        this.row.riseBudget.pagination.page = val
        this.riseBudgetList()
      },
      // 设置标准
      setCriterion (index) {
        const item = this.table.list[index]
        const params = {id: item.id, talkPrice: item.newTalkPrice, feedbackPrice: item.newFeedbackPrice}
        Api.modifyCriteria(params, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list[index].feedbackPrice = body.feedbackPrice
            this.table.list[index].talkPrice = body.talkPrice
            this.$message.success('修改成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }

          // 重置编辑内容
          item.newTalkPrice = item.talkPrice
          item.newFeedbackPrice = item.feedbackPrice
        })
      },
      // 分配
      apportion (index) {
        const item = this.table.list[index]
        if (item.regulatorId !== item.newRegulatorId) {
          Api.apportion({id: item.id, regulatorId: item.newRegulatorId}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              const data = Object.assign({}, item, body, {newRegulatorId: body.regulatorId})
              this.table.list.splice(index, 1, data)
            }
          })
        }
      },
      listSubordinate () {
        if (this.remote.subordinate.list.length === 0) {
          this.remote.subordinate.loading = true
          SystemUserApi.bidSubordinates(response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.subordinate.list = body
            }
            this.remote.subordinate.loading = false
          })
        }
      },
      // 暂停/启用方案
      switchStatus (index) {
        const item = this.table.list[index]
        Api.switchStatus({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1, Object.assign({}, item, body))
            if (body.status === 1) {
              this.$message.success('开启方案成功')
            }
            if (body.status === -2) {
              this.$message.warning('暂停方案成功')
            }
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      // 上下稿申请
      modifyStatus (index) {
        const item = this.table.list[index]
        if (!item.hasOwnProperty('statusPetitionId') || item.statusPetitionId <= 0) {
          StatusPetitionApi.create({form: this.row.statusPetition}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              const data = {
                statusPetitionId: body.id,
                status: this.row.statusPetition.genre === 1 ? -3 : -4
              }
              this.table.list.splice(index, 1, Object.assign({}, item, data))
              this.$message.success('已成功申请下稿')
            } else {
              this.$message.error(body.error || '操作失败')
            }
          })
        }
      },
      getPetition (index) {
        const item = this.table.list[index]
        this.row.statusPetition.activeStep = item.status === 1 || item.status === -1 || item.status === -5 ? 1 : 2
//        this.row.statusPetition.endStepTitle = item.status === -5 ? '已拒绝' : '完成'
//        this.row.statusPetition.finishStepStatus = item.status === -5 ? 'error' : 'success'
        this.row.statusPetition.isEdit = item.status === 1 || item.status === -1 || item.status === -5
        this.row.statusPetition.itemSolutionId = item.id
        this.row.statusPetition.genre = item.status === 1 || item.status === -3 ? 1 : 2

        if (item.hasOwnProperty('statusPetitionId') && item.statusPetitionId > 0) {
          StatusPetitionApi.get({id: item.statusPetitionId}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              this.row.statusPetition.reason = body.reason
            }
          })
        }
      },
      // 转户
      changeAccount (index) {
        const item = this.table.list[index]
        if (item.newAccountId !== '') {
          Api.changeAccount({id: item.id, accountId: item.newAccountId}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              // 系统会自动检查 转入的账户，在历史中，是否存在方案创建
              // 不存在，则自动创建，则返回的数据为新的项目方案
              // 存在，则判断该方案的状态，如果是已下稿的则自动重新上稿，上下稿申请中的则不操作，提示已申请
              const data = Object.assign({}, item, {newAccountId: '', status: -5})
              this.table.list.splice(index, 1, data)
              if (body.id !== item.id) {
                this.table.list.unshift(body)
              }
              this.$message.success('转户成功')
            } else {
              this.$message.error(body.error || '操作失败')
            }
          })
        }
      },
      changeAccountLikeness (query) {
        const index = this.row.option.index
        const item = this.table.list[index]
        if (query === '' || query.length === 0) {
          this.remote.account.list = []
          return
        }

        const search = {platformId: item.platformId, name: query, pageSize: 100}
        this.remote.account.loading = true
        ChannelAccountApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.account.list = body
          }
          this.remote.account.loading = false
        })
      },
      // 留言板代码
      showFeedbackCode (scope) {
        this.row.feedbackCode = new FeedbackCode()
        this.row.feedbackCode.itemSolutionIndex = scope.$index
        // 自定义留言板
        const feedbackUri = 'ts=0&i=' + scope.row.itemId + '&is=' + scope.row.id + '&gi=值&c=值'
        this.row.feedbackCode.code.code = FEEDBACK_CORE_CODE.replace(/#FEEDBACK_URI#/g, feedbackUri)
        this.pageUrl = ''
        this.showSlide('slideFeedbackCode')
      },
      feedbackStyleChange (feedbackStyle) {
        const styleIndex = FEEDBACK_STYLE.findIndex(d => d.value === feedbackStyle)
        const style = FEEDBACK_STYLE[styleIndex]
        const item = this.table.list[this.row.feedbackCode.itemSolutionIndex]

        // 推广在综合客户端的，按样式所属的客户端为准
        const clientId = item.clientId === 0 ? style.clientId : item.clientId
        const feedbackUri = `ts=${style.value}&gi=1&c=${clientId}&i=${item.itemId}&is=${item.id}`
        this.row.feedbackCode.styleThumb = style.thumb
        this.row.feedbackCode.code.core = FEEDBACK_CORE_CODE.replace(/#FEEDBACK_URI#/g, feedbackUri)
        this.row.feedbackCode.code.show = style.value === 2 ? FEEDBACK_BOTTOM_CODE : FEEDBACK_IFRAME_CODE
      },
      pageReview () {
        if (this.pageUrl === undefined || this.pageUrl === '') {
          this.$message('请填写页面地址')
          return false
        }
        this.pageReviewLoading = true
        const item = this.table.list[this.row.feedbackCode.itemSolutionIndex]
        const form = {pageUrl: this.pageUrl}
        Api.pageUrlVerify({id: item.id, form: form}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            //            审查成功
            this.pageReviewLoading = false
          } else {
            this.pageReviewLoading = false
            this.$message.error(body.error || '审查失败')
          }
        })
      },
      // 营运操作
      showBidOperation (index) {
        this.row.bidOperation.activeTabName = 'bidWork'
        this.showSlide('slideOperation')

        // 非上一次操作行，则充值，并记录行索引
        if (this.row.bidOperation.lastIndex !== index) {
          this.row.bidOperation = new BidOperation()
          this.row.bidOperation.lastIndex = index
        }

        // 记录推广参考相关信息，并判断推广参考是否已读
        const item = this.table.list[this.row.bidOperation.lastIndex]

        this.row.bidOperation.orientation.itemSolutionId = item.id
        this.row.bidOperation.orientation.id = item.orientationId || 0
        this.row.bidOperation.orientation.itemId = item.itemId
        this.row.bidOperation.orientation.handled = item.orientationId > 0 && item.orientationHandle !== 1

        // 记录项目方案id
        this.row.bidOperation.splitWord.itemSolutionId = this.table.list[index].id

        // 记录返回
        this.$set(this.row.bidOperation.survey, 'itemId', this.table.list[index].itemId)
        this.$set(this.row.bidOperation.survey, 'handled', item.surveyRead !== undefined && item.surveyRead === 0)
        this.$set(this.row.bidOperation.survey, 'itemSolutionId', item.id)

        // 历史运营过程
        this.$set(this.row.bidOperation.operating, 'handled', item.operatingProcessRead !== undefined && item.operatingProcessRead === 0)
        this.$set(this.row.bidOperation.operating, 'itemSolutionId', item.id)
        // 初始化今日运营内容和历史运营记录
        this.row.bidOperation.adjustJob.today.content = ''
        this.remote.itemSolutionAdjustJob.history = {}

        // 运营监察
        this.row.bidOperation.bidReview.row.form = Object.assign({}, {}, {
          token: this.row.bidOperation.bidReview.row.form.token
        })
        this.$set(this.row.bidOperation.bidReview.row.form, 'itemSolutionId', this.table.list[index].id)
        this.$set(this.row.bidOperation.bidReview.row.form, 'handled', item.bidReviewRead !== undefined && item.bidReviewRead === 0)

        this.listAdjustJob()
      },
      show53Report (itemSolutionId) {
        this.row.report.form = {}
        this.row.report.form.itemSolutionId = itemSolutionId

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.report.form.token = body.token || ''
          }
        })

        this.showSlide('slide53Report')
      },
      addReport () {
        this.$refs['form53Report'].validate((valid) => {
          if (valid) {
            Api.addReport({id: this.row.report.form.itemSolutionId, form: this.row.report.form}, response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                this.$message.success('录53效果成功')
              } else {
                this.$message.error(body.error || '录53效果失败')
              }
              this.$refs['slide53Report'].close()
            })
          }
        })
      },
      showNodeData (itemSolutionId, itemTitle, accountTitle) {
        this.row.nodeData.form = {}
        this.row.nodeData.form.itemSolutionId = itemSolutionId

        this.$set(this.row.nodeData.form, 'itemTitle', itemTitle)
        this.$set(this.row.nodeData.form, 'accountTitle', accountTitle)

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.nodeData.form.token = body.token || ''
          }
        })

        this.showSlide('slideNodeData')
      },
      addNodeData () {
        this.$refs['formNodeData'].validate((valid) => {
          if (valid) {
            Api.addNodeData({form: this.row.nodeData.form}, response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                this.$message.success('添加节点数据成功')
              } else {
                this.$message.error(body.error || '添加节点数据失败')
              }
              this.$refs['slideNodeData'].close()
            })
          }
        })
      },
      bidOperationTabChange (tab) {
        if (tab.name === 'orientation') {
          this.getOrientation()
        }
        if (tab.name === 'customerFeedback') {
          this.getSurvey()
        }
        if (tab.name === 'bidReview') {
          // 获得 form token
          FormTokenApi.create(response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.row.bidOperation.bidReview.row.form.token = body.token || ''
            }
          })
          this.getReview()
        }
        if (tab.name === 'splitWord') {
          this.remote.library.data = {}
        }
      },
      listAdjustJob () {
        const today = moment().format('YYYYMMDD')
        // 获得运营历史记录
        const itemSolutionId = this.row.bidOperation.operating.itemSolutionId
        if (!this.remote.itemSolutionAdjustJob.history.hasOwnProperty(itemSolutionId)) {
          this.row.bidOperation.adjustJob.loading = true
          let params = {
            id: itemSolutionId,
            page: this.row.bidOperation.adjustJob.pagination.page || 1,
            pageSize: this.row.bidOperation.adjustJob.pagination.pageSize || 10
          }
          Api.listAdjustJob(params, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.row.bidOperation.adjustJob.pagination = ResponseParse.pagination(response.headers)

              this.$set(this.remote.itemSolutionAdjustJob.history, itemSolutionId, body.map(item => {
                item.dayView = moment(item.day, 'YYYYMMDD').format('MM-DD')
                return item
              }))

              const index = body.findIndex(d => today === d.day.toString())
              if (index >= 0) {
                this.$set(this.row.bidOperation.adjustJob.today, 'content', body[index].content || '')
                this.$set(this.row.bidOperation.adjustJob.today, 'itemSolutionId', body[index].itemSolutionId)
              }
              this.$set(this.row.bidOperation.adjustJob, 'history', body)
            } else {
              this.$set(this.remote.itemSolutionAdjustJob.history, itemSolutionId, [])
            }
            this.row.bidOperation.adjustJob.loading = false
          })
        } else {
          const body = this.remote.itemSolutionAdjustJob.history[itemSolutionId]

          const index = body.findIndex(d => today === d.day.toString())
          if (index >= 0) {
            this.$set(this.row.bidOperation.adjustJob.today, 'content', body[index].content || '')
            this.$set(this.row.bidOperation.adjustJob.today, 'itemSolutionId', body[index].itemSolutionId)
          }
          this.$set(this.row.bidOperation.adjustJob, 'history', body)
        }
      },
      setSurveyRead () {
        Api.readSurveyRead({id: this.row.bidOperation.survey.itemSolutionId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.bidOperation.survey.handled = false
            const index = this.table.list.findIndex(item => item.id === body.itemSolutionId)
            if (index !== -1) {
              this.$set(this.table.list[index], 'surveyRead', body.surveyRead)
              this.$set(this.table.list[index], 'hasOperationNotify', this.hasOperationNotify(this.table.list[index]))
            }
            this.$message.success('已读成功')
          } else {
            this.$message.error(body.error || '已读失败')
          }
        })
      },
      submitTodayAdjustJob () {
        const itemSolutionId = this.row.bidOperation.bidReview.row.form.itemSolutionId
        const params = {
          itemSolutionId: itemSolutionId,
          content: this.row.bidOperation.adjustJob.today.content
        }
        AdjustJobApi.create({form: params}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.bidOperation.adjustJob.today = body
            if (body.itemSolutionId !== undefined && body.operator !== undefined) {
              this.remote.itemSolutionAdjustJob.history[itemSolutionId].unshift(body)
            } else {
              let index = this.remote.itemSolutionAdjustJob.history[itemSolutionId].findIndex(item => item.id === body.id)
              this.remote.itemSolutionAdjustJob.history[itemSolutionId][index].content = body.content
              this.remote.itemSolutionAdjustJob.history[itemSolutionId][index].editContent = body.editContent
            }
            this.row.bidOperation.adjustJob.today.content = ''
            this.row.bidOperation.operating.handled = true
            this.$message.success('提交成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      moreAdjustJob (val) {
        this.row.bidOperation.adjustJob.pagination.page = val
        this.listAdjustJob()
      },
      getOrientation () {
        const orientationId = this.row.bidOperation.orientation.id
        if (orientationId === 0) {
          return
        }
        // 获得当前的项目参考
        const index = this.remote.itemOrientation.list.findIndex(d => d.id === orientationId)
        if (index === -1) {
          this.row.bidOperation.orientation.loading = true
          ItemOrientationApi.get({id: orientationId}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              this.remote.itemOrientation.list.push(body)
              this.row.bidOperation.orientation.current = body
            }
            this.row.bidOperation.orientation.loading = false
          })
        } else {
          this.row.bidOperation.orientation.current = this.remote.itemOrientation.list[index]
        }
      },
      setOrientationRead () {
        const itemSolutionId = this.row.bidOperation.orientation.itemSolutionId
        Api.readOrientation({id: itemSolutionId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            const index = this.table.list.findIndex(d => d.id === body.itemSolutionId)
            const data = Object.assign({}, this.table.list[index], {orientationHandle: 1})
            this.table.list.splice(index, 1, data)

            this.row.bidOperation.orientation.handled = false
            this.table.list[this.row.bidOperation.lastIndex].orientationHandle = 1
            this.$set(this.table.list[index], 'hasOperationNotify', this.hasOperationNotify(this.table.list[index]))
            this.table.list[this.row.bidOperation.lastIndex].orientationHandleTime = body.orientationHandleTime
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      getSurvey () {
        const itemId = this.row.bidOperation.survey.itemId

        this.row.bidOperation.survey.loading = true
        ItemApi.getSurvey({id: itemId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.bidOperation.survey = Object.assign({}, this.row.bidOperation.survey, body.map.survey)
          }
          this.row.bidOperation.survey.loading = false
        })
      },
      getReview () {
        this.row.bidOperation.bidReview.loading = true
        this.row.bidOperation.bidReview.history = []
        const search = Object.assign({}, this.row.bidOperation.bidReview.pagination,
          {itemSolutionId: this.row.bidOperation.bidReview.row.form.itemSolutionId})
        ReviewApi.getHistory({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.bidOperation.bidReview.history = body
            this.row.bidOperation.bidReview.pagination = ResponseParse.pagination(response.headers)
          }
          this.row.bidOperation.bidReview.loading = false
        })
      },
      addBidReview () {
        this.$refs['formBidReview'].validate(valid => {
          if (valid) {
            if (this.row.bidOperation.bidReview.row.type === 'add') {
              ReviewApi.create({form: this.row.bidOperation.bidReview.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.$message.success('新增成功')
                  this.row.bidOperation.bidReview.history.unshift(body)
                  this.row.bidOperation.bidReview.row.form = Object.assign({}, {}, {
                    itemSolutionId: this.row.bidOperation.bidReview.row.form.itemSolutionId
                  })

                  const index = this.table.list.findIndex(item => item.id === body.itemSolutionId)
                  if (index !== -1) {
                    this.$set(this.table.list[index], 'bidReviewRead', 0)
                    this.$set(this.table.list[index], 'hasOperationNotify', this.hasOperationNotify(this.table.list[index]))
                    this.$set(this.row.bidOperation.bidReview.row.form, 'handled', true)
                  }

                  FormTokenApi.create(response => {
                    let status = response.status || 0
                    let body = response.data || []
                    if (status >= 200 && status <= 204) {
                      this.row.bidOperation.bidReview.row.form.token = body.token || ''
                    }
                  })
                } else {
                  this.$message.error(body.error || '操作失败')
                }
              })
            }
            if (this.row.bidOperation.bidReview.row.type === 'edit') {
              ReviewApi.update({
                id: this.row.bidOperation.bidReview.row.form.id,
                form: this.row.bidOperation.bidReview.row.form
              }, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.$message.success('修改成功')
                  let index = this.row.bidOperation.bidReview.history.findIndex(item => item.id === body.id)

                  this.row.bidOperation.bidReview.history[index].bidDatetime = body.bidDatetime
                  this.row.bidOperation.bidReview.history[index].changed = body.changed
                  this.row.bidOperation.bidReview.history[index].content = body.content
                  this.row.bidOperation.bidReview.history[index].id = body.id
                } else {
                  this.$message.error(body.error || '操作失败')
                }
              })
            }
          }
        })
      },
      formatData (data, oldFormat, newFormat) {
        return moment(data, oldFormat).format(newFormat)
      },
      addBidReviewButton () {
        this.row.bidOperation.bidReview.row.type = 'add'

        this.$set(this.row.bidOperation.bidReview.row.form, 'bidDatetime', '')
        this.$set(this.row.bidOperation.bidReview.row.form, 'changed', '')
        this.$set(this.row.bidOperation.bidReview.row.form, 'content', '')
      },
      editBidReviewButton (index) {
        this.row.bidOperation.bidReview.row.type = 'edit'
        let history = this.row.bidOperation.bidReview.history[index]

        this.$set(this.row.bidOperation.bidReview.row.form, 'id', history.id)
        this.$set(this.row.bidOperation.bidReview.row.form, 'bidDatetime', history.bidDatetime)
        this.$set(this.row.bidOperation.bidReview.row.form, 'changed', history.changed)
        this.$set(this.row.bidOperation.bidReview.row.form, 'content', history.content)
      },
      setOperating () {
        Api.readOperating({id: this.row.bidOperation.operating.itemSolutionId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.bidOperation.operating.handled = false
            const index = this.table.list.findIndex(item => item.id === body.itemSolutionId)
            if (index !== -1) {
              this.$set(this.table.list[index], 'operatingProcessRead', body.operatingProcessRead)
              this.$set(this.table.list[index], 'hasOperationNotify', this.hasOperationNotify(this.table.list[index]))
            }
            this.$message.success('设置成功')
          } else {
            this.$message.error(body.error || '设置失败')
          }
        })
      },
      setBidReviewRead () {
        Api.readBidReview({id: this.row.bidOperation.bidReview.row.form.itemSolutionId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.bidOperation.bidReview.row.form.handled = false
            const index = this.table.list.findIndex(item => item.id === body.itemSolutionId)
            if (index !== -1) {
              this.$set(this.table.list[index], 'bidReviewRead', body.bidReviewRead)
              this.$set(this.table.list[index], 'hasOperationNotify', this.hasOperationNotify(this.table.list[index]))
            }
            this.$message.success('已读成功')
          } else {
            this.$message.error(body.error || '已读失败')
          }
        })
      },
      setEditApproval (index) {
        this.row.bidOperation.bidReview.row.form.id = this.row.bidOperation.bidReview.history[index].id
        this.$set(this.row.bidOperation.bidReview.row.form, 'approvalContent', this.row.bidOperation.bidReview.history[index].approvalContent || '')
      },
      editApproval () {
        ReviewApi.approval({
          id: this.row.bidOperation.bidReview.row.form.id,
          form: this.row.bidOperation.bidReview.row.form
        }, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.$message.success('审批成功')
            let index = this.row.bidOperation.bidReview.history.findIndex(item => item.id === body.id)

            this.row.bidOperation.bidReview.history[index].approval = body.approval
            this.row.bidOperation.bidReview.history[index].approver = body.approver
            this.row.bidOperation.bidReview.history[index].approvalTime = body.approvalTime
            this.row.bidOperation.bidReview.history[index].approvalContent = body.approvalContent

            this.row.bidOperation.bidReview.approvalShow = false
            this.row.bidOperation.bidReview.row.form.approvalContent = ''
            FormTokenApi.create(response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                this.row.bidOperation.bidReview.row.form.token = body.token || ''
              }
            })
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      keywordTabChange (tab) {
        this.keywordList = []
        this.row.bidOperation.keyword = {}
        this.row.bidOperation.keyword.activeName = tab.name
        if (tab.name === 'add') {
          // 获得 form token
          FormTokenApi.create(response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.row.bidOperation.keyword.token = body.token || ''
            }
          })
        }
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
      addKeyword () {
        this.$refs['formKeyword'].validate((valid) => {
          if (valid) {
            this.row.bidOperation.keyword.keywords = this.row.bidOperation.keyword.content.replace(/\n/g, '#MS#')
            KeywordApi.create({form: this.row.bidOperation.keyword}, response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                this.$message.success('新增成功')
                this.resetForm('formKeyword')
                FormTokenApi.create(response => {
                  let status = response.status || 0
                  let body = response.data || []
                  if (status >= 200 && status <= 204) {
                    this.row.bidOperation.keyword.token = body.token || ''
                  }
                })
              } else {
                this.$message.error(body.error || '新增失败')
              }
            })
          }
        })
      },
      searchKeyword () {
        ItemIndustryApi.getKeyword({
          id: this.row.bidOperation.keyword.industryId,
          platformId: this.row.bidOperation.keyword.platformId,
          genre: this.row.bidOperation.keyword.genre
        }, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.keywordList = body
          } else {
            this.keywordList = []
            this.$message.error(body.error || '查询失败')
          }
        })
      },
      libraryLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.library.data = {}
          return
        }

        this.remote.library.loading = true
        const search = Object.assign({}, {title: query})
        LibraryApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.remote.library.data = body
          }
          this.remote.library.loading = false
        })
      },
      splitWord () {
        Api.download({
          id: this.row.bidOperation.splitWord.itemSolutionId,
          form: this.row.bidOperation.splitWord
        }, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            window.location.href = '/rest/boss/platform/item-solutions/split-keyword/files/' + body.map.sessionId
          } else {
            this.$message.error(body.error || '导出失败')
          }
        })
      },
      // 修改设备
      updateDevice (index) {
        Api.changeDevice({id: this.table.list[index].id, form: {clientId: this.newClientId}}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)
            this.$message.success('设备更新成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
          this.newClientId = ''
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      getSummaries (param) {
        let {columns, data} = param
        let sums = []

        if (data.length === 0) {
          return sums
        }

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }

          let values = data.map(item => Number(item[column.property]))

          if (column.property === 'budget' || column.property === 'talkPrice' || column.property === 'feedbackPrice') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            } else {
              sums[index] = 0
            }
          }
          if (column.property === 'budget') {
            sums[index] = sums[index].toFixed(2)
          }
        })

        return sums
      },
      changedFieldIsExist (field) {
        if (!this.row.bidOperation.orientation.handled) {
          return false
        }
        for (let i in this.row.bidOperation.orientation.current.changedField) {
          if (this.row.bidOperation.orientation.current.changedField[i] === field) {
            return true
          }
        }
        return false
      },
      isRegulator (id) {
        const idx = this.table.list.findIndex(item => item.id === id)
        if (idx >= 0) {
          return this.$store.state.user.info.id === this.table.list[idx].regulatorId
        } else {
          return false
        }
      },
      deleteRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
  @import "../../../assets/styles/env";

  .ms-table {
    width: 100%;
    border-collapse: collapse;
    font-size: $size-small;
    line-height: $size-small;
    th {
      padding: 8px 5px;
    }
    td, th {
      border: 1px solid $color-white-tint;
      text-align: center;
      word-break: break-all;
      padding: 5px;
      &.left {
        text-align: left;
      }
      p {
        margin: 2px 0;
      }
    }
    &.ms-table-striped {
      tr:nth-child(even) {
        td {
          background-color: $color-tint;
        }
      }
    }
  }

  .ms-feedback-code {
    font-size: $size-normal;
    line-height: 23px;
    &-thumb {
      width: 280px;
      height: 280px;
    }
    .ms-feedback-code-thumb {
      margin-top: 5px;
    }
    .el-textarea {
      margin-bottom: 5px;
      font-size: $size-small;
      line-height: $size-small;
    }
    .examine-title, .explain-list, .explain-title {
      padding-left: 5px;
      li {
        line-height: 25px;
      }
    }
    .explain-list {
      a {
        color: #409EFF;
      }
      .explain-list-tactics {
        list-style: circle;
        padding-left: 30px;
        .ms-blue {
          color: #0000FF;
        }
      }
      .custom-code {
        width: 96%;
        min-height: 80px;
        line-height: 1.2em;
      }
    }
    .examine-title, .explain-title {
      margin: 0;
      line-height: 18px;
      font-weight: bold;
    }
    .examine-list, .explain-list {
      margin: 5px 0;
      padding-left: 15px;
    }
    .explain-title {
      font-size: 16px;
      margin: 0;
    }
    .list-bottom {
      margin: 10px 0 -5px;
    }
    .examine-list {
      width: 95%;
      .control-label {
        margin: 0;
      }
      .inputBox {
        width: 80%;
        display: inline-block;
      }
      button {
        margin-top: 5px;
        height: 31px;
      }
    }

  }

  .bid-work {
    .item {
      position: relative;
      overflow: hidden;
      background-color: rgba(64, 158, 255, 0.05);
      padding-left: 10px;
      margin-bottom: 30px;
      width: 449px;
      border-radius: 5px;
      border: #c0c4cc 1px solid;
      .title {
        display: flex;
        padding: 10px 0 10px 3px;
        .add-time {
          color: #6FA5DB;
          width: 100px;
        }
      }
      .outer-content {
        overflow-y: scroll;
        width: 483px;
      }
      .content {
        padding: 10px 16px;
        word-wrap:break-word;
        max-height: 300px;
        background-color: rgb(199, 231, 247);
        overflow: hidden;
        overflow-y: auto;
        /*&::-webkit-scrollbar {display:none}*/
        *{
          margin: 0;
          padding: 0;
        }
      }
      .approve {
        padding-top: 5px;
        padding-left: 10px;
        border-left: #c0c4cc 2px solid;
        border-top: #c0c4cc 1px solid;
        .approve-title {
          display: flex;
          .approve-user {
            width: 80px;
          }
          .approve-time {
            margin-left: 10px;
            color: #6FA5DB;
          }
        }
        .approve-content {
          margin: 5px 0;
          color: $color-black;
          background-color: rgb(199, 231, 247);
          word-wrap:break-word
        }
      }
    }
  }

  .bid-review {
    .record {
      margin:19px 0 22px 0;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      width: 346px;
      height: 32px;
      .head{
        font-size: 16px;
        font-weight: 700;
        opacity: 0.7;
      }
      .handled {
        display: flex;
        justify-content: space-between;
        width: 147px;
      }
    }
    .item {
      border-radius: 5px;
      margin-left:54px;
      background-color: rgba(64, 158, 255, 0.05);
      margin-bottom: 30px;
      padding: 10px;
      width: 270px;
      border: #c0c4cc 1px solid;
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        color: #6FA5DB;
        .time-space {
          font-family: SimHei;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .handle {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
      }
      .title {
        color: #98cc7b;
        display: flex;
        align-items: center;
        .user {
          color: #98cc7b;
          width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .time {
          color: rgba(111, 165, 219, 0.6);
          margin-left: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .content {
        margin: 5px 0;
        padding:5px;
        color: #4c555a;
        background-color: rgb(199, 231, 247);
        word-wrap:break-word;
      }
      .approve {
        padding-top: 5px;
        padding-left: 10px;
        border-left: #98cc7b 2px solid;
        .approve-title {
          display: flex;
          color: #98cc7b;
          .approve-user {
            width: 80px;
          }
          .approve-time {
            color: rgba(111, 165, 219, 0.9);
            margin-left: 10px;
          }
        }
        .approve-content {
          margin: 5px 0;
          width: 100%;
          color: #4c555a;
          background-color: rgb(199, 231, 247);
          word-wrap:break-word;
        }
      }
    }
  }

  .cell-box {
    .data-id {
      display: flex;
      align-items: center;
      .content {
        height: 23px;
        position: absolute;
        left: 40px;
      }
    }
    .data-itemTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content {
        display: flex;
        .content-icon {
          width: 25px;
        }
      }
      .icon {
        height: 23px;
        display: flex;
        align-items: center;
      }
    }
    .data-accountTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content {
        display: flex;
        .content-icon {
          width: 25px;
        }
      }
    }
    .data-budget {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon {
        height: 23px;
        display: flex;
        align-items: center;
      }
    }
    .data-feedbackPrice {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .data-regulator {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        height: 23px;
        position: absolute;
        right: 0;
        display: flex;
      }
    }
    .data-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon {
        height: 23px;
        display: flex;
        align-items: center;
      }
    }
    .el-button {
      padding: 0;
    }
  }

  .more {
    color: $color-info;
    font-size: $size-small;
  }
</style>
