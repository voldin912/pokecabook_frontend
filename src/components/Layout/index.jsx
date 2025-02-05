import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Outlet } from "react-router-dom";
import { CgPokemon, CgCalendar,  } from "react-icons/cg";
import { BsBuilding } from "react-icons/bs";
import { Layout, Menu, theme, Grid, Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
const { Header, Sider, Content } = Layout;

const { useBreakpoint } = Grid;

const LayoutSide = () => {
  const screens = useBreakpoint();
  const [responsive, setResponsive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarPresentStatus, setSidebarPresentStatus] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setResponsive(!screens.md);
    if (!screens.md) setCollapsed(true);
  }, [screens.md]);
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
          <span className={`${styles.logoText}`}>
            Pokemon
          </span>
        </div>
        
        <div className={`${responsive ? styles.logoContainer : styles.logoContainerAlone}`}>
          <UnorderedListOutlined onClick={() => setSidebarPresentStatus(!sidebarPresentStatus)}/>

          {/* <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setSidebarPresentStatus(!sidebarPresentStatus)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
              className={`${responsive ? styles.none : styles.show}`}
            /> */}
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
                label: 'カード採用率',
              },
              {
                key: '2',
                icon: <BsBuilding />,
                label: 'シティ結果(会場別)',
              },
              {
                key: '3',
                icon: <CgCalendar />,
                label: 'シティ結果(日別)',
              },
            ]}
            className={`${styles.menuTag}`}
          />
          <div className='tag'>

          </div>
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
    </Layout>
      
  );
};

export default LayoutSide;