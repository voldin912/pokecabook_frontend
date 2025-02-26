import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './dateCardUsageDetail.module.scss';
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"; // Import icons

const DateCardUsageDetail = () => {
    const { event_holding_date } = useParams();
    const [processedDateCard, setProcessedDateCard] = useState([]);
    const [openSections, setOpenSections] = useState({});
    const sectionRefs = useRef({}); // 各タイトルのrefを管理

    const transformData = (data) => {
        return data.reduce((acc, item) => {
            const { place_var, deck_ID_var, point_int, rank_int } = item;
            let placeEntry = acc.find(entry => entry.place_name === place_var);

            if (!placeEntry) {
                placeEntry = { place_name: place_var, deck_ID_var: [], point_int: [], rank_int: [] };
                acc.push(placeEntry);
            }

            placeEntry.deck_ID_var.push(deck_ID_var);
            placeEntry.point_int.push(point_int);
            placeEntry.rank_int.push(rank_int);

            return acc;
        }, []);
    };

    useEffect(() => {
        const fetchDateCard = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/date-card/${event_holding_date}`);
                setProcessedDateCard(transformData(data));
            } catch (error) {
                console.error("Error fetching date card:", error);
            }
        };
        fetchDateCard();
    }, [event_holding_date]);

    // セクションを開くときにスクロール
    const toggleSection = (placeName) => {
        setOpenSections(prev => {
            const newState = { ...prev, [placeName]: !prev[placeName] };

            // 他のセクションを閉じる（1つだけ開く動作）
            Object.keys(newState).forEach(key => {
                if (key !== placeName) newState[key] = false;
            });

            return newState;
        });

        // スクロール処理
        setTimeout(() => {
            sectionRefs.current[placeName]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    return (
        <div className={styles.dateCardWrapper}>
            {processedDateCard.map((item) => (
                <div key={item.place_name} className={styles.wrapper} ref={(el) => sectionRefs.current[item.place_name] = el}>
                    <div className={styles.titleWrapper} onClick={() => toggleSection(item.place_name)}>
                        <p className={styles.title}>{item.place_name}</p>
                        {openSections[item.place_name] ? (
                            <ChevronUp size={20} className={styles.icon} />
                        ) : (
                            <ChevronDown size={20} className={styles.icon} />
                        )}
                    </div>

                    <div className={`${styles.decksWrapper} ${openSections[item.place_name] ? styles.show : styles.hide}`}>
                        {item.deck_ID_var.map((subItem, index) => (
                            <div key={index}>
                                <div className={styles.order} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "10px" }}>
                                    <p style={{ paddingTop: "15px" }}>
                                        {item.rank_int[index] === 1 ? "優勝" : item.rank_int[index] === 2 ? "準優勝" : `TOP${item.rank_int[index] + (item.rank_int[index] === 5 ? 3 : 7)}`} 
                                        &nbsp;<span className={styles.point}>{item.point_int[index]}pt</span>
                                    </p>
                                    <a href={`https://www.pokemon-card.com/deck/deck.html?${item.deck_ID_var[index]}`}><ExternalLink size={20} color="black" /></a>
                                </div>
                                <picture>
                                    <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${subItem}.webp`} type="image/webp" />
                                    <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${subItem}.png`} alt={subItem} />
                                </picture>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DateCardUsageDetail;
