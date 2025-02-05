import React, { useState, useEffect } from 'react';

import { Outlet } from "react-router-dom";
import { CgPokemon, CgCalendar,  } from "react-icons/cg";
import { BsBuilding } from "react-icons/bs";
import { Layout, Menu, theme, Grid } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
const { Header, Sider, Content } = Layout;

const { useBreakpoint } = Grid;

const LayoutSide = () => {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Will collapse when screen is 'md' (768px) or smaller
    setCollapsed(!screens.md);
  }, [screens.md]);
  return (
    <Layout>
      <Header
        style={{
          background: colorBgContainer,
        }}
        className={`${styles.header}`}
      >
        <div className={`${collapsed ? styles.logoContainerAlone : styles.logoContainer}`}>
          <img className={styles.logoImage} src="./assets/images/pokemon.png" alt="pokemon.png" />
          <span className={`${styles.logoText}`}>
            Pokemon
          </span>
        </div>
        
        <div className={`${collapsed ? styles.logoContainer : styles.logoContainerAlone}`}>
          <UnorderedListOutlined />
          {/* <img className={styles.logoImage} src="./assets/images/pokemon.png" alt="pokemon.png" />
          <span className={`${styles.logoText}`}>
            Pokemon
          </span> */}
        </div>
        {/* <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            backgroundColor: 'red',
          }}
        /> */}
      </Header>
      <Layout
       style={{
        height: '100%',
        marginTop: '64px',
        }}>  
        <Sider trigger={null} collapsible collapsed={collapsed} className={`${styles.siderWrapper}`}>
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
          />
        </Sider>
        <Layout>
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