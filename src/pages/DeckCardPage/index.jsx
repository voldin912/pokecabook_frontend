import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeckCard, fetchTotalDeckCardLength, fetchDeckStats, selectDeckCard, selectStatus, selectTotalDeckCardLength, selectDeckStats, setOpenDeckSearch } from '../../store/slices/deckCardSlice';
import { Pagination, Row, Flex, Select, DatePicker, Modal, } from 'antd';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import locale from 'antd/es/date-picker/locale/ja_JP';
import { setTwoToneColor } from '@ant-design/icons/lib/components/twoTonePrimaryColor';
import { fetchCardCategories } from '../../store/slices/cardCategorySlice';
import { ExternalLink } from "lucide-react";
const pageSizeOptions = [12, 24, 48];
const DeckCardPage = () => {
    const dispatch = useDispatch();

    const [fetchStatus, setFetchStatus] = useState(false);
    const decks = useSelector(state => state.deckCard.decks);
    const [categoryName, setCategoryName] = useState('')
    
    const openDeck = useSelector(state => state.deckCard.openDeck);
    const [totalDeckCardLength, setTotalDeckCardLength] = useState(0);
    const totalDeckCard = useSelector(selectDeckCard);
    const [deckCard, setDeckCard] = useState([]);
    const status = useSelector(selectStatus);
    const deckStats = useSelector(selectDeckStats);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
    const [filterObj, setFilterObj] = useState({
      startDate: '2025-03-29',
      endDate: '2025-04-05',
      category: "",
      cardName: "",
      league: 2,
      ranks: {
        winner: true,
        runnerUp: true,
        top4: true,
        top8: true,
        top16: true,
        all: true
      }
    });
    const cardCategoryOptions = useSelector((state) => state.cardCategory.cardCategories);
    const cardCategoryOptions_1 = useSelector((state) => state.cardCategory.cardCategories_1);
    const cardCategoryOptions_2 = useSelector((state) => state.cardCategory.cardCategories_2);
    const leagueOptions = useSelector((state) => state.cardCategory.leagueOptions);
    
    useEffect(() => {
        // Convert ranks to backend format
        const rankFilter = convertRanksToBackendFormat(filterObj.ranks);
        const backendFilter = {
          ...filterObj,
          rank: rankFilter
        };
        
        dispatch(fetchDeckCard({ page: 1, pageSize: 12, filterObj: backendFilter }));   // Just for the first render
        const sortedDeck = [...totalDeckCard].sort((a, b) => a.rank_int - b.rank_int);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        console.log('Sorted Deck!!!!!!!!!!!!!!!!:', sortedDeck, startIndex, endIndex);
        setDeckCard(sortedDeck.slice(startIndex, endIndex));
      console.log('Sorted Deck-----------:', deckCard);
    }, []);
    useEffect(() => {
      dispatch(fetchCardCategories());
    }, [dispatch]);
    
    useEffect(() => {
      if (cardCategoryOptions_1 && cardCategoryOptions_1.length > 0 && !filterObj.category) {
        const defaultCategory = cardCategoryOptions_1[0].value;
        console.log("Setting default category:", defaultCategory);
        console.log("Available categories:", cardCategoryOptions_1);
        setFilterObj(prev => ({
          ...prev,
          category: defaultCategory
        }));
        setCategoryName(defaultCategory);
      }
    }, [cardCategoryOptions_1, filterObj.category]);
      
    useEffect(() => {
      if(totalDeckCard && totalDeckCard.length > 0) {
        const sortedDeck = [...totalDeckCard].sort((a, b) => a.rank_int - b.rank_int);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDeckCard(sortedDeck.slice(startIndex, endIndex));
      } else{
        setDeckCard([]);
      }
      setTotalDeckCardLength(totalDeckCard.length);
    }, [totalDeckCard, currentPage, pageSize]);
    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        
        // Convert ranks to backend format
        const rankFilter = convertRanksToBackendFormat(filterObj.ranks);
        const backendFilter = {
          ...filterObj,
          rank: rankFilter
        };
        
        dispatch(fetchDeckCard({ page: currentPage, pageSize: 12, filterObj: backendFilter }));
    };
  const handleCancel = () => {
    dispatch(setOpenDeckSearch(!openDeck));
  }
  const handleFetchCards = () => {
    setFetchStatus((prev) => !prev);
    console.log("Current filterObj:", filterObj);
    console.log("Current categoryName:", categoryName);
    console.log("Current filterObj.category:", filterObj.category);

    // Convert ranks to backend format
    const rankFilter = convertRanksToBackendFormat(filterObj.ranks);
    console.log("Converted rank filter:", rankFilter);

    // Create the complete filter object for the backend
    const backendFilter = {
      ...filterObj,
      rank: rankFilter
    };

    console.log("Backend filter:", backendFilter);
    dispatch(fetchDeckCard({ page: currentPage, pageSize: 12, filterObj: backendFilter }));   // Just for the first render
    dispatch(fetchDeckStats(backendFilter)); // Fetch stats with the same filter
    dispatch(setOpenDeckSearch(!openDeck));
  }

  const onStartDateChange = (date, dateString) => {
    setFilterObj({
      ...filterObj,
      startDate: dateString
    });
  };

  const onEndDateChange = (date, dateString) => {
    setFilterObj({
      ...filterObj,
      endDate: dateString
    });
  };

  const onLeagueChange = (value) => {
    setFilterObj({
      ...filterObj,
      league: value
    });
  }

  const cardCategoryChange = (value) => {
    console.log("First category selected:", value);
    setFilterObj(prev => ({
      ...prev,
      category: value, // Use the value directly since it's the selected category
    }));
    setCategoryName(value);
    console.log("Updated filterObj:", { ...filterObj, category: value });
  }

  const cardCategoryChange2 = (value) => {
    console.log("Second category selected:", value);
    setFilterObj(prev => ({
      ...prev,
      category: value, // Use the value directly since it's the selected category
    }));
    console.log("Updated filterObj:", { ...filterObj, category: value });
  }

  const handleRankChange = (id, checked) => {
    setFilterObj(prev => {
      const newRank = {
        ...prev.ranks,
        [id]: checked
      };
      // Update all based on other checkboxes
      const allChecked = newRank.winner && newRank.runnerUp && newRank.top4 && newRank.top8 && newRank.top16;
      return {
        ...prev,
        ranks: {
          ...newRank,
          all: allChecked
        }
      };
    });
  };

  const handleSelectAll = (checked) => {
    setFilterObj(prev => ({
      ...prev,
      ranks: {
        winner: checked,
        runnerUp: checked,
        top4: checked,
        top8: checked,
        top16: checked,
        all: checked
      }
    }));
  };

  const resetFilters = () => {
    setFilterObj({
      startDate: '2025-03-29',
      endDate: '2025-04-05',
      category: "",
      cardName: "",
      league: 2,
      ranks: {
        winner: true,
        runnerUp: true,
        top4: true,
        top8: true,
        top16: true,
        all: true
      }
    });
    setCategoryName("");
  };

  const convertRanksToBackendFormat = (ranks) => {
    const rankMapping = {
      winner: 1,
      runnerUp: 2,
      top4: 3,
      top8: 5,
      top16: 9
    };
    
    const selectedRanks = Object.entries(ranks)
      .filter(([key, value]) => value && key !== 'all')
      .map(([key]) => rankMapping[key])
      .filter(rank => rank !== undefined);
    
    return selectedRanks.join(',');
  };

    return(
        <div className={styles.wrapper}>
            {/* Statistics Display Section */}
            {deckStats && (deckStats.eventCount > 0 || deckStats.totalDeckCount > 0) && (
                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #d9d9d9'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#666', marginBottom: '4px' }}>イベント数</div>
                            <div style={{ fontSize: '18px', color: '#1890ff' }}>
                                {deckStats.eventCount || 0}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#666', marginBottom: '4px' }}>デッキ中</div>
                            <div style={{ fontSize: '18px', color: '#52c41a' }}>
                                {deckStats.filteredDeckCount || 0}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#666', marginBottom: '4px' }}>対象デッキ数</div>
                            <div style={{ fontSize: '18px', color: '#fa8c16' }}>
                                {deckStats.totalDeckCount || 0}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {status === 'succeeded' && (
                <div className={styles.deckCardWrapper2}>
                    {deckCard.map((card) => (
                        <a
                            key={card.deck_ID_var} 
                            className={styles.deckCard} 
                            // href={`${window.location.href}/${card.event_holding_id}`}
                              onClick={() => {
                                  window.open(`https://www.pokemon-card.com/deck/deckView.php?deckID=${card.deck_ID_var}`, '_blank');
                              }
                            }
                            // href={`https://www.pokemon-card.com/deck/deckView.php?deckID=${card.deck_ID_var}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className= {styles.order} style={{display : "flex", justifyContent : "space-between", alignItems:"center", width : "100%", paddingInline:"10px"}}>
                                <p style={{paddingTop:"15px"}}>{card.rank_int === 1 ? "優勝" : card.rank_int === 2 ? "準優勝" : card.rank_int === 3 ? `ベスト${card.rank_int + 1}` : 
                                card.rank_int === 5 ? `ベスト${card.rank_int + 3}` : `ベスト${card.rank_int + 7}`}</p>
                                <p>ユーザー名: {card.player_name} </p> <p>プレイヤーID: {card.player_id}</p>
                                <a href={`https://www.pokemon-card.com/deck/deck.html?${card.deck_ID_var}`}><ExternalLink size={20} color="black" /></a>
                            </div>
                            <picture>
                                <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.webp`} type="image/webp" />
                                <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.png`} alt="deck_ID_var's image" />
                            </picture>
                            <p>{dayjs(card.deck_date_date).format('YYYY年MM月DD日')} {card.deck_place_var}</p>
                            <span>{card.place_var} </span>
                        </a>
                    ))}
                </div>
            )}
            {totalDeckCardLength !== 0 &&
              <Pagination
                  current={currentPage}
                  total={totalDeckCardLength} // Make sure you have this value from your data
                  pageSize={pageSize}
                  onChange={handlePaginationChange}
                  showSizeChanger={{
                      locale: {
                          items_per_page: '/ ページ'
                      }
                  }}
                  showTotal={(total) => `合計 ${total} イベント`}
                  showQuickJumper={{
                      goButton: <span>移動</span>,
                      input: {
                          deckholder: 'ページ番号を入力'
                      }
                  }}
                  pageSizeOptions={pageSizeOptions}
                  locale={{ items_per_page: "/ ページ", jump_to: "ページに移動", jump_to_confirm: "確認", page: "ページ", prev_page: "前のページ", next_page: "次のページ", prev_5: "前の5ページ", next_5: "次の5ページ", prev_3: "前の3ページ", next_3: "次の3ページ", page_size: "ページサイズ",}}
              />
            }
              
          <Modal
            open={openDeck}
            onCancel={handleCancel}
            onOk={handleFetchCards}
            okText="検索"
            cancelText="キャンセル"
            title="検索条件"
            footer={[
              <button
                key="reset"
                onClick={resetFilters}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '4px 15px',
                  backgroundColor: '#fff',
                  color: '#666',
                  cursor: 'pointer',
                  marginRight: 'auto'
                }}
              >
                リセット
              </button>,
              <button
                key="cancel"
                onClick={handleCancel}
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '4px 15px',
                  backgroundColor: '#fff',
                  color: '#666',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>,
              <button
                key="submit"
                onClick={handleFetchCards}
                style={{
                  border: '1px solid #1890ff',
                  borderRadius: '6px',
                  padding: '4px 15px',
                  backgroundColor: '#1890ff',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                検索
              </button>
            ]}
          >
            <Flex justify='space-evenly' align='center' style={{ marginBottom: '10px', paddingTop: '20px' }}>
              <label>開催日</label>
              <DatePicker
                value={dayjs(filterObj.startDate)}
                onChange={onStartDateChange}
                allowClear={false}
                locale={locale}
              />
            </Flex>
            <Flex justify='space-evenly' align='center' style={{ marginBottom: '10px' }}>
              <label>終了日</label>
              <DatePicker
                value={dayjs(filterObj.endDate)}
                onChange={onEndDateChange}
                allowClear={false}
                locale={locale}
              />
            </Flex>

            <Flex justify='space-evenly' align='center' style={{ marginBottom: '10px' }}>
              <label>&nbsp; リーグ &nbsp;</label>
              <Select
                value={filterObj.league || 2}
                options={leagueOptions}
                onChange={onLeagueChange}
                style={{
                  width: 200,
                }}
              />
            </Flex>

            <Flex justify='space-evenly' align='center' style={{ marginBottom: '20px', paddingBottom: '20px' }}>
              <label>カード名</label>
              <input
                type="text"
                value={filterObj.cardName || ""}
                onChange={(e) => setFilterObj(prev => ({ ...prev, cardName: e.target.value }))}
                placeholder="カード名を入力してください"
                style={{
                  width: 250,
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </Flex>

            <Flex justify='space-evenly' align='center' style={{ marginBottom: '20px', paddingBottom: '20px' }}>
              <label>カテゴリ(1)</label>
              <Select
                value={categoryName || ""}
                onChange={cardCategoryChange}
                placeholder="カテゴリを選択してください"
                style={{
                  width: 250,
                }}
                options={cardCategoryOptions_1}
              />
            </Flex><Flex justify='space-evenly' align='center' style={{ marginBottom: '20px', paddingBottom: '20px' }}>
              <label>カテゴリ(2)</label>
              <Select
                value={filterObj.category || ""}
                onChange={cardCategoryChange2}
                placeholder="カテゴリを選択してください"
                style={{
                  width: 250,
                }}
                options={cardCategoryOptions_2.filter(item => {
                  const firstCategoryIndex = cardCategoryOptions_1.findIndex(cat => cat.value === categoryName);
                  return item.index === firstCategoryIndex;
                })}
                disabled={!categoryName} // Disable if no first category is selected
              />
            </Flex>

            {/* Ranking Filters */}
            <div style={{ marginTop: '15px', marginBottom: '15px' }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#333', 
                marginBottom: '12px',
                textAlign: 'left'
              }}>
                順位
              </div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '12px',
                alignItems: 'center'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filterObj.ranks.winner}
                    onChange={(e) => handleRankChange('winner', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  優勝
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filterObj.ranks.runnerUp}
                    onChange={(e) => handleRankChange('runnerUp', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  準優勝
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filterObj.ranks.top4}
                    onChange={(e) => handleRankChange('top4', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  TOP4
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filterObj.ranks.top8}
                    onChange={(e) => handleRankChange('top8', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  TOP8
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filterObj.ranks.top16}
                    onChange={(e) => handleRankChange('top16', e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  TOP16
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '13px',
                  color: '#333',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filterObj.ranks.all}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  すべて
                </label>
              </div>
            </div>
            
          </Modal>
        </div>
    )
}

export default DeckCardPage;