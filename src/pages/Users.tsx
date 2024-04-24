import { useEffect, useState } from 'react'
import ModalUser from "../components/ModalUser.jsx";
import ModalRunAction from "../components/ModalRunAction.jsx";
import { AnyObject } from 'antd/es/_util/type.js';
import { CloseOutlined } from '@ant-design/icons';
import { notification, message } from 'antd';

//<LoadingOutlined />

const Users = () => {

  const [users, setUsers] = useState<any>(null);
  const [actions, setActions] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, contextMHolder] = message.useMessage();

//  const [filterUser, setFilterUser] = useState({text:''});//Don't needed maybe later

  useEffect(() => {
    getUsers()
    getActions()
  }, []);
  
  function getActions(){

    messageApi.open({type: 'loading', content: 'Loading Actions in progress..', duration: 0});

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };        

//    useEffect(() => {
    fetch('http://localhost:3000/actions', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setTimeout(messageApi.destroy, 0);
      if(data){
        setActions(data)
      }else{

      }

    })
    .catch(error => {
      setTimeout(messageApi.destroy, 0);
      api.open({
        message: 'Problem with loading Actions',
        description: "Connection failed. Error: " + error.message,
        icon: <CloseOutlined style={{ color: 'red' }} />,
        duration: 0
      });
    });
//    }, [user]);
    
  }   

  function getUsers(){

    messageApi.open({type: 'loading', content: 'Loading Users in progress..', duration: 0});

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('http://localhost:3000/users', requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setTimeout(messageApi.destroy, 0);
      if(data.usersData){
        setUsers({
          firstLoaded: data.usersData,
          filtered: data.usersData
        } as any)
      }else{

      }

    })
    .catch(error => {
      api.open({
        message: 'Problem with loading Users',
        description: "Connection failed. Error: " + error.message,
        icon: <CloseOutlined style={{ color: 'red' }} />,
        duration: 0
      });
      setTimeout(messageApi.destroy, 0);
    });
  
  } 

  return (
    <>
      <div style={{display:'flex'}}>
        <div style={{width:'100%'}}>
            <h1>Users</h1>
        </div>
        <div style={{width:'auto'}}>
            <ModalUser actions={actions} getUsers={getUsers} add="1" />
        </div>
      </div>
      <div style={{border:'1px solid #aaa',borderRadius:5,padding:'10px 15px 5px'}}>
            <div style={{borderBottom:'1px solid #ddd',paddingBottom:10,paddingTop:10,display:'flex',flexWrap:'wrap'}}>
                <div style={{width:'30%',fontWeight:'bold'}}>NAME</div> 
                <div style={{width:'30%',fontWeight:'bold'}}>E-MAIL</div>
                <div style={{width:'40%',fontWeight:'bold'}}></div> 
            </div>
            {users && users.filtered?users.filtered.map((user:AnyObject,index:number)=>{
                return (
                  <div key={'userww_'+index} style={{borderBottom:index!=users.filtered.length-1?'1px solid #ddd':'1px solid transparent',paddingBottom:10,display:'flex',flexWrap:'wrap',marginTop:10}}>
                      <div style={{width:'30%',marginTop:10}}>{user.firstname} {user.lastname}</div>
                      <div style={{width:'30%',marginTop:10}}>{user.email}</div>
                      <div style={{width:'40%',textAlign:'right',whiteSpace:'nowrap'}}>
                          <ModalUser getUsers={getUsers} actions={actions} userContent={user} 
                          userId={user.id} />
                          <ModalRunAction userId={user.id} />
                      </div> 
                  </div>
                )
              }
            )
            :''}
        {contextHolder}
        {contextMHolder}
      </div>
    </>
  )
}

export default Users