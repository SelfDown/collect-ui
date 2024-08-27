import handlerAction from "./handlerAction"
import { App } from "antd"
import varValue from "./varValue"
import {getResult} from "./result";

/**
 * 批量处理动作
 * @param actions
 * @param store
 * @param useApp
 */
export default async function handlerActions(
  actions: any[],
  store: any,
  rootStore: any,
  useApp: App.useApp,
  target?: any,
  init?:boolean
) {
  for (let i = 0; i < actions.length; i++) {
    let { enable, useStore,fail_action,before_render, ...rest } = actions[i]
    // 初始化一次，启动
    if(before_render && !init){
      continue
    }
    // 未启用
    if (enable) {
      const enableValue = varValue(enable, store, target)
      if (!enableValue) {
        continue
      }
    }
    // 为了处理可能用store 又可能用传来变量，加个标志
    // 如果指定useStore ，则target 设置 null 即可，就会用store的变量
    console.log("【执行动作】",rest.description)
    const result = await handlerAction(
      rest,
      store,
      rootStore,
      useApp,
      useStore ? null : target,
    )
    if (!result.success) {
      // 遇到fail_action，运行错误操作，必填未登录，弹登录登录对话框
      // 这里没有递归，只处理一次
      if (fail_action) {
        for (let i = 0; i < fail_action.length; i++) {
          const fail = fail_action[i]
          const result = await handlerAction(
              fail,
              store,
              rootStore,
              useApp,
              useStore ? null : target,
          )
        }
      }
      return result
    }

  }
  return getResult(true)
}
