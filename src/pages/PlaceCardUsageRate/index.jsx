import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaceCard, fetchTotalPlaceCardLength, selectPlaceCard, selectStatus, selectTotalPlaceCardLength } from '../../store/slices/placeCardSlice';
import { Pagination } from 'antd';
import dayjs from 'dayjs';
import styles from './index.module.scss';

const pageSizeOptions = [12, 24, 48];
const PlaceCardUsageRate = () => {
    const dispatch = useDispatch();
    const placeCard = useSelector(selectPlaceCard);
    const status = useSelector(selectStatus);
    const totalPlaceCardLength = useSelector(selectTotalPlaceCardLength);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

    useEffect(() => {
        dispatch(fetchTotalPlaceCardLength());               // Just for the first render
        dispatch(fetchPlaceCard({ page: 1, pageSize: 12 }));   // Just for the first render
    }, []);

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        dispatch(fetchPlaceCard({ page, pageSize }));
    };

    return(
        <div className={styles.wrapper}>
            {status === 'succeeded' && (
                <div className={styles.placeCardWrapper}>
                    {placeCard.map((card) => (
                        <div key={card.deck_ID_var} className={styles.placeCard}>
                            <picture>
                                <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.webp`} type="image/webp" />
                                <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.png`} alt="deck_ID_var's image" />
                            </picture>
                            <p>{dayjs(card.event_date_date).format('YYYY年MM月DD日')} {card.event_place_var}</p>
                            <span>{dayjs(card.event_date_date).format('YYYY.MM.DD')} </span>
                        </div>
                    ))}
                </div>
            )}
            <Pagination
                current={currentPage}
                total={totalPlaceCardLength} // Make sure you have this value from your data
                pageSize={pageSize}
                onChange={handlePaginationChange}
                showSizeChanger={{
                    locale: {
                        items_per_page: '/ ページ'
                    }
                }}
                showTotal={(total) => `合計 ${total} イベント`}
                showQuickJumper={{
                    goButton: <span>移動</span>,
                    input: {
                        placeholder: 'ページ番号を入力'
                    }
                }}
                pageSizeOptions={pageSizeOptions}
                locale={{ items_per_page: "/ ページ", jump_to: "ページに移動", jump_to_confirm: "確認", page: "ページ", prev_page: "前のページ", next_page: "次のページ", prev_5: "前の5ページ", next_5: "次の5ページ", prev_3: "前の3ページ", next_3: "次の3ページ", page_size: "ページサイズ",}}
            />
        </div>
    )
}

export default PlaceCardUsageRate;