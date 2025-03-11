import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Flex, Select, DatePicker, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/ja_JP';
import PokemonCard from '../../components/PokemonCard';
import { setCardConds, setCards, setOpen } from '../../store/slices/pokemonSlice';
import { fetchCardCategories } from '../../store/slices/cardCategorySlice';
import styles from './index.module.scss';

const groupNames = ["ACE SPEC", "ポケモン", "グッズ", "どうぐ", "サポート", "スタジアム", "エネルギー"];
const CardUsageRate = () => {
  const dispatch = useDispatch();

  const [filterObj, setFilterObj] = useState({
    startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    category: "ドラパルトex",
    league: 2
  }); // Replace with your default filter object

  const [fetchStatus, setFetchStatus] = useState(false);
  const [sortedCardsByCategory, setSortedCardsByCategory] = useState([]);
  const cards = useSelector(state => state.pokemon.cards);
  const [categoryName, setCategoryName] = useState('ドラパルトex')

  const postDetailCategory = async (xxx) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/detailCategory`, 
        JSON.stringify({
          name: xxx
        }), 
        { headers: { "Content-Type": "application/json" } }
      );
      if(response.data) {
        localStorage.setItem('conds', response.data.conds)
        console.log('****kohei',response.data)
      }
    } catch (err) {
      console.error("Request failed:", err?.response?.data || err.message);
    }
  };
  useEffect(() => {
    postDetailCategory();
  },[]) 
  
  useEffect(() => {
    localStorage.setItem('category', categoryName)
  }, [categoryName])

  useEffect(()=> {
    localStorage.setItem('category', 'ドラパルトex')
  },[])

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
        cards: categoryCards.sort((a, b) => a.name_var.localeCompare(b.name_var))
      }));

    setSortedCardsByCategory(sorted);
  }, [cards]); // Re-run when cards change
  const openStatus = useSelector(state => state.pokemon.open);

  const cardCategoryOptions = useSelector((state) => state.cardCategory.cardCategories);
  const leagueOptions = useSelector((state) => state.cardCategory.leagueOptions);
  // This have to be removed


  useEffect(() => {
    dispatch(fetchCardCategories());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/cards`,
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

    if(categoryName){
      postDetailCategory(categoryName);
    }

    //================

  }, [fetchStatus, dispatch]);

  useEffect(() => {

  }, [])

  const handleFetchCards = () => {
    setFetchStatus((prev) => !prev);
    dispatch(setOpen(!openStatus));
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


  const handleCancel = () => {
    dispatch(setOpen(!openStatus));
  }

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

          <Flex justify='space-evenly' align='center' style={{ marginBottom: '20px', paddingBottom: '20px' }}>
            <label>カテゴリ</label>
            <Select
              defaultValue={cardCategoryOptions[0]?.value || "ドラパルトex"}
              onChange={cardCategoryChange}
              style={{
                width: 200,
              }}
              options={cardCategoryOptions}
            />
          </Flex>
        </Modal>
      </section>
    </>
  );
};

export default CardUsageRate; 