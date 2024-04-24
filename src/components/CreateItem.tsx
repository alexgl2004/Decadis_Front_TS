import React, { useEffect } from 'react';
import { Select, Form, Input } from 'antd';
import { AnyObject } from 'antd/es/_util/type';

const { TextArea } = Input;

const CreateItem = (params: AnyObject) => {
  useEffect(() => {
    params.getPositionsItems()
  }, []);  

  const onChangePositionChecked = (elem : any) => {
    params.setRunAction({
      ...params.runAction,
      position:elem,
      runFunction:'create'
    })
  }

  const onChangeND = (e: React.ChangeEvent<any>,field:string) => {
    switch(field){
      case 'name':
        params.setRunAction({
          ...params.runAction,
          name:e.target.value,
          runFunction:'create'
        })
      break;
      case 'text':
        params.setRunAction({
          ...params.runAction,
          text:e.target.value,
          runFunction:'create'
        })
      break;
    }
  }

  function returnArraysFor(elems: AnyObject){

    if(elems.length==0){
      return {}
    }

    const arr_options = elems.map((elem: AnyObject)=>{
      return {
        'label':elem.name,
        'value':String(elem.id)
      }
    })
  
    return arr_options

  }

  const arr_options_positions = returnArraysFor(params.runAction?params.runAction.positions:[])

  return (
    <>
      <h5 style={{borderTop:'1px solid #ccc',paddingTop:10,marginTop:15}}>Create new item</h5>
      <Form.Item label="Name of item">
            <Input 
              name="name" 
              onChange={(e)=>{onChangeND(e,'name')}}
              value={params.runAction && params.runAction.name?params.runAction.name:''}
            />
      </Form.Item>
      <Form.Item label="Description for item">
        <TextArea rows={4} 
          name="text" 
          onChange={(e)=>{onChangeND(e,'text')}} 
          value={params.runAction && params.runAction.text?params.runAction.text:''}
        />
      </Form.Item>
      {params.runAction && params.runAction.positions?
        <>
          <h5>Select position for item</h5>
            <Select style={{width:'100%'}} options={arr_options_positions} value={params.runAction.position} defaultValue={params.runAction.position} onChange={onChangePositionChecked} />
        </>
        :''
      }
    </>
  );
};

export default CreateItem;