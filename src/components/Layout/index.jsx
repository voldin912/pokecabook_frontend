import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Outlet, NavLink } from "react-router-dom";
import { CgPokemon, CgCalendar } from "react-icons/cg";
import { LiaSearchSolid } from "react-icons/lia";
import { BsBuilding } from "react-icons/bs";
import { Layout, Menu, theme, Grid, Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { setOpen, selectOpen } from '../../store/slices/pokemonSlice';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const LayoutSide = ({modalContent}) => {

  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const [responsive, setResponsive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarPresentStatus, setSidebarPresentStatus] = useState(false);
  const openStatus = useSelector(selectOpen);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setResponsive(!screens.md);
    if (!screens.md) setCollapsed(true);
  }, [screens.md]);

  const changeModalStatus = () => {
    console.log("changeModalStatus is called==>", openStatus);
    dispatch(setOpen(!openStatus));
  }

  return (
    <Layout>
      <div
        style={{
          background: colorBgContainer,
        }}
        className={`${styles.header}`}
      >
        <div className={`${responsive ? styles.logoContainerAlone : styles.logoContainer}`}>
          <img className={styles.logoImage} src="./assets/images/pokemon.png" alt="pokemon.png" />
          <span className={`${styles.logoText} bg-red-100`}>
            Pokemon
          </span>
        </div>
        
        <div className={`${responsive ? styles.logoContainer : styles.logoContainerAlone}`} style={{width: '50px', height:'50px'}}>
          <UnorderedListOutlined onClick={() => setSidebarPresentStatus(!sidebarPresentStatus)}  style={{width: '100%', height:'100%'}}/>
        </div>

        <div style={{marginRight: '10px', width: '30px', height:'30px'}} onClick={changeModalStatus} className='bg-red-300'>
          <LiaSearchSolid style={{width: '100%', height:'100%'}}/>
        </div>
      </div>

      <Layout
       style={{
        height: '100%',
        marginTop: '64px',
        }}>  
        <Sider trigger={null} collapsible collapsed={collapsed} className={`${styles.leftSiderWrapper} ${sidebarPresentStatus ? styles.leftSidebarNone : styles.leftSidebarShow}`}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <CgPokemon />,
                label: <NavLink to="/">カード採用率</NavLink>,
              },
              {
                key: '2',
                icon: <BsBuilding />,
                label: <NavLink to="/dateshow">シティ結果(会場別)</NavLink>,
              },
              {
                key: '3',
                icon: <CgCalendar />,
                label: <NavLink to="/placeshow">シティ結果(日別)</NavLink>,
              },
            ]}
            className={`${styles.menuTag}`}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
              className={`${responsive ? styles.none : styles.show}`}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      
      {/* <Modal
        title="検索条件"
        // centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%'
        }}
        // classNames={'bg-red-100'} 
        classNames=''
      >
        <FilterModal modalContent={modalContent}/>
      </Modal> */}
    </Layout>
      
  );
};

export default LayoutSide;