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
    cardCategory: 1
  }); // Replace with your default filter object
  const openStatus = useSelector(state => state.pokemon.open);

  const tempCardCategories = useSelector((state) => state.cardCategory.cardCategories);
  const [cardCategories, setCardCategories] = useState(tempCardCategories);

  const options = useSelector((state) => state.cardCategory.cardCategories);
  console.log("options==>", options);

  useEffect(() => {
    setCardCategories(tempCardCategories);
    console.log("cardCategories_here==>", tempCardCategories);
  }, [tempCardCategories]);

  useEffect(() => {
    dispatch(fetchCardCategories());
  }, [dispatch]);

  useEffect(() => {
    setFilterObj({
      ...filterObj,
      cardCategory: cardCategories
    });
    console.log("filterObj_here==>", filterObj);
  }, [filterObj]);

  const [loading, setLoading] = useState(false);

  // const { startDate, endDate } = useSelector((state) => state.pokemon);

  useEffect(() => {
    // Fetch data on initial render
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
        dispatch(setCards(response.data)); // Assuming the response contains the card list

        // const cardCategory = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/card-category`);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

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

  const cardCategoryChange = (value) => {
    console.log("value==>", value);
    setFilterObj({
      ...filterObj,
      cardCategory: value
    });
  }

  const handleCancel = () => {
    dispatch(setOpen(!openStatus));
    console.log("handleCancel is called and the backend fetch have to becalled");
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
        onOk={handleCancel}
      >
        <Flex gap={8}>
          <Select
            // defaultValue=""
            onChange={cardCategoryChange}
            style={{
              width: 200,
            }}
            options={options}
          />
        </Flex>
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
      </Modal>
      </section>
    </>
  );
};

export default CardUsageRate;