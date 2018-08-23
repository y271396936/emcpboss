<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>透视表导入</el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-card class="tips-card">
      <ol>
        <li>
          所有上传文件，请<span class="ms-danger">保持原始内容不要修改</span>，文件名部分不可以修改，
          具体请选择个数据类型查看说明
        </li>
        <li>
          如果一定需要修改：<span class="ms-danger">请勿使用Excel进行编辑Csv格式文件</span>，
          因为Excel软件在保存时，会改变上传文件原来的格式，从而造成无法上传。<br/>
          推荐使用 <a href="https://notepad-plus-plus.org/" target="_blank">NotePad++</a> 操作Csv文件
        </li>
        <li><strong class="ms-danger">因为单日数据量巨大，程序处理可能需要10~30分钟，甚至更长，请耐心等待</strong></li>
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
        <el-select v-model="form.typeId">
          <el-option-group v-if="form.platformId === 1" label="百度">
            <el-option label="百度PC" :value="1"></el-option>
            <el-option label="百度信息流" :value="7"></el-option>
          </el-option-group>
          <el-option-group v-if="form.platformId === 2" label="360">
            <el-option label="360竞价" :value="3"></el-option>
          </el-option-group>
          <el-option-group v-if="form.platformId === 3" label="搜狗">
            <el-option label="搜狗竞价" :value="4"></el-option>
          </el-option-group>
          <el-option-group v-if="form.platformId === 4" label="神马">
            <el-option label="神马竞价" :value="5"></el-option>
          </el-option-group>
          <el-option-group v-if="form.platformId === 6" label="今日头条">
            <el-option label="今日头条信息流" :value="9"></el-option>
          </el-option-group>
          <el-option-group v-if="form.platformId === 7" label="UC头条">
            <el-option label="UC信息流" :value="10"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="报告类型" prop="reportGenre" :rules="[{required: true, message: '必填'}]">
        <el-select v-model="form.reportGenre">
          <el-option label="关键词报告" :value="1"></el-option>
          <el-option label="地域报告" :value="2"></el-option>
          <el-option label="分时报告" :value="3"></el-option>
            <el-option label="搜索词报告" :value="4"></el-option>
          <el-option label="操作系统报告" :value="5"></el-option>
          <el-option label="年龄报告" :value="6"></el-option>
          <el-option label="兴趣报告" :value="7"></el-option>
          <el-option label="性别报告" :value="8"></el-option>
          <el-option label="平台报告" :value="9"></el-option>
          <el-option label="网络报告" :value="10"></el-option>
          <el-option label="学历报告" :value="11"></el-option>
          <el-option label="头条位置报告" :value="12"></el-option>
          <el-option label="意图词报告" :value="14"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件模式" prop="fileMode" :rules="[{required: true, message: '必填'}]">
        <el-select v-model="form.fileMode">
          <el-option label="直接导出" :value="1"></el-option>
          <el-option label="手动复制成Excel表格" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(form.typeId === 1 && form.fileMode === 2 && form.reportGenre === 1) ||
        (form.typeId === 1 && form.fileMode === 1 && form.reportGenre === 4) ||
        (form.typeId === 3 && form.fileMode === 2 && form.reportGenre === 1) ||
        (form.typeId === 4 && form.fileMode === 1 && form.reportGenre === 4) ||
        (form.typeId === 5 && form.fileMode === 1 && form.reportGenre === 1) ||
        (form.typeId === 7 && form.fileMode === 1 && form.reportGenre === 3) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 7) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 2) ||
        (form.typeId === 9 && form.fileMode === 1 && form.reportGenre === 3) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 5) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 6) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 8) ||
        (form.typeId === 9 && form.fileMode === 1 && form.reportGenre === 12) ||
        (form.typeId === 9 && form.fileMode === 1 && form.reportGenre === 13) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 2) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 5) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 6) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 7) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 8)"
                    label="数据账户" prop="accountId" :rules="[{required: true, message: '必填'}]">
        <el-select v-model="form.accountId" filterable remote placeholder="请输入关键字" :remote-method="getAccount"
                   :loading="remote.account.loading">
          <template v-for="account in remote.account.list">
            <el-option :label="account.name" :value="account.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item v-if="(form.typeId === 1 && form.fileMode === 2 && form.reportGenre === 1) ||
        (form.typeId === 4 && form.fileMode === 1 && form.reportGenre === 3) ||
        (form.typeId === 3 && form.fileMode === 1 && form.reportGenre === 2) ||
        (form.typeId === 3 && form.fileMode === 2 && form.reportGenre === 4) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 2) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 5) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 6) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 7) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 8) ||
        (form.typeId === 9 && form.fileMode === 1 && form.reportGenre === 13) ||
        (form.typeId === 3 && form.fileMode === 2 && form.reportGenre === 1)"
                    label="数据时间" prop="dataTime" :rules="[{required: true, message: '必填'}]">
        <el-date-picker v-model="form.dataTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item v-if="(form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 5) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 2) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 6) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 7) ||
        (form.typeId === 10 && form.fileMode === 1 && form.reportGenre === 8) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 2) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 5) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 6) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 7) ||
        (form.typeId === 9 && form.fileMode === 2 && form.reportGenre === 8)"
                    label="推广计划" prop="planTitle" :rules="[{required: true, message: '必填'}]">
        <el-input style="width:215px" v-model="form.planTitle"/>
      </el-form-item>
      <el-form-item label="文件" prop="file" :rules="[{required: true, message: '必填'}]">
        <input id="file" type="file" accept="file/csv,file/xls,file/xlsx" name="file" @change="onFileChange"/>
      </el-form-item>
      <el-form-item label="操作">
        <el-checkbox v-model="form.ignoreNotCost">忽略「无展现且无消费」的数据</el-checkbox>
        <br>
        <el-checkbox v-model="form.fileOptional">忽略「无后缀」的数据</el-checkbox>
        <br>
        <el-checkbox v-model="form.mergeDuplicate">合并文件中重复数据</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">提交</el-button>
      </el-form-item>
    </el-form>

    <template v-if="form.typeId === 1 && form.reportGenre === 1 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为时间范围，第二行为标题，第三行为账户名，第四行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li>
              账户&nbsp;&nbsp;推广计划名称&nbsp;&nbsp;推广计划状态&nbsp;&nbsp;
              推广计划启用/暂停信息&nbsp;&nbsp;推广计划每日预算&nbsp;&nbsp;推广计划创意展示方式&nbsp;&nbsp;推广单元名称&nbsp;&nbsp;
              推广单元状态&nbsp;&nbsp;推广单元启用/暂停信息&nbsp;&nbsp;推广单元出价&nbsp;&nbsp;推广单元分匹配出价系数&nbsp;&nbsp;
              推广单元移动出价比例&nbsp;&nbsp;推广单元计算机出价比例&nbsp;&nbsp;推广单元设备类型&nbsp;&nbsp;关键词名称&nbsp;&nbsp;
              关键词状态&nbsp;&nbsp;关键词所属监控文件夹个数&nbsp;&nbsp;关键词启用/暂停信息&nbsp;&nbsp;关键词出价&nbsp;&nbsp;
              关键词计算机质量度&nbsp;&nbsp;关键词移动质量度&nbsp;&nbsp;关键词匹配模式&nbsp;&nbsp;关键词访问URL&nbsp;&nbsp;
              关键词移动访问URL&nbsp;&nbsp;创意标题&nbsp;&nbsp;创意描述1&nbsp;&nbsp;创意描述2&nbsp;&nbsp;创意默认访问URL&nbsp;&nbsp;
              创意默认显示URL&nbsp;&nbsp;创意移动访问URL&nbsp;&nbsp;创意移动显示URL&nbsp;&nbsp;创意状态&nbsp;&nbsp;
              创意启用/暂停信息&nbsp;&nbsp;创意设备偏好&nbsp;&nbsp;消费&nbsp;&nbsp;平均点击价格&nbsp;&nbsp;点击&nbsp;&nbsp;
              展现&nbsp;&nbsp;点击率&nbsp;&nbsp;转化&nbsp;&nbsp;千次展现消费&nbsp;&nbsp;计算机消费&nbsp;&nbsp;
              计算机平均点击价格&nbsp;&nbsp;计算机点击&nbsp;&nbsp;计算机展现&nbsp;&nbsp;计算机点击率&nbsp;&nbsp;计算机转化&nbsp;&nbsp;
              计算机千次展现消费&nbsp;&nbsp;移动消费&nbsp;&nbsp;移动平均点击价格&nbsp;&nbsp;移动点击&nbsp;&nbsp;移动展现&nbsp;&nbsp;
              移动点击率&nbsp;&nbsp;移动转化&nbsp;&nbsp;移动千次展现消费
            </li>
            <li>商机在线87</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 1 && form.reportGenre === 1 && form.fileMode ===2">
      <ol>
        <li>支持文件类型：EXCEL（.xlsx）</li>
        <li>
          第一行为标题，第二行开始为数据。标题格式如下：<br/>
          <ol class="code-light">
            <li class="ms-danger">
              推广计划名称,推广单元名称,关键词名称,匹配模式,出价,访问URL,移动访问URL,启用/暂停,关键词状态,标记,计算机质量度,
              移动质量度,消费,平均点击价格,点击,展现,点击率,网页转化,千次展现消费,平均转化价格
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 1 && form.reportGenre === 2 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          前七行为概述内容，第八行为标题，第九行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li>数据生成时间：2017-10-10 14:02,,,,,,,,,</li>
            <li>数据生成条件：,,,,,,,,,</li>
            <li>1. 时间范围：20171009,,,,,,,,,</li>
            <li>2. 时间单位：合计,,,,,,,,,,</li>
            <li>3. 推广设备：移动设备，计算机,,,,,,,,,</li>
            <li>4. 投放网络：全部,,,,,,,,,</li>
            <li></li>
            <li class="ms-danger">日期,账户,推广计划,省,市,展现,点击,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 1 && form.reportGenre === 3 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          前七行为概述内容，第八行为标题，第九行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li>数据生成时间：2017-10-10 14:06,,,,,,,,,</li>
            <li>数据生成条件：,,,,,,,,,</li>
            <li>1. 时间范围：20171009,,,,,,,,,</li>
            <li>2. 时间单位：分时,,,,,,,,</li>
            <li>3. 推广设备：移动设备，计算机,,,,,,,,,</li>
            <li>4. 投放网络：全部,,,,,,,,,</li>
            <li></li>
            <li class="ms-danger">日期,小时,账户,推广计划,展现,点击,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 1 && form.reportGenre === 4 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          前八行为概述内容，第九行为标题，第十行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li>数据生成时间：2017-10-24 10:00</li>
            <li>数据生成条件：</li>
            <li>1. 时间范围：20171023</li>
            <li>2. 时间单位：合计</li>
            <li>3. 推广设备：移动设备，计算机</li>
            <li>4. 投放网络：全部</li>
            <li>5. 投放物料：全部</li>
            <li></li>
            <li class="ms-danger">日期,推广计划,推广单元,关键词,搜索词,当前单元的添加状态,展现,
              点击,消费,点击率,总转化量,精确匹配扩展(地域词扩展)触发,高级精确匹配触发
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 3 && form.reportGenre === 1 && form.fileMode ===2">
      <ol>
        <li>支持文件类型：XLSX（.xlsx）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li class="ms-danger">"关键词ID","推广计划","推广组","关键词","匹配方式","出价","访问网址",
              "移动访问网址","质量度","移动质量度","启用/暂停","点击","展示","消费","点击率","平均点击率"
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 3 && form.reportGenre === 2 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li class="ms-danger">推广账户,产品线,推广计划,省级地区,市级地区,展示次数,点击次数,点击率,总费用,平均每次点击费用</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 3 && form.reportGenre === 4 && form.fileMode ===2">
      <ol>
        <li>支持文件类型：XLSX（.xlsx）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：<br/>
          <ol class="code-light">
            <li class="ms-danger">推广账户,产品线,推广计划,推广组,创意,创意描述1,创意描述2,
              触发模式,关键词,搜索词,展示次数,点击次数,点击率,总费用,平均每次点击费用
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 4 && form.reportGenre === 1 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为时间范围，第二行为标题，第三行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li>显示以下时间范围内的全部设备:2017/10/22 - 2017/10/22</li>
            <li></li>
            <li class="ms-danger">"账号","推广计划","推广计划状态","推广计划启用/暂停","
              推广计划每日预算","内容关联","推广组","推广组出价","推广组启用/暂停","推广组状态","关键词","关键词状态",
              "关键词启用/暂停","关键词质量度","关键词移动质量度","关键词匹配方式","关键词出价","关键词访问URL",
              "关键词移动访问URL","能否展现","创意标题","创意描述1","创意描述2","创意启用/暂停","创意显示URL","创意访问URL",
              "创意移动显示URL","创意移动访问URL","创意状态","消耗","点击价格","点击数","展示数","点击率",
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 4 && form.reportGenre === 2 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行为总计内容，第三行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">编号,日期,账户,推广计划,省级地域,市级地域,消耗,消耗占比,点击数,点击数占比,点击均价</li>
            <li>总计,--,--,4475.35,375,11.93</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 4 && form.reportGenre === 3 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行为总计内容，第三行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">时间,账户,推广计划,消耗,点击数,点击均价</li>
            <li>总计,--,--,4475.35,375,11.93</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 4 && form.reportGenre === 4 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行为总计内容，第三行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">编号,日期,推广计划,推广组,创意标题,创意描述1,创意描述2,
              创意访问URL,创意展示URL,关键词,搜索词,消耗,点击数,点击均价,搜索词是否已添加为关键词,搜索词是否已添加为否词
            </li>
            <li>总计,--,--,--,--,--,--,--,--,--,--,4475.35,375,11.93,--,--</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 5 && form.reportGenre === 1 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">"日期","关键词","状态","启用/暂停","出价","匹配模式","访问URL",
              "推广单元","推广计划","消费","平均点击价格","点击","展示","点击率"
            </li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 5 && form.reportGenre === 2 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">"时间",账户,推广计划,地域ID,省级地域,地市级地域,展现量,点击量,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 5 && form.reportGenre === 3 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"时间",账户,推广计划,展现量,点击量,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 5 && form.reportGenre === 4 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"时间",账户,推广计划,推广单元,创意,关键词,搜索词,匹配方式,展现量,点击量,消费,点击率,当前单元添加状态</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre === 9 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,平台,展现,点击,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre === 10 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,网络,展现,点击,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre === 11 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,学历,展现,点击,消费,点击率,平均点击价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 9 && form.reportGenre === 3 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;时间,广告计划id,广告计划,广告组id,广告组,展示数,点击数,点击率,平均点击价格,平均千次展现费用,总花费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 9 && form.reportGenre === 12 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;时间,广告计划id,广告计划,广告组id,广告组,投放位置,展示数,点击数,点击率,平均点击价格,平均千次展现费用,总花费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre === 2 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li>数据生成时间：2018-04-20 13:59,,,,,,,,</li>
            <li>数据生成条件：,,,,,,,,</li>
            <li>1. 时间范围：20180419,,,,,,,,</li>
            <li></li>
            <li class="ms-danger">日期	,账户,推广计划,推广单元,省,市,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre === 3 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li>数据生成时间：2018-04-20 13:59,,,,,,,,</li>
            <li>数据生成条件：,,,,,,,,</li>
            <li>1. 时间范围：20180419,,,,,,,,</li>
            <li></li>
            <li class="ms-danger">日期,小时,推广计划,推广计划ID,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10 && form.reportGenre === 2 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,省id,省,市id,市,展现,点击,消费,点击率,平均点击价格,千次展现价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10 && form.reportGenre === 3 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期	,时间,账户id,账户,计划id,计划,展现,点击,消费,点击率,平均点击价格,千次展现价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10 && form.reportGenre === 5 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"日期",平台,展现,点击,消费,点击率,平均点击价格,千次展现价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10 && form.reportGenre === 6 && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"日期",年龄,展现,点击,消费,点击率,平均点击价格,千次展现价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10 && form.reportGenre ===7  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"日期",兴趣分类,展现,点击,消费,点击率,平均点击价格,千次展现价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 10 && form.reportGenre ===7  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第一行为标题，第二行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;"日期",兴趣分类,展现,点击,消费,点击率,平均点击价格,千次展现价格</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre ===5  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>数据生成时间：</li>
        <li>数据生成条件：</li>
        <li>1. 时间范围：</li>
        <li></li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,平台,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre ===6  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>数据生成时间：</li>
        <li>数据生成条件：</li>
        <li>1. 时间范围：</li>
        <li></li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,年龄,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre ===7  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>数据生成时间：</li>
        <li>数据生成条件：</li>
        <li>1. 时间范围：</li>
        <li></li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,一级兴趣,二级兴趣,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre ===8  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>数据生成时间：</li>
        <li>数据生成条件：</li>
        <li>1. 时间范围：</li>
        <li></li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,性别,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 7 && form.reportGenre ===14  && form.fileMode ===1">
      <ol>
        <li>支持文件类型：CSV（.csv）</li>
        <li>
          第五行为标题，第六行开始为数据。头部格式如下：
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;日期,账户,推广计划,推广单元,意图词,展现,点击,消费,点击率,平均点击价格,千次展现消费</li>
          </ol>
        </li>
      </ol>
    </template>

    <template v-if="form.typeId === 9 && form.reportGenre >= 5 && form.reportGenre <= 8 && form.fileMode ===2">
      <ol>
        <li>支持文件类型：EXCEL（.xls）</li>
        <li>
          总共7个工作表，每个工作表的第一行为标题，第二行开始为数据。
          <br/>
          <ol class="code-light">
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;工作表省级地域：省级地域 	展示数 展示数TGI	 点击数	点击TGI 点击率(%)	平均点击单价(元)	平均千次展现费用(元)	总花费(元)</li>
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;工作表地级市：省级地域	 地级市	展示数	 展示数TGI 点击数 点击TGI	点击率(%)	平均点击单价(元)	平均千次展现费用(元)	总花费(元)</li>
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;工作表性别：性别	展示数 展示数TGI	点击数 点击TGI	点击率(%)	平均点击单价(元)	平均千次展现费用(元)	总花费(元)</li>
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;工作表年龄：年龄	展示数	 展示数TGI 点击数 点击TGI	点击率(%)	平均点击单价(元)	平均千次展现费用(元)	总花费(元)</li>
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;</li>
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;</li>
            <li class="ms-danger">&nbsp;&nbsp;&nbsp;工作表设备：设备	展示数 展示数TGI	点击数 点击TGI	 点击率(%)	平均点击单价(元)	平均千次展现费用(元)	总花费(元)</li>
          </ol>
        </li>
      </ol>
    </template>

  </div>
</template>

<script>
  import ChannelAccountApi from '@/api/platform/channel-account'
  import KeywordApi from '@/api/report/keyword-report'
  import RegionApi from '@/api/report/region-report'
  import SearchKeywordApi from '@/api/report/search-keyword-report'
  import TimeShareApi from '@/api/report/time-share-report'
  import AgeRangeApi from '@/api/report/age-range-report'
  import GenderApi from '@/api/report/gender-report'
  import InterestTypeApi from '@/api/report/interest-type-report'
  import OperatingSystemApi from '@/api/report/operating-system-report'
  import PlatformApi from '@/api/report/platform-report'
  import NetworkApi from '@/api/report/network-report'
  import EducationApi from '@/api/report/education-report'
  import LcationApi from '@/api/report/location-report'
  import IntentionWordApi from '@/api/report/intention-word'
  import FormTokenApi from '@/api/system/form-token'
  import { PLATFORM_LIST } from '@/utils/constants'

  export default {
    data () {
      return {
        form: {
          ignoreNotCost: true
        },
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

            let api = ''
            switch (this.form.reportGenre) {
              case 1:
                api = KeywordApi
                break
              case 2:
                api = RegionApi
                break
              case 3:
                api = TimeShareApi
                break
              case 4:
                api = SearchKeywordApi
                break
              case 5:
                api = OperatingSystemApi
                break
              case 6:
                api = AgeRangeApi
                break
              case 7:
                api = InterestTypeApi
                break
              case 8:
                api = GenderApi
                break
              default:
                break
              case 9:
                api = PlatformApi
                break
              case 10:
                api = NetworkApi
                break
              case 11:
                api = EducationApi
                break
              case 12:
                api = LcationApi
                break
              case 14:
                api = IntentionWordApi
            }
            api.import({form: this.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                this.$message.success('导入成功')
              } else {
                this.$message.error(body.error || '导入失败')
              }
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
        if ((this.form.typeId === 1 && this.form.fileMode === 2 && this.form.reportGenre === 1) ||
          (this.form.typeId === 1 && this.form.fileMode === 1 && this.form.reportGenre === 4) ||
          (this.form.typeId === 3 && this.form.fileMode === 2 && this.form.reportGenre === 1) ||
          (this.form.typeId === 4 && this.form.fileMode === 1 && this.form.reportGenre === 4) ||
          (this.form.typeId === 5 && this.form.fileMode === 1 && this.form.reportGenre === 1) ||
          (this.form.typeId === 7 && this.form.fileMode === 1 && this.form.reportGenre === 3) ||
          (this.form.typeId === 9 && this.form.fileMode === 1 && this.form.reportGenre === 3) ||
          (this.form.typeId === 9 && this.form.fileMode === 1 && this.form.reportGenre === 12) ||
          (this.form.typeId === 9 && this.form.fileMode === 2 && this.form.reportGenre === 2) ||
          (this.form.typeId === 9 && this.form.fileMode === 2 && this.form.reportGenre === 7) ||
          (this.form.typeId === 9 && this.form.fileMode === 2 && this.form.reportGenre === 5) ||
          (this.form.typeId === 9 && this.form.fileMode === 2 && this.form.reportGenre === 6) ||
          (this.form.typeId === 9 && this.form.fileMode === 2 && this.form.reportGenre === 8) ||
          (this.form.typeId === 10 && this.form.fileMode === 1 && this.form.reportGenre === 2) ||
          (this.form.typeId === 10 && this.form.fileMode === 1 && this.form.reportGenre === 5) ||
          (this.form.typeId === 10 && this.form.fileMode === 1 && this.form.reportGenre === 6) ||
          (this.form.typeId === 10 && this.form.fileMode === 1 && this.form.reportGenre === 7) ||
          (this.form.typeId === 10 && this.form.fileMode === 1 && this.form.reportGenre === 8)) {
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
