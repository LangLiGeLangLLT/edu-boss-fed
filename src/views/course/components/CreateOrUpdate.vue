<template>
  <el-card>
    <div slot="header">
      <el-steps :active="activeStep" simple>
        <el-step
          v-for="(item, index) in steps"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          @click.native="activeStep = index"
        />
      </el-steps>
    </div>

    <el-form label-width="80px">
      <div v-show="activeStep === 0">
        <el-form-item label="课程名称">
          <el-input
            v-model="course.courseName"
          ></el-input>
        </el-form-item>

        <el-form-item label="课程简介">
          <el-input
            v-model="course.brief"
          ></el-input>
        </el-form-item>

        <el-form-item label="课程概述">
          <el-input
            style="margin-bottom: 16px"
            type="textarea"
            v-model="course.previewFirstField"
            placeholder="概述1"
          ></el-input>

          <el-input
            type="textarea"
            v-model="course.previewSecondField"
            placeholder="概述2"
          ></el-input>
        </el-form-item>

        <el-form-item label="讲师姓名">
          <el-input
            v-model="course.teacherDTO.teacherName"
          ></el-input>
        </el-form-item>

        <el-form-item label="讲师简介">
          <el-input
            v-model="course.teacherDTO.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="课程排序">
          <el-input-number
            v-model="course.sortNum"
          ></el-input-number>
        </el-form-item>
      </div>

      <div v-show="activeStep === 1">
        <el-form-item label="课程封面">
          <!--
            1. 组件需要根据绑定的数据进行图片预览
            2. 组件需要把上传成功的图片地址同步到绑定的数据中

            v-model 的本质还是父子组件通信
              1. 它会给自举荐传递一个名字叫 value 的数据
              2. 默认监听 input 事件，修改绑定的数据（自定义事件）
          -->
          <course-image v-model="course.courseListImg" />
        </el-form-item>

        <el-form-item label="介绍封面">
          <course-image v-model="course.courseImgUrl" />
        </el-form-item>
      </div>

      <div v-show="activeStep === 2">
        <el-form-item label="售卖价格">
          <el-input
            placeholder="请输入内容"
            v-model.number="course.discounts"
            type="number"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="商品原价">
          <el-input
            placeholder="请输入内容"
            v-model.number="course.price"
            type="number"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="销量">
          <el-input
            placeholder="请输入内容"
            v-model.number="course.sales"
            type="number"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="活动标签">
          <el-input
            placeholder="请输入内容"
            v-model="course.discountsTag"
          />
        </el-form-item>
      </div>

      <div v-show="activeStep === 3">
        <el-form-item label="秒杀开关">
          <el-switch
            v-model="course.activityCourse"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <template v-if="course.activityCourse">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="course.activityCourseDTO.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间">
            <el-date-picker
              v-model="course.activityCourseDTO.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="秒杀价">
            <el-input
              v-model.number="course.activityCourseDTO.amount"
              type="number"
              placeholder="请输入内容"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="秒杀库存">
            <el-input
              v-model.number="course.activityCourseDTO.stock"
              type="number"
              placeholder="请输入内容"
            >
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </template>
      </div>

      <div v-show="activeStep === 4">
        <el-form-item label="课程详情">
          <text-editor
            type="textarea"
            v-model="course.courseDescriptionMarkDown"
          />
        </el-form-item>

        <el-form-item label="是否发布">
          <el-switch
            v-model="course.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </div>

      <el-form-item>
        <el-button
          v-if="0 <= activeStep && activeStep < 4"
          @click="activeStep++"
        >下一步</el-button>

        <el-button
          v-else
          type="primary"
          @click="handleSave"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course';
import CourseImage from './CourseImage.vue';
import TextEditor from '@/components/TextEditor/index.vue';

export default Vue.extend({
  name: 'CourseCreateOrEdit',
  components: {
    CourseImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-upload' },
        { title: '销售信息', icon: 'el-icon-picture' },
        { title: '秒杀活动', icon: 'el-icon-picture' },
        { title: '课程详情', icon: 'el-icon-picture' }
      ],
      imageUrl: '',
      course: {
        courseName: '',
        brief: '',
        teacherDTO: {
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0, // 0：未发布，1：已发布
        sales: 0,
        activityCourse: false, // 是否开启活动秒杀
        activityCourseDTO: {
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.$router.push({ name: 'course' })
      } else {
        this.$message.error('保存失败')
      }
    },

    async loadCourse() {
      const { data } = await getCourseById(this.courseId)
      this.course = data.data
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
