import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './dateCardUsageDetail.module.scss';
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"; // Import icons

const DateCardUsageDetail = () => {
    const { event_holding_date } = useParams();
    const [processedDateCard, setProcessedDateCard] = useState([]);
    const [openSections, setOpenSections] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sectionRefs = useRef({}); // 各タイトルのrefを管理

    const transformData = (data) => {
        return data.reduce((acc, item) => {
            const { place_var, deck_ID_var, player_name, player_id, region, point_int, rank_int } = item;
            console.log("item==>", item);
            let placeEntry = acc.find(entry => entry.place_var === place_var);

            if (!placeEntry) {
                placeEntry = {
                    place_var,
                    deck_ID_var: [],
                    point_int: [],
                    rank_int: [],
                    player_name: [],
                    player_id: [],
                    region: []
                };
                acc.push(placeEntry);
            }

            placeEntry.deck_ID_var.push(deck_ID_var);
            placeEntry.point_int.push(point_int);
            placeEntry.rank_int.push(rank_int);
            placeEntry.player_name.push(player_name);
            placeEntry.player_id.push(player_id);
            placeEntry.region.push(region);
            return acc;
        }, []);
    };

    useEffect(() => {
        const fetchDateCard = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log("Fetching data for date:", event_holding_date);
                
                // Try the enhanced endpoint first
                try {
                    const { data } = await axios.get(`https://playpokecabook.com/api/date-card-enhanced/${event_holding_date}`);
                    console.log("Enhanced API response:", data);
                    console.log("transform Data",transformData(data))
                    setProcessedDateCard(transformData(data));
                } catch (enhancedError) {
                    console.log("Enhanced API failed, trying original endpoint:", enhancedError);
                    
                    // Fallback to original endpoint
                    const { data } = await axios.get(`https://playpokecabook.com/api/date-card/${event_holding_date}`);
                    console.log("Original API response:", data);
                    setProcessedDateCard(transformData(data));
                }
            } catch (error) {
                console.error("Error fetching date card:", error);
                setError("データの取得に失敗しました。");
                setProcessedDateCard([]);
            } finally {
                setLoading(false);
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
            {loading && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>データを読み込み中...</p>
                </div>
            )}
            
            {error && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                    <p>{error}</p>
                    <p>Date: {event_holding_date}</p>
                </div>
            )}
            
            {!loading && !error && processedDateCard.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>この日付のデータが見つかりません。</p>
                    <p>Date: {event_holding_date}</p>
                </div>
            )}
            
            {!loading && !error && processedDateCard.map((item) => (
                <div key={item.place_var} className={styles.wrapper} ref={(el) => sectionRefs.current[item.place_var] = el}>
                    <div className={styles.titleWrapper} onClick={() => toggleSection(item.place_var)}>
                        <p className={styles.title}>{item.place_var}</p>
                        {openSections[item.place_var] ? (
                            <ChevronUp size={20} className={styles.icon} />
                        ) : (
                            <ChevronDown size={20} className={styles.icon} />
                        )}
                    </div>

                    <div className={`${styles.decksWrapper} ${openSections[item.place_var] ? styles.show : styles.hide}`}>
                        {item.deck_ID_var.map((subItem, index) => (
                            <div key={index} className='flex flex-col gap-2'>
                                <div className={styles.order} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "10px" }}>
                                    <p style={{ paddingTop: "15px" }}>
                                        {item.rank_int[index] === 1 ? "優勝" : item.rank_int[index] === 2 ? "準優勝" : `TOP${item.rank_int[index] + (item.rank_int[index] === 5 ? 3 : 7)}`}
                                        &nbsp;<span className={styles.point}>{item.point_int[index]}pt</span>
                                    </p>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <p style={{ margin: 0 }}>
                                            ユーザー名: {item.player_name[index]} プレイヤーID: {item.player_id[index]}
                                        </p>
                                    </div>
                                    <a href={`https://www.pokemon-card.com/deck/deck.html?${item.deck_ID_var[index]}`}><ExternalLink size={20} color="black" /></a>
                                </div>
                                <picture>
                                    <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${subItem}.webp`} type="image/webp" />
                                    <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${subItem}.png`} alt={subItem} />
                                </picture>
                                <div className={styles.order} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingInline: "10px" }}>
                                    <p>{item.place_var}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DateCardUsageDetail;
