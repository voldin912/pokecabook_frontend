import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Flex, Select, DatePicker, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/ja_JP';
import PokemonCard from '../../components/PokemonCard';
import { setCardConds, setCards, setOpenSearch } from '../../store/slices/pokemonSlice';
import { fetchCardCategories } from '../../store/slices/cardCategorySlice';
import styles from './index.module.scss';

const groupNames = ["ACE SPEC", "ポケモン", "グッズ", "どうぐ", "サポート", "スタジアム", "エネルギー"];
const CardUsageRate = () => {
  const dispatch = useDispatch();

  const [filterObj, setFilterObj] = useState({
    startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    category: "タケルライコ",
    league: 2,
    ranks: {
      winner: true,
      runnerUp: true,
      top4: true,
      top8: true,
      top16: true,
      all: true 
    }
  }); // Replace with your default filter object

  const [fetchStatus, setFetchStatus] = useState(false);
  const [sortedCardsByCategory, setSortedCardsByCategory] = useState([]);
  const cards = useSelector(state => state.pokemon.cards);
  const [categoryName, setCategoryName] = useState('タケルライコ')
  const [categoryName_1, setCategoryName_1] = useState('')

  const postDetailCategory = async (xxx) => {
    try {
      const response = await axios.post(
        `https://playpokecabook.com/api/detailCategory`,
        // `${process.env.REACT_APP_BACKEND_URL}/api/detailCategory`,
        JSON.stringify({
          name: xxx
        }),
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data) {
        localStorage.setItem('conds', response.data.conds)
        console.log('****kohei', response.data)
      }
    } catch (err) {
      console.error("Request failed:", err?.response?.data || err.message);
    }
  };
  useEffect(() => {
    postDetailCategory();
  }, [])

  useEffect(() => {
    localStorage.setItem('category', categoryName)
  }, [categoryName])

  useEffect(() => {
    localStorage.setItem('category', 'タケルライコ')
  }, [])

  useEffect(() => {
    // Process cards whenever they change
    const grouped = cards.reduce((acc, card) => {
      const category = card.category_int;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(card);
      return acc;
    }, {});

    const sorted = Object.entries(grouped)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([category, categoryCards]) => ({
        category: groupNames[Number(category) - 1],
        cards: categoryCards
      }));

    setSortedCardsByCategory(sorted);
  }, [cards]); // Re-run when cards change
  const openStatus = useSelector(state => state.pokemon.openSearch);

  const cardCategoryOptions = useSelector((state) => state.cardCategory.cardCategories);
  const cardCategoryOptions_1 = useSelector((state) => state.cardCategory.cardCategories_1);
  const cardCategoryOptions_2 = useSelector((state) => state.cardCategory.cardCategories_2);
  const leagueOptions = useSelector((state) => state.cardCategory.leagueOptions);

  const cardCategoryOptions_3 = useMemo(() => {
    return cardCategoryOptions_2.filter(cat => cat.index === cardCategoryOptions_1.findIndex(cat => cat.value === categoryName_1))
  }, [cardCategoryOptions_1, cardCategoryOptions_2, categoryName_1])

  // This have to be removed

  useEffect(() => {
    dispatch(fetchCardCategories());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        console.log('filterObj', filterObj);
        const response = await axios.post(
          `https://playpokecabook.com/api/cards`,
          // `${process.env.REACT_APP_BACKEND_URL}/api/cards`,
          filterObj,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        dispatch(setCards(response.data));
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();

    //================

    if (categoryName) {
      postDetailCategory(categoryName);
    }

    //================

  }, [fetchStatus, dispatch]);

  const handleFetchCards = () => {
    setFetchStatus((prev) => !prev);
    dispatch(setOpenSearch(!openStatus));
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
    setCategoryName(value)
    let opt_2 =cardCategoryOptions_2.filter(cat => cat.index === cardCategoryOptions_1.findIndex(cat => cat.value === value))
    setFilterObj({
      ...filterObj,
      category: opt_2[0]?.value || value,
    });
  }


  const handleCancel = () => {
    dispatch(setOpenSearch(!openStatus));
  }

  // Ranking checkbox handlers
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

  const handleRankChange = (id, checked) => {
    setFilterObj(prev => {
      const newRank = {
        ...prev.ranks,
        [id]: checked
      };
      // Update all based on other checkboxes
      const allChecked = newRank.runnerUp && newRank.top4 && newRank.top8 && newRank.top16 && checked;
      return {
        ...prev,
        ranks: {
          ...newRank,
          all: allChecked
        }
      };
    });
  };

  return (
    <>
      <section className={styles.wrapper}>
      </section>
      <section className={styles.wrapper}>
        {loading ? (
          <p key="loading">Loading...</p>
        ) : (
          <>
            {sortedCardsByCategory.length > 0 && sortedCardsByCategory.map(({ category, cards }, index) => (
              <Row
                gutter={{ xs: 24.5, sm: 24.5, md: 29, lg: 29 }} // horizontal gutter
                vertical={true}
              >
                <div key={category}>
                  <h2 key={index}>{category}</h2>
                  <div className={styles.cardContainer}>
                    {cards.map((card, index) => (
                      <PokemonCard data={card} />
                    ))}
                  </div>
                </div>
              </Row>
            ))}
            {
              sortedCardsByCategory.length == 0 && <div>
                カテゴリに該当するデッキがありません。
              </div>
            }
          </>
        )}

        <Modal
          open={openStatus}
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

          <Flex justify='space-evenly' align='center'>
            <label>カテゴリ(1)</label>
            <Select
              defaultValue={cardCategoryOptions[0]?.value || "タケルライコ"}
              onChange={(value) => {
                cardCategoryChange(value)
                setCategoryName_1(value)
              }}
              style={{
                width: 250,
              }}
              options={cardCategoryOptions_1}
            />
          </Flex>
          {cardCategoryOptions_3.length > 0 && (
            <Flex justify='space-evenly' align='center' style={{ marginTop: '10px', marginBottom: '20px', paddingBottom: '20px' }}>
              <label>カテゴリ(2)</label>
              <Select
                defaultValue={filterObj.category}
                onChange={cardCategoryChange}
                style={{
                  width: 250,
                }}
                options={cardCategoryOptions_3}
              />
            </Flex>
          )}

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
      </section>
    </>
  );
};

export default CardUsageRate; 