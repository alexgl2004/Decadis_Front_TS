import { HomeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { MenuProps, Layout, Flex, Menu } from 'antd';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const { Content, Header, Footer } = Layout;

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
};

const headerStyle = {
  textAlign: 'center' as any,
  color: '#fff',
  height: 44,
  paddingInline: 48,
  lineHeight: '44px',
  backgroundColor: '#fff',
  padding: 0,
  paddingLeft:5,
  paddingRight:5,
};

const contentStyle = {
  textAlign: 'left' as any,
  minHeight: 420,
  height: '100%',
  lineHeight: '12px',
  color: '#333',
  backgroundColor: '#fff',
  padding:20,
  paddingBottom:70
};

const footerStyle = {
   textAlign: 'left' as any,
  color: '#333',
  backgroundColor: '#fff',
  borderTopColor:'#ccc',
  borderWidth:0,
  borderBottomColor:'transparent',
  borderStyle:'solid',
  borderTopWidth:2,
  padding:20,
  position: 'fixed' as any,
  bottom: 0,
  width: '100%'
};



const Routerblock = () => {


  const [current, setCurrent] = useState('h');
  const onClick : MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Flex gap="middle" wrap="wrap">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal"  theme="light">
            <Menu.Item key="h" icon= {<HomeTwoTone />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="u" icon= {<InfoCircleOutlined />}>
                <Link to="/users">Users</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={contentStyle}>
          <Outlet/>
        </Content>
        <Footer style={footerStyle}>Decadis</Footer>
      </Layout>
    </Flex>
   
  )

};

export default Routerblock;