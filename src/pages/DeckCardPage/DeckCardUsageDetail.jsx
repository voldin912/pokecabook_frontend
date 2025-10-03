import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import styles from './deckCardUsageDetail.module.scss';
import { ExternalLink } from "lucide-react";

const DeckCardUsageDetail = () => {
    const { event_holding_id } = useParams();
    console.log(event_holding_id);
    // const dispatch = useDispatch();
    const [deckCard, setDeckCard] = useState([]);

    useEffect(() => {
        const fetchDeckCard = async () => {
            try {
                const response = await axios.get(`https://playpokecabook.com/api/decks/${event_holding_id}`);
        // `${process.env.REACT_APP_BACKEND_URL}/api/decks/${event_holding_id}`
        console.log("response data",response.data)
                setDeckCard(response.data);
            } catch (error) {
                console.error("Error fetching deck card:", error);
            }
        };
        fetchDeckCard();
    }, [event_holding_id]);
    useEffect(()=>{
        console.log(process.env.REACT_APP_BACKEND_URL,"backend url");
    },[])
    console.log("deckCard==>", deckCard);
    return <div className={styles.deckCardWrapper}>
        <div className={styles.deckCardWrapper}>
            {deckCard.map((card) => (
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

export default DeckCardUsageDetail;