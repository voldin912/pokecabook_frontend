import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import styles from './placeCardUsageDetail.module.scss';
import { ExternalLink } from "lucide-react";

const PlaceCardUsageDetail = () => {
    const { event_holding_id } = useParams();
    console.log(event_holding_id);
    // const dispatch = useDispatch();
    const [placeCard, setPlaceCard] = useState([]);

    useEffect(() => {
        const fetchPlaceCard = async () => {
            try {
                const response = await axios.get(`https://playpokecabook.com/api/place-card/${event_holding_id}`);
        // `${process.env.REACT_APP_BACKEND_URL}/api/place-card/${event_holding_id}`
                setPlaceCard(response.data);
            } catch (error) {
                console.error("Error fetching place card:", error);
            }
        };
        fetchPlaceCard();
    }, [event_holding_id]);
    useEffect(()=>{
        console.log(process.env.REACT_APP_BACKEND_URL,"backend url");
    },[])
    console.log("placeCard==>", placeCard);
    return <div className={styles.placeCardWrapper}>
        <div className={styles.placeCardWrapper}>
            {placeCard.map((card) => (
                <div key={card.deck_ID_var} className={styles.wrapper}>
                    <div className={styles.decksWrapper}>
                        <div className= {styles.order} style={{display : "flex", justifyContent : "space-between", alignItems:"center", width : "100%", paddingInline:"10px"}}>
                            <p style={{paddingTop:"15px"}}>{card.rank_int === 1 ? "優勝" : card.rank_int === 2 ? "準優勝" : card.rank_int === 3 ? `ベスト${card.rank_int + 1}` : 
                            card.rank_int === 5 ? `ベスト${card.rank_int + 3}` : `ベスト${card.rank_int + 7}`}</p>
                            <a href={`https://www.pokemon-card.com/deck/deck.html?${card.deck_ID_var}`}><ExternalLink size={20} color="black" /></a>
                        </div>
                        <picture>
                            <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.webp`} type="image/webp" />
                            <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.png`} alt={card.deck_ID_var} />
                        </picture>
                    </div>
                </div>
            ))}
        </div>
    </div>;
};

export default PlaceCardUsageDetail;