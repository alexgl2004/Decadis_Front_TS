import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { notification, message, Select, Button, Modal, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import MoveItem from "../components/MoveItem";
import ViewItem from "../components/ViewItem";
import DeleteItem from "../components/DeleteItem";
import CreateItem from "../components/CreateItem";
import ContentShowElem from "../components/ContentShowElem";
import { AnyObject } from 'antd/es/_util/type';

const ModalRunAction = (params: AnyObject) => {

/*
  type tempActionType = {
    firstname: string,
    lastname: string,
    email: string,
    action_ids:  string[]
    id: string
  }
*/  
  
  const [isModalOpen, setIsModalOpen] = useState([false, false]);
  const [tempAction, setTempAction] = useState<any>(null);
  const [runAction, setRunAction] = useState<any>(null);
  const [modalContent, setModalContent] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contextMHolder] = message.useMessage();


  function makeCancelAction(){
    setTempAction(
      {
        firstname: "",
        lastname: "",
        email: "",
        action_ids: [],
        id: "",
      } as any
    )
  }

  function openRunAction(){
    toggleModal(1, true)

    messageApi.open({type: 'loading', content: 'Loading Actions of User in progress..', duration: 0});

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('http://localhost:3000/actions/user/'+params.userId, requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setTimeout(messageApi.destroy, 0);
      setTempAction({
        acceptedItems:data,
        current:''
      } as any)
    }).catch(error => {
      setTimeout(messageApi.destroy, 0);
      api.open({
        message: 'Problem with loading Actions of User',
        description: "Connection failed. Error: " + error.message,
        icon: <CloseOutlined style={{ color: 'red' }} />,
        duration: 0
      });
    });

  }

  function runFucntAction(){

    messageApi.open({type: 'loading', content: 'Proccess for items in progress..', duration: 0});    

    switch(runAction.runFunction){
      
      case 'move':

        const requestOptions_move = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position_id: runAction.position,
            user_id: params.userId
          })
        };        
      
        fetch('http://localhost:3000/items/'+runAction.item+'/move', requestOptions_move)
        .then((res) => {
          return res.json();
        })
        .then(() => {
          setTimeout(messageApi.destroy, 0);
          setModalContent({
            title: 'Item successfully moved'
          } as any)

          toggleModal(2, true)

        }).catch(error => {
          setTimeout(messageApi.destroy, 0);
          api.open({
            message: 'Problem with moving Item',
            description: "Connection failed. Error: " + error.message,
            icon: <CloseOutlined style={{ color: 'red' }} />,
            duration: 0
          });
        });


      break;
      case 'delete':

        const requestOptions_delete = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: params.userId
          })
        };        
      
        fetch('http://localhost:3000/items/'+runAction.item+'/delete', requestOptions_delete)
        .then((res) => {
          return res.json();
        })
        .then(() => {
          setTimeout(messageApi.destroy, 0);
          setModalContent({
            title: 'Item successfully deleted'
          } as any)

          toggleModal(2, true)

        }).catch(error => {
          setTimeout(messageApi.destroy, 0);
          api.open({
            message: 'Problem with deleting Item',
            description: "Connection failed. Error: " + error.message,
            icon: <CloseOutlined style={{ color: 'red' }} />,
            duration: 0
          });
        });

      break;
      case 'create':

        const requestOptions_create = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: params.userId,
            name: runAction.name,
            text: runAction.text,
          })
        };        
      
        fetch('http://localhost:3000/items/add', requestOptions_create)
        .then((res) => {
          return res.json();
        })
        .then(() => {
          setTimeout(messageApi.destroy, 0);
          setModalContent({
            title: 'Item: ' + runAction.name +' successfully added',
          } as any)

          toggleModal(2, true)

        }).catch(error => {
          setTimeout(messageApi.destroy, 0);
          api.open({
            message: 'Problem with creating Item',
            description: "Connection failed. Error: " + error.message,
            icon: <CloseOutlined style={{ color: 'red' }} />,
            duration: 0
          });
        });

      break;
      case 'view':

        const requestOptions_view = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: params.userId
          })
        };        
      
        fetch('http://localhost:3000/items/'+runAction.item+'/', requestOptions_view)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setTimeout(messageApi.destroy, 0);
//          console.log(data)

          setModalContent({
            title:data.name,
            text:'Description: ' + data.text + data.position_id,
            add_text:'Position:  ' + runAction.positions.filter((elem:AnyObject)=>{ return data.position_id=elem.id})[0].name,
          } as any)

          toggleModal(2, true)

        }).catch(error => {
          setTimeout(messageApi.destroy, 0);
          api.open({
            message: 'Problem with opening Item',
            description: "Connection failed. Error: " + error.message,
            icon: <CloseOutlined style={{ color: 'red' }} />,
            duration: 0
          });
        });

      break;    

    }

  }

  function getPositionsItems(){

    messageApi.open({type: 'loading', content: 'Loading Items in progress..', duration: 0});

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };        

    fetch('http://localhost:3000/items', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data){    

        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };        

        fetch('http://localhost:3000/items/positions', requestOptions)
        .then((res) => {
          return res.json();
        })        
        .then((data2) => {
          setTimeout(messageApi.destroy, 0);
          if(data2){
            setRunAction({
              items: data,
              positions: data2
            } as any)
          }

        }).catch(error => {
          setTimeout(messageApi.destroy, 0);
          api.open({
            message: 'Problem with loading Positions',
            description: "Connection failed. Error: " + error.message,
            icon: <CloseOutlined style={{ color: 'red' }} />,
            duration: 0
          });
        })

      }else{

      }

    }).catch(error => {
      setTimeout(messageApi.destroy, 0);
      api.open({
        message: 'Problem with loading Positions',
        description: "Connection failed. Error: " + error.message,
        icon: <CloseOutlined style={{ color: 'red' }} />,
        duration: 0
      });
    });
    
  }


  const onChangeChecked = (elem: any) => {
    setTempAction({
      ...tempAction,
      current:elem
    } as any)    
  }

  const toggleModal = (idx:number, target: any) => {
    setIsModalOpen((p) => {
      p[idx] = target;
      return [...p];
    });
  };

  let selectBox_options
//  let arr_options

  if(tempAction && tempAction.acceptedItems){
/*
    arr_options = tempAction.acceptedItems.map((elem:AnyObject)=>{

      return String(elem.id)

    })
*/    
    selectBox_options = tempAction.acceptedItems.map((elem:AnyObject)=>{

      return {
        'label':elem.name,
        'value':String(elem.id)
      }

    })

  }

  return (
    <>
      {runAction && runAction.navigate_to && runAction.navigate_to==1?<Navigate replace to={"/items/"+runAction.item} />:''}
      <Space>
        <Button style={{backgroundColor:'#289F30',color:'white',marginLeft:15,textAlign:'left'}} onClick={openRunAction}>Run action</Button>
      </Space>
      <Modal
        title="Run action"
        open={isModalOpen[1]}
        onOk={() => {
          runFucntAction()
          toggleModal(1, false)
        }}
        onCancel={() =>{
          makeCancelAction()
          toggleModal(1, false)
        }}
        okText = "Run"
        cancelText = "Cancel"
        okButtonProps={{
            disabled: (tempAction && tempAction.current?false:true)
        }}        
        cancelButtonProps={{
//          disabled: true,
        }}        
      >
        <h4>Select action</h4>
        {tempAction?
          <Select style={{width:'100%'}} options={selectBox_options} value={tempAction.current} defaultValue={tempAction.current} onChange={onChangeChecked} />        
          :
          ''
        }
    
        {tempAction && tempAction.current==1?
          <MoveItem runAction={runAction} setRunAction={setRunAction} getPositionsItems={getPositionsItems} userId={params.userId} />:''
        }

        {tempAction && tempAction.current==2?
          <ViewItem runAction={runAction} setRunAction={setRunAction} getPositionsItems={getPositionsItems} userId={params.userId} />:''
        }

        {tempAction && tempAction.current==3?
          <DeleteItem runAction={runAction} setRunAction={setRunAction} getPositionsItems={getPositionsItems} userId={params.userId} />:''
        }

        {tempAction && tempAction.current==4?
          <CreateItem runAction={runAction} setRunAction={setRunAction} getPositionsItems={getPositionsItems} userId={params.userId} />:''
        }        

      </Modal>
      <ContentShowElem content={modalContent} toggleModal={toggleModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      {contextHolder}
      {contextMHolder}
    </>
  );
};
export default ModalRunAction;