import transferProp from "../../utils/transferProp"

export default function (props: any) {
  const { ...rest } = props
  const newProps = transferProp(rest, "span")
  return <span {...newProps}></span>
}