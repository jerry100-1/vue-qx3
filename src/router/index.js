import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Complaint from '@/pages/complaint/Complaint'
import ComplaintDetail from '@/pages/complaint/ComplaintDetail'
import ComplaintResult from '@/pages/complaint/ComplaintResult'
import Home from '@/pages/Home'
import Authorize from '@/pages/Authorize'
import My from '@/pages/My'
import TarotReport from '@/pages/TarotReport'
import BaziReport from '@/pages/BaziReport'
import Archive from '@/pages/Archive'
import EditArchive from '@/pages/EditArchive'
import Coupon from '@/pages/Coupon'
import Recruit from '@/pages/Recruit'
import RecruitInfo from '@/pages/RecruitInfo'
import Pay from '@/pages/Pay'
import PayResult from '@/pages/PayResult'

Vue.use(Router)
Vue.use(require('vue-wechat-title'))

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: '/home',
      component: Index,
      meta: { title: '测测运势' },
      children: [
        { path: 'home', name: 'Home', component: Home, meta: { title: '测测运势' }},
        { path: 'my', name: 'My', component: My, meta: { title: '我的' }}
      ]
    },
    { path: '/authorize', name: 'Authorize', component: Authorize, meta: { title: '授权登录' }},
    { path: '/tarot-report', name: 'TarotReport', component: TarotReport, meta: { title: '塔罗占卜报告' }},
    { path: '/bazi-report', name: 'BaziReport', component: BaziReport, meta: { title: '八字测算报告' }},
    { path: '/archive', name: 'Archive', component: Archive, meta: { title: '档案管理' }},
    { path: '/edit-archive', name: 'EditArchive', component: EditArchive},
    { path: '/coupon', name: 'Coupon', component: Coupon},
    { path: '/recruit', name: 'Recruit', component: Recruit, meta: { title: '大师招募' }},
    { path: '/recruit-info', name: 'RecruitInfo', component: RecruitInfo, meta: { title: '大师招募' }},
    { path: '/complaint', name: 'Complaint', component: Complaint, meta: {title: '投诉'}},
    { path: '/complaintDetail', name: 'ComplaintDetail', component: ComplaintDetail, meta: {title: '投诉'}},
    { path: '/complaintResult', name: 'ComplaintResult', component: ComplaintResult, meta: {title: '投诉'}},
    { path: '/pay', name: 'Pay', component: Pay, meta: {title: '支付'}},
    { path: '/pay-result', name: 'PayResult', component: PayResult, meta: {title: '支付结果'}}
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? { x: savedPosition.x, y: savedPosition.y } : { x: 0, y: 0 }
  }
})
