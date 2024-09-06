import React, {memo, useMemo} from "react"
import ScopedRender from "../../utils/scopedRender"
import transferProp from "../../utils/transferProp"
import NoData from "../no-data/no-data"
import {v4 as uuid} from "uuid"
function getConfig(order){
  return {}
}
const First = memo(({...rest})=>{
  return <Second {...rest} ></Second>
})
const Second = memo((props)=>{
  console.log("second render")
  return <span>second  </span>
})
const Third=(props)=>{
  console.log("third render")
  return <span>test,{props.dataID}<input/></span>
}
const DynamicListView = (props) => {
  const { keyField, itemAttr, joinAttr, ...rest } = props;
  if(!keyField){
    throw new Error("listview 中 keyField is required");
  }
  let { itemData, ...newProps } = transferProp(rest, "listview");
  if (!itemData) {
    return <NoData />;
  }

  const itemsWithJoinAttr = useMemo(() => {
    return itemData.reduce((acc, item, index) => {
      // const target={
      //   row: item,
      //   rowIndex: index,
      //   rowId: item[keyField]
      // }
      const newAttr = { ...itemAttr,
        _target_row:item,
        _target_rowIndex:index,
        _target_rowId:item[keyField]
      };
      let store = rest.store
      let rootStore=rest.rootStore
      // 添加当前的 ScopedRender 组件
      acc.push(

          <ScopedRender
              key={keyField ? item[keyField] : uuid()}
              {...newAttr}
              store={store}
              rootStore={rootStore}
          />
      );

      // 如果不是最后一个元素，添加 joinAttr 对应的 ScopedRender 组件
      if (joinAttr && index < itemData.length - 1) {
        const joinAttrCopy = { ...joinAttr,_level:0 };
        const newJoinAttr={
          _target_row:item,
          _target_rowIndex:index,
          _target_rowId:item[keyField]+"_join"
        }
        acc.push(
            <ScopedRender
                key={keyField ? item[keyField] + "_join" : uuid()}
                {...newJoinAttr}
                {...joinAttrCopy}
                store={store}
                rootStore={rootStore}
            />
        );
      }

      return acc;
    }, []);
  }, [itemData, itemAttr, joinAttr, keyField, rest.store, rest.rootStore]);

  return <React.Fragment>{itemsWithJoinAttr}</React.Fragment>;
};

export default DynamicListView;
