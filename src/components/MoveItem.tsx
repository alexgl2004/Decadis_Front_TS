import { useEffect } from 'react';
import { Select } from 'antd';
import { AnyObject } from 'antd/es/_util/type';

const MoveItem = (params: AnyObject) => {

  useEffect(() => {
    params.getPositionsItems()
  }, []);  

  const onChangeItemChecked = (elem:any) => {

    params.setRunAction({
      ...params.runAction,
      item: elem,
      position: String(params.runAction.items.filter((itemF:AnyObject)=>{ 
                  return itemF.id==elem
                })[0].position_id),

      runFunction: 'move'
    })
  }

  const onChangePositionChecked = (elem:string) => {
    params.setRunAction({
      ...params.runAction,
      position:elem,
      runFunction:'move'
    })    
  }  

  function returnArraysFor(elems:any){

    if(elems.length==0){
      return {}
    }

    const arr_options = elems.map((elem:AnyObject)=>{
      return {
        'label':elem.name,
        'value':String(elem.id)
      }
    })
  
//    return [selectedBox, arr_options]
    return arr_options

  }


  const arr_options_items = returnArraysFor(params.runAction?params.runAction.items:[])
  const arr_options_positions = returnArraysFor(params.runAction?params.runAction.positions:[])
  

   return (
    <>
      {params.runAction && params.runAction.items?
        <>
          <h5 style={{borderTop:'1px solid #ccc',paddingTop:10,marginTop:15}}>Select item to move</h5>
          <Select style={{width:'100%'}} options={arr_options_items} value={params.runAction.item} defaultValue={params.runAction.item} onChange={onChangeItemChecked} />
        </>
        :''
      }
      {params.runAction && params.runAction.positions?
        <>
          <h5>Select position to move</h5>
            <Select style={{width:'100%'}} options={arr_options_positions} value={params.runAction.position} defaultValue={params.runAction.position} onChange={onChangePositionChecked} />
        </>
        :''
      }
    </>
  );
};

export default MoveItem;