import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeckCard, fetchTotalDeckCardLength, selectDeckCard, selectStatus, selectTotalDeckCardLength, setOpenDeckSearch } from '../../store/slices/deckCardSlice';
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
    const [categoryName, setCategoryName] = useState('ドラパルトex')
    
    const openDeck = useSelector(state => state.deckCard.openDeck);
    const [totalDeckCardLength, setTotalDeckCardLength] = useState(0);
    const totalDeckCard = useSelector(selectDeckCard);
    const [deckCard, setDeckCard] = useState([]);
    const status = useSelector(selectStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
    const [filterObj, setFilterObj] = useState({
      startDate: '2025-03-29',
      endDate: '2025-04-05',
      category: "",
      cardName: "",
      league: 2
    });
    const cardCategoryOptions = useSelector((state) => state.cardCategory.cardCategories);
    const leagueOptions = useSelector((state) => state.cardCategory.leagueOptions);
    
    useEffect(() => {
        dispatch(fetchDeckCard({ page: 1, pageSize: 12, filterObj }));   // Just for the first render
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
        dispatch(fetchDeckCard({ page: currentPage, pageSize: 12, filterObj }));
    };
  const handleCancel = () => {
    dispatch(setOpenDeckSearch(!openDeck));
  }
  const handleFetchCards = () => {
    setFetchStatus((prev) => !prev);
    console.log(filterObj, "filterObj");
    dispatch(fetchDeckCard({ page: currentPage, pageSize: 12, filterObj }));   // Just for the first render
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
    console.log(value, "value");
    setFilterObj({
      ...filterObj,
      category: value,
    });
    setCategoryName(value)
  }

    return(
        <div className={styles.wrapper}>
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
                defaultValue={leagueOptions[0]?.value || 2}
                options={leagueOptions}
                onChange={onLeagueChange}
                style={{
                  width: 200,
                }}
              />
            </Flex>

            <Flex justify='space-evenly' align='center' style={{ marginBottom: '20px', paddingBottom: '20px' }}>
              <label>カテゴリ</label>
              <Select
                defaultValue={cardCategoryOptions[0]?.value || "ドラパルトex"}
                onChange={cardCategoryChange}
                style={{
                  width: 250,
                }}
                options={cardCategoryOptions}
              />
            </Flex>
            
          </Modal>
        </div>
    )
}

export default DeckCardPage;