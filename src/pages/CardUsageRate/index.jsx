import React from 'react';
import { Row } from 'antd';

import PokemonCard from '../../components/PokemonCard';
import styles from './index.module.scss';

const CardUsageRate = () => {
  return (
    <>
      {/* <section className={`${styles.wrapper} chart`}>
        
      </section> */}

      <section className={styles.wrapper}>
        <Row gutter={[
            { xs: 4.5, sm: 4.5, md: 9, lg: 9 },  // horizontal gutter
            { xs: 8, sm: 8, md: 16, lg: 16 }   // vertical gutter
          ]}>
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
          <PokemonCard />
        </Row>
      </section>

    </>
  );
};

export default CardUsageRate;