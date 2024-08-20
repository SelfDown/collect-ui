import { App, Form } from "antd"
import { useCallback, useContext, useEffect } from "react"
import transferProp from "../../utils/transferProp"
import { Payload } from "../../types/api"
import { ajaxAction } from "../../index"
import handlerActions from "../../utils/handlerActions"

export default function (props: any) {
  const {
    initApi,
    valueRule,
    api,
    action,
    // visible,
    submitOnChange, // 字段改变就提交
    ...rest
  } = props
  const useApp = App.useApp()
  const store = props.store
  let form = props.form
  if (!form) {
    const useFormLocal = Form.useForm()
    form = useFormLocal.form
  }
  // const { form } = useContext(formProvider)
  const onValuesChange = useCallback((changedValues: any, allValues: any) => {
    // 更新store
    // store.updateData(changedValues)
    if (submitOnChange) {
      form.submit()
    }
  }, [])
  const onFinish = useCallback(async (values: any) => {
    if (action) {
      handlerActions(action, store, props.rootStore, useApp)
    }
  }, [])
  useEffect(() => {
    if (initApi) {
      const ajax = ajaxAction()
      ajax(initApi, store.data, {
        onSuccess: (ret: Payload) => {
          // 设置表单的值
          form.setFieldsValue(ret.data)
          // 设置store的值
          store.updateData(ret.data)
        },
      })
    }
  }, [])
  // 动态控制显示与隐藏
  // if (visible) {
  //   const show = varValue(visible, props.store, { form: form.getValues() })
  //   if (!show) {
  //     return null
  //   }
  // }
  return (
    <Form
      form={form}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      {...transferProp(rest, "form")}
    ></Form>
  )
}
