import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import { selectSpecificDeckCount } from '../store/slices/deckCardSlice';

import styles from './index.module.scss';

const PokemonCard = ({data}) => {
  const countsArray = data.COUNT?.split(",") || [];
  const cardCountsArray = data.counts_array?.split(",") || [];
  const specificDeckCount = useSelector(selectSpecificDeckCount) || 1; // Avoid division errors
  return(
    <Card
      bordered={false}
      cover={
        <img
          alt="example"
          src={`https://www.pokemon-card.com/deck/deckView.php/deckID/${data.deck_ID_var}.png`}
          className={styles.cardImage}
        />
      }
      bodyStyle={{padding: "0"}}
      headStyle={{minHeight: "10px"}}
      className={styles.card}
    >
      <p className={styles.cardName}>{data.name_var}</p>
      <table className={styles.table}>
        <tbody className={styles.tableBody}>
          {countsArray.map((count, index) => (
            <tr key={index} className={styles.tableRow}>
              <td>{count && count}枚</td>
              <td>{cardCountsArray[index] ?? 0}回</td>
              <td>{specificDeckCount > 0 ? ((cardCountsArray[index] / specificDeckCount) * 100).toFixed(1) : '0.0'}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

export default PokemonCard;