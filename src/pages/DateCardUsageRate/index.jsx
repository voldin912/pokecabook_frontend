import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDayCard, selectDayCard } from '../../store/slices/dayCardSlice';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import { Pagination } from 'antd';

const DateCardUsageRate = () => {
    const dispatch = useDispatch();
    const dayCard = useSelector(selectDayCard);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        dispatch(fetchDayCard());
    }, [dispatch]);

    useEffect(() => {
        setTotalItems(dayCard.length);
    }, [dayCard]);

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        dispatch(fetchDayCard());
    };

    return(
        <div className={styles.wrapper}>
            <div className={styles.dateCardWrapper}>
                {dayCard.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((card, index) => (
                    <div key={index} className={styles.dateCard}>
                        <picture>
                            <source srcSet={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.webp`} type="image/webp" />
                            <img src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${card.deck_ID_var}.png`} alt="deck_ID_var's image" />
                        </picture>
                        <p>{dayjs(card.event_date_date).format('YYYY年MM月DD日')} / {card.event_count} 会場</p>
                        <p>{card.event_title_var}</p>
                    </div>
                ))}
            </div>
            <Pagination
                current={currentPage}
                total={totalItems} // Make sure you have this value from your data
                pageSize={pageSize}
                onChange={handlePaginationChange}
                showSizeChanger={{
                    locale: {
                        items_per_page: '/ ページ'
                    }
                }}
                showTotal={(total) => `合計 ${total} 日`}
                showQuickJumper={{
                    goButton: <span>移動</span>,
                    input: {
                        placeholder: 'ページ番号を入力'
                    }
                }}
                pageSizeOptions={[12, 24, 48]}
                locale={{ items_per_page: "/ ページ", jump_to: "ページに移動", jump_to_confirm: "確認", page: "ページ", prev_page: "前のページ", next_page: "次のページ", prev_5: "前の5ページ", next_5: "次の5ページ", prev_3: "前の3ページ", next_3: "次の3ページ", page_size: "ページサイズ",}}
            />
        </div>
    )
}

export default DateCardUsageRate;