import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Flex, Select, DatePicker, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs'; 

import PokemonCard from '../../components/PokemonCard';
import { setCards, setOpen } from '../../store/slices/pokemonSlice';
import { fetchCardCategories } from '../../store/slices/cardCategorySlice';
import styles from './index.module.scss';

const CardUsageRate = () => {
  const dispatch = useDispatch();

  const [filterObj, setFilterObj] = useState({
    startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    category: "ドラパルトex",
    league: 2
  }); // Replace with your default filter object

  const [fetchStatus, setFetchStatus] = useState(false);
  const openStatus = useSelector(state => state.pokemon.open);

  const cardCategoryOptions = useSelector((state) => state.cardCategory.cardCategories);
  const leagueOptions = useSelector((state) => state.cardCategory.leagueOptions);
  // This have to be removed
  useEffect(() => {
    console.log("filterObj==>", filterObj);
  }, [filterObj]);

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
  }, [fetchStatus, dispatch]);

  const handleFetchCards = () => {
    console.log("handleFetchCards is called");
    setFetchStatus((prev) => !prev);
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
    console.log("value==>", value);
    setFilterObj({
      ...filterObj,
      category: value
    });
  }

  const handleCancel = () => {
    dispatch(setOpen(!openStatus));
  }

  return (
    <>
      <section className={styles.wrapper}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Row
            gutter={[
              { xs: 4.5, sm: 4.5, md: 9, lg: 9 }, // horizontal gutter
              { xs: 8, sm: 8, md: 16, lg: 16 }, // vertical gutter
            ]}
          >
            {/* {cards.map((card, index) => (
              <PokemonCard key={index} data={card} />
            ))} */}
            <PokemonCard />
            <PokemonCard />
            <PokemonCard />
          </Row>
        )}

      <Modal
        open={openStatus}
        onCancel={handleCancel}
        onOk={handleFetchCards}
        okText="検索"
        cancelText="キャンセル"
        title="検索条件"
      >
        <Flex>
          <DatePicker 
            value={dayjs(filterObj.startDate)}
            onChange={onStartDateChange}
            allowClear={false}
          />
        </Flex>
        <Flex>
          <DatePicker 
            value={dayjs(filterObj.endDate)}
            onChange={onEndDateChange}
            allowClear={false}
          />
        </Flex>
        
        <Flex>
          <Select
            defaultValue={leagueOptions[0]?.value || 2}
            options={leagueOptions}
            onChange={onLeagueChange}
            style={{
              width: 200,
            }}
          />
        </Flex>

        <Flex gap={8}>
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