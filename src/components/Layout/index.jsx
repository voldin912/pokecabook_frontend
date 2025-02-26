import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { CgPokemon, CgCalendar, CgUserList, CgData } from "react-icons/cg";
import { LiaSearchSolid } from "react-icons/lia";
import { BsBuilding } from "react-icons/bs";
import { Layout, Menu, theme, Grid, Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import styles from './index.module.scss';
import { UpOutlined } from '@ant-design/icons';
import { setOpen, selectOpen, selectDeckCount, selectEventCount, selectSpecificDeckCount, selectConditions } from '../../store/slices/pokemonSlice';
import { selectCardCategory } from '../../store/slices/cardCategorySlice';
import axios from 'axios';

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
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const conds = localStorage.getItem('conds')
  const condsObj = conds ? JSON.parse(conds) : null;
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
  
  const handleLogin = () => {
    if (token) {
      localStorage.removeItem("token")
      Navigate('/')
    } else {
      Navigate('/login')
    }
  }
  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const getConditionDescription = (condition) => {
    switch (condition) {
      case 'gte':
        return '以上';
      case 'eql':
        return '同じ';
      case 'lte':
        return '以下';
      case 'unq':
        return '反対';
      default:
        return 'Unknown condition';
    }
  };
  return (
    <Layout>
      <div
        style={{
          background: colorBgContainer,
          paddingRight: "10px"
        }}
        className={`${styles.header}`}
        >
        <div className={`${responsive ? styles.logoContainerAlone : styles.logoContainer}`}>
          <img className={styles.logoImage} src="/assets/images/pokemon.png" alt="pokemon.png" />
          <span className={`${styles.logoText} bg-red-100`}>
            Pokemon
          </span>
        </div>

        <div className={`${responsive ? styles.logoContainer : styles.logoContainerAlone}`} style={{ fontSize: '22px' }}>
          <UnorderedListOutlined onClick={() => setSidebarPresentStatus(!sidebarPresentStatus)} />
        </div>
        <div className="loginSearch" style={{ display: "flex", borderRadius: '10px', backgroundColor: "whitesmoke", padding: "5px", cursor: "pointer"}} >
          {!window.location.pathname.includes('placeshow') && !window.location.pathname.includes('dateshow') && !window.location.pathname.includes('users') && !window.location.pathname.includes('category') &&
            <div style={{ marginRight: '17px', width: '60px', height: '30px', display:'flex' }} onClick={changeModalStatus}>
              <div style={{fontSize:"12px"}}>条件検索</div>
              <LiaSearchSolid style={{ width: '120%', height: '120%' }} />
            </div>}
          <div className="searchText" style={{ alignItems: "center", fontSize: "20px" }}></div>
            <div className="loginBtn" style={{ backgroundColor: "whitesmoke", padding: "5px", borderRadius: "10px" }}>
              <div className="login" style={{ display: "flex", cursor: "pointer" }} onClick={handleLogin}>
                <div className="login" style={{ fontSize: "16px", textAlign :'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;' }}>
                  {token ? "ログアウト" : "ログイン"}
                </div>
              </div>
            </div>
        </div>
      </div>

      <Layout
        style={{
          height: '100%',
          marginTop: '64px',
          '@media(max-width = 768px)': {
            width: "20px"
          }
        }}>
        <Sider trigger={null} collapsible collapsed={collapsed} className={`${styles.leftSiderWrapper} ${sidebarPresentStatus ? styles.leftSidebarNone : styles.leftSidebarShow}`} style={{ zIndex: "1" }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <CgPokemon height="36px" width="36px" />,
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
              (token) &&
              {
                key: '4',
                icon: <CgUserList />,
                label: <NavLink to="/users">ユーザー管理</NavLink>,
              },
              (token) &&
              {
                key: '5',
                icon: <CgData />,
                label: <NavLink to="/category">カテゴリ</NavLink>,
              },
            ]}
            className={`${styles.menuTag}`}
          />
        </Sider>
        <Layout style={{ paddingLeft: '10px' }}>
          <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: '64px',
                height: '64px',
                transition: "all .3s",
              }}
              className={`${responsive ? styles.none : styles.show}`}
            />
            {!window.location.pathname.includes('placeshow') && !window.location.pathname.includes('dateshow') && !window.location.pathname.includes('users') && !window.location.pathname.includes('category') && (
              <span className={styles.headerText}>{eventCount} イベント / {deckCount} デッキ中 /対象<span style={{ color: '#008000', fontWeight: 'bold' }}>{specificDeckCount}</span> デッキ</span>
            )}
            {/* Scroll to top button */}
            <Button
              type="primary"
              icon={<UpOutlined />}
              onClick={scrollToTop}
              style={{
                position: "fixed",
                bottom: "20px",
                left: "7px",
                index: "1000",
                zIndex: '5',
                width: "60px",
                backgroundColor: "dodgerblue",
                height: "60px",
                borderRadius: "30px",
                opacity: '0.7'
              }}
            >
              Top
            </Button>
          </Header>
          {!window.location.pathname.includes('placeshow') && !window.location.pathname.includes('dateshow') && !window.location.pathname.includes('users') && !window.location.pathname.includes('category') && (
          <div>{
            condsObj ? <>
              {
                condsObj.map((item) => (
                  <div className="condition" style={{ display: 'flex', gap: '15px', marginTop:'10px',float:"right", marginRight:'10px' }} key={item.cardName}>
                    <div className="condition-item">
                     {item.cardName}
                    </div>
                    <div className="condition-item">
                     {item.cardNumber}{getConditionDescription(item.cardCondition)}
                    </div>
                  </div>
                ))
              }
            </>: <></>
            }</div> )}
          <Content
            style={{
              padding: 8,
              paddingTop: '0px',
              minHeight: 'calc(100vh - 128px)',
              borderRadius: borderRadiusLG,
              paddingLeft: '0px',
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