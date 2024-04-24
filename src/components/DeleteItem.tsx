import { useEffect } from 'react';
import { Select } from 'antd';
import { AnyObject } from 'antd/es/_util/type';

const DeleteItem = (params: AnyObject) => {

  useEffect(() => {
    params.getPositionsItems()
  }, []);  

  const onChangeItemChecked = (elem: any) => {

    console.log(params.runAction)

    params.setRunAction({
      ...params.runAction,
      item: elem,
      runFunction: 'delete'
    })
  }

  function returnArraysFor(elems: any){

    if(elems.length==0){
      return {}
    }

    const arr_options = elems.map((elem:AnyObject)=>{
      return {
        'label':elem.name,
        'value':String(elem.id)
      }
    })
  
    return arr_options

  }

  const arr_options_items = returnArraysFor(params.runAction?params.runAction.items:[])

  return (
    <>
      {params.runAction && params.runAction.items?
        <>
          <h5 style={{borderTop:'1px solid #ccc',paddingTop:10,marginTop:15}}>Select item to DELETE</h5>
          <Select style={{width:'100%'}} options={arr_options_items} value={params.runAction.item} defaultValue={params.runAction.item} onChange={onChangeItemChecked} />
        </>
        :''
      }
    </>
  );
};

export default DeleteItem;