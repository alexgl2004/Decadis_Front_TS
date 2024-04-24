import { useState } from 'react';
import { CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { notification, message, Checkbox, Form, Input, Button, Modal, Space } from 'antd';

import type { GetProp } from 'antd';


import ContentShowElem from "../components/ContentShowElem.jsx";
import { AnyObject } from 'antd/es/_util/type.js';

const { confirm } = Modal;

const ModalUser = (params : AnyObject) => {

  const [isModalOpen, setIsModalOpen] = useState([false, false]);
  const [tempUser, setTempUser] = useState<any>(null);
  const [modalContent, setModalContent] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contextMHolder] = message.useMessage();

  function makeNullUser(){
    setTempUser({
      firstname: "",
      lastname: "",
      email: "",
      action_ids: [],
      id: "",
    } as any)    
  }

  function addUser(){
    toggleModal(0, true)
    makeNullUser()
  }

  function openEditUser(){
    toggleModal(0, true)
    setTempUser({
      firstname: params.userContent.firstname?params.userContent.firstname:"",
      lastname: params.userContent.lastname?params.userContent.lastname:"",
      email: params.userContent.email?params.userContent.email:"",
      action_ids: params.userContent.action_ids?params.userContent.action_ids.split(','):[],
      id: params.userId?params.userId:"",
    } as any)
  }

  function saveUser(add=0){

    messageApi.open({type: 'loading', content: 'Saving User in progress..', duration: 0});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tempUser)
    };

    fetch('http://localhost:3000/users/'+(add?'add':tempUser.id+'/edit'), requestOptions)
    .then((res) => {
      return res.json();
    })
    .then(() => {
      setTimeout(messageApi.destroy, 0);
      params.getUsers()
      setModalContent({
        title: 'Item successfully ' + (add?'created':'updated')
      } as any)

      toggleModal(2, true) 
    })
    .catch(error => {
      setTimeout(messageApi.destroy, 0);
      api.open({
        message: 'Problem with save User',
        description: "Connection failed. Error: " + error.message,
        icon: <CloseOutlined style={{ color: 'red' }} />,
        duration: 0
      });
    });
  }

  function delUser(userId: number){

    confirm({
      title: 'Do you want to delete this item?',
      icon: <ExclamationCircleFilled />,
      content: 'This process does not delete items created by this user',
      onOk() {
        messageApi.open({type: 'loading', content: 'Deleting User in progress..', duration: 0});
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        };
  
        fetch('http://localhost:3000/users/' + userId + '/delete', requestOptions)
        .then((res) => {
          return res.json();
        })
        .then(() => {
          setTimeout(messageApi.destroy, 0);
          params.getUsers()
        })
        .catch(error => {
          setTimeout(messageApi.destroy, 0);
          api.open({
            message: 'Problem with delete User',
            description: "Connection failed. Error: " + error.message,
            icon: <CloseOutlined style={{ color: 'red' }} />,
            duration: 0
          });
        });
      },
      onCancel() {

      },
    });    
    
  }

  const onChangeChecked: GetProp<typeof Checkbox.Group, 'onChange'> = (list) => {
    setTempUser({
      ...tempUser,
      action_ids:list
    })    
  }

  const onChangeND = (e: React.ChangeEvent<HTMLInputElement>,field:string) => {
    switch(field){
      case 'firstname':
        setTempUser({
          ...tempUser,
          firstname:e.target.value,
        })
      break;
      case 'lastname':
        setTempUser({
          ...tempUser,
          lastname:e.target.value,
        })
      break;
      case 'email':
        setTempUser({
          ...tempUser,
          email:e.target.value,
        })
      break;
    }
  }

  const toggleModal = (idx:number, target: any) => {
    setIsModalOpen((p) => {
      p[idx] = target;
      return [...p];
    });
  };

  let checkBox_options

  if(params && params.actions){
    
    checkBox_options = params.actions.map((elem: AnyObject)=>{

      return {
        'label':elem.name,
        'value':String(elem.id)
      }

    })

  }

  return (
    <>
      <Space>
        {params.add && parseInt(params.add)==1?
          <>
            <Button style={{backgroundColor:'#129795',color:'white',marginTop:7}} onClick={addUser}>Create</Button>
          </>
          :
          <>
            <Button style={{backgroundColor:'#177FC9',color:'white',textAlign:'center'}} onClick={openEditUser}>Edit</Button>
            <Button style={{backgroundColor:'#D63436',color:'white',marginLeft:8,textAlign:'center'}} onClick={()=>{delUser(params.userId)}}>Detele</Button>
          </>
        }
      </Space>
      <Modal
        title={(params.add && parseInt(params.add)==1?'Add':'Edit')+' user'}
        open={isModalOpen[0]}
        onOk={() => {
          saveUser(params.add && parseInt(params.add)==1?1:0)
          toggleModal(0, false)
        }}
        onCancel={() =>{
          makeNullUser()
          toggleModal(0, false)
        }}
        okText = {params.add && parseInt(params.add)==1?'Create':'Update'}
        cancelText = "Cancel"
        okButtonProps={{
            disabled: (tempUser && tempUser.firstname?false:true)
        }}        
        cancelButtonProps={{
//          disabled: true,
        }}        
      >

      {tempUser?
        <>
          <Form.Item label="First name *">
            <Input 
              name="firstname *" 
              onChange={(e)=>{onChangeND(e,'firstname')}}
              value={tempUser && tempUser.firstname?tempUser.firstname:''}
            />
          </Form.Item>
          <Form.Item label="Last name">
            <Input 
              name="lastname" 
              onChange={(e)=>{onChangeND(e,'lastname')}}
              value={tempUser && tempUser.lastname?tempUser.lastname:''}
            />
          </Form.Item>
          <Form.Item label="E-mail">
            <Input 
              name="email" 
              onChange={(e)=>{onChangeND(e,'email')}}
              value={tempUser && tempUser.email?tempUser.email:''}
            />
          </Form.Item>

          {params && params.actions?
            <Checkbox.Group style={{width:120}} options={checkBox_options} value={tempUser.action_ids} defaultValue={tempUser.action_ids} onChange={onChangeChecked} />        
          :''}
        </>:
        ''}
      </Modal>
      <ContentShowElem content={modalContent} toggleModal={toggleModal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      {contextHolder}
      {contextMHolder}
    </>
  );
};
export default ModalUser;