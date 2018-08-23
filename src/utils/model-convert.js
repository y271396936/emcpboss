import Qs from 'qs'
// import { FormArgument, SearchArgument } from '../models/global'

const isBlank = (value) => {
  return value === null || value === ''
}

const convert = (input, target) => {
  const params = {}
  if (input === null || typeof input !== 'object') {
    return params
  }

  // 当目标类中存在该 key ，且其值不为空时，才有效
  for (let key in input) {
    if (input.hasOwnProperty(key) && !isBlank(input[key]) &&
      target.hasOwnProperty(key)) {
      params[key] = input[key]
    }
  }

  return params
}

/**
 * 转成搜索参数
 * @param search 搜索条件，必须是一个 Object 类型的值
 * @param Target 目标类。自定义查询类
 * @returns {{}}
 */
const toJson = (search, Target) => {
  // const params = {}
  //
  // if (Object.getPrototypeOf(Target) !== SearchArgument) {
  //   return params
  // }

  return convert(search, new Target())
}

/**
 * 转成 post 表单参数
 * @param form 表单条件，必须是一个 Object 类型的值
 * @param Target 目标类。自定义表单类
 * @returns {*}
 */
const toStringify = (form, Target) => {
  // const params = {}
  //
  // if (Object.getPrototypeOf(Target) !== FormArgument) {
  //   return params
  // }

  return Qs.stringify(convert(form, new Target()))
}

export default {
  toJson,
  toStringify
}
