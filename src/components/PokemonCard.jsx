import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import { selectSpecificDeckCount } from '../store/slices/pokemonSlice';

import styles from './index.module.scss';

const PokemonCard = ({data}) => {
  const countsArray = data.COUNT.split(",");
  const cardCountsArray = data.counts_array.split(",");
  const specificDeckCount = useSelector(selectSpecificDeckCount);
  return(
    <Card
      bordered={false}
      cover={
        <img
          alt="example"
          src={`https://www.pokemon-card.com/assets/images/card_images/large/${data.image_var}.jpg`}
          style={{paddingLeft: "3%", paddingRight: "3%"}}
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
              <td>{cardCountsArray[index] && cardCountsArray[index]}回</td>
              <td>{(cardCountsArray[index] / specificDeckCount * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

export default PokemonCard;