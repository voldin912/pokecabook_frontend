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
import { setOpen, selectOpen, selectDeckCount, selectEventCount, selectSpecificDeckCount } from '../../store/slices/pokemonSlice';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const LayoutSide = () => {

  const dispatch = useDispatch();
  const screens = useBreakpoint();
  const [responsive, setResponsive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarPresentStatus, setSidebarPresentStatus] = useState(false);
  const openStatus = useSelector(selectOpen);
  const deckCount = useSelector(selectDeckCount);
  const eventCount = useSelector(selectEventCount);
  const specificDeckCount = useSelector(selectSpecificDeckCount);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setResponsive(!screens.md);
    if (!screens.md) setCollapsed(true);
  }, [screens.md]);

  const changeModalStatus = () => {
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
        
        <div className={`${responsive ? styles.logoContainer : styles.logoContainerAlone}`} style={{fontSize: '22px'}}>
          <UnorderedListOutlined onClick={() => setSidebarPresentStatus(!sidebarPresentStatus)}/>
        </div>

        <div style={{marginRight: '17px', width: '30px', height:'30px'}} onClick={changeModalStatus}>
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
                // icon: <CgPokemon style={{ fontSize: '24px' }} />,
                icon: <CgPokemon height="36px" width="36px"/>,
                label: <NavLink to="/">カード採用率</NavLink>,
              },
              {
                key: '2',
                icon: <BsBuilding />,
                label: <NavLink to="/placeshow">シティ結果(会場別)</NavLink>,
              },
              {
                key: '3',
                icon: <CgCalendar />,
                label: <NavLink to="/dateshow">シティ結果(日別)</NavLink>,
              },
            ]}
            className={`${styles.menuTag}`}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: '64px',
                height: '64px',
                '@media (max-width: 768px)': {
                  fontSize: '14px',
                  width: '48px', 
                  height: '48px',
                },
                '@media (max-width: 480px)': {
                  fontSize: '12px',
                  width: '36px',
                  height: '36px',
                }
              }}
              className={`${responsive ? styles.none : styles.show}`}
            />
            {!window.location.pathname.includes('placeshow') && !window.location.pathname.includes('dateshow') && (
              <span className={styles.headerText}>{eventCount} イベント / {deckCount} デッキ中 /対象<span style={{color: '#008000', fontWeight: 'bold'}}>{specificDeckCount}</span> デッキ</span>
            )}
          </Header>
          <Content
            style={{
              padding: 8,
              paddingTop: '0px',
              minHeight: 'calc(100vh - 128px)',
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutSide;