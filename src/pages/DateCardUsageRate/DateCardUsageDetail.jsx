import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './dateCardUsageDetail.module.scss';

const DateCardUsageDetail = () => {
    const { event_holding_date } = useParams();
    const [dateCard, setDateCard] = useState([]);

    useEffect(() => {
        const fetchDateCard = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/date-card/${event_holding_date}`);
                setDateCard(response.data);
            } catch (error) {
                console.error("Error fetching date card:", error);
            }
        };
        fetchDateCard();
    }, [event_holding_date]);

    console.log("dateCard==>", dateCard);

    return <div className={styles.wrapper}>
        <div className={styles.dateCardWrapper}>
            hello here!
            {/* {dateCard.map((card) => (
                <div key={card.deck_ID_var} className={styles.dateCard}>
                    <picture>
                        <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.webp`} type="image/webp" />
                        <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.png`} alt={card.deck_ID_var} />
                    </picture>
                    <p>{card.rank_int === 1 ? "優勝" : card.rank_int === 2 ? "準優勝" : `ベスト${card.rank_int}`}</p>
                </div>
            ))} */}
        </div>
    </div>;
};

export default DateCardUsageDetail;