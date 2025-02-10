import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import styles from './placeCardUsageDetail.module.scss';

const PlaceCardUsageDetail = () => {
    const { event_holding_id } = useParams();
    console.log(event_holding_id);
    const dispatch = useDispatch();
    const [placeCard, setPlaceCard] = useState([]);

    useEffect(() => {
        const fetchPlaceCard = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/place-card/${event_holding_id}`);
                setPlaceCard(response.data);
            } catch (error) {
                console.error("Error fetching place card:", error);
            }
        };
        fetchPlaceCard();
    }, [event_holding_id]);

    console.log("placeCard==>", placeCard);

    return <div className={styles.wrapper}>
        <div className={styles.placeCardWrapper}>
            {placeCard.map((card) => (
                <div key={card.deck_ID_var} className={styles.placeCard}>
                    <picture>
                        <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.webp`} type="image/webp" />
                        <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.png`} alt={card.deck_ID_var} />
                    </picture>
                    <p>{card.rank_int === 1 ? "優勝" : card.rank_int === 2 ? "準優勝" : `ベスト${card.rank_int}`}</p>
                </div>
            ))}
        </div>
    </div>;
};

export default PlaceCardUsageDetail;